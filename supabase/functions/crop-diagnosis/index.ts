import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { mode, symptoms, cropName, imageBase64 } = await req.json();

    let userContent: any;

    if (mode === "image" && imageBase64) {
      userContent = [
        {
          type: "text",
          text: `You are an expert agricultural AI assistant for farmers in Rwanda. Analyze this crop image and provide a diagnosis.

Respond in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "severity": "good" | "warning" | "danger",
  "diagnosis_en": "Brief diagnosis in English",
  "diagnosis_ki": "Brief diagnosis in Kinyarwanda",
  "disease_or_issue_en": "Name of disease/pest/deficiency in English",
  "disease_or_issue_ki": "Name in Kinyarwanda",
  "solutions_en": ["Solution 1", "Solution 2", "Solution 3"],
  "solutions_ki": ["Umuti 1", "Umuti 2", "Umuti 3"],
  "prevention_en": ["Prevention tip 1", "Prevention tip 2"],
  "prevention_ki": ["Inama 1", "Inama 2"]
}`,
        },
        {
          type: "image_url",
          image_url: { url: imageBase64 },
        },
      ];
    } else {
      userContent = `You are an expert agricultural AI assistant for farmers in Rwanda. A farmer describes their crop problem:

Crop: ${cropName || "Unknown"}
Symptoms: ${symptoms}

Provide a diagnosis. Respond in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "severity": "good" | "warning" | "danger",
  "diagnosis_en": "Brief diagnosis in English",
  "diagnosis_ki": "Brief diagnosis in Kinyarwanda",
  "disease_or_issue_en": "Name of disease/pest/deficiency in English",
  "disease_or_issue_ki": "Name in Kinyarwanda",
  "solutions_en": ["Solution 1", "Solution 2", "Solution 3"],
  "solutions_ki": ["Umuti 1", "Umuti 2", "Umuti 3"],
  "prevention_en": ["Prevention tip 1", "Prevention tip 2"],
  "prevention_ki": ["Inama 1", "Inama 2"]
}`;
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: userContent,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No response from AI");

    // Parse the JSON from the AI response
    let diagnosis;
    try {
      // Remove potential markdown code blocks
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      diagnosis = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI diagnosis");
    }

    return new Response(JSON.stringify(diagnosis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crop-diagnosis error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
