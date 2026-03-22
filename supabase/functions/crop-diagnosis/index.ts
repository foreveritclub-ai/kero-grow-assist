import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RWANDA_CROPS = `Common crops & plants in Rwanda (Season A & B 2024 agricultural survey + additional):

CEREALS: Maize (Ibigori), Rice (Umuceri), Sorghum (Amasaka), Wheat (Ingano), Finger Millet (Uburo), Barley

LEGUMES: Beans (Ibishyimbo), Soybeans (Soya), Groundnuts (Ubunyobwa), Peas (Amashaza), Lentils, Chickpeas, Cowpeas

TUBERS & ROOTS: Irish Potatoes (Ibirayi), Sweet Potatoes (Ibijumba), Cassava (Imyumbati), Yams (Ibikoro), Taro (Amateke)

VEGETABLES: Tomatoes (Inyanya), Onions (Ibinyabuntu), Cabbage (Amashu), Carrots (Karoti), Eggplant (Intoryi), Peppers (Urusenda), Amaranth (Imbwija), Spinach (Epinari), Leeks, Lettuce, Cucumber, Zucchini/Courgette, Green beans (Imiteja), Beetroot, Radish, Celery, Pumpkin (Igihaza), Watermelon, Garlic (Tungurusumu), Ginger (Tangawizi), Chili peppers

FRUITS: Banana/Plantain (Ibitoki), Avocado (Avoka), Mango (Imyembe), Passion fruit (Marakuja), Pineapple (Inanasi), Tree tomato/Tamarillo (Ikinyomoro), Papaya (Ipapayi), Guava (Amapera), Oranges (Amacunga), Lemons (Indimu), Strawberries, Apple, Plum, Grapes, Lychee, Jackfruit

CASH CROPS: Coffee (Ikawa), Tea (Icyayi), Pyrethrum, Sugarcane (Igisheke), Tobacco, Macadamia, Stevia

OIL CROPS: Sunflower (Imbuto z'izuba), Palm oil, Sesame, Castor

TREES & FORESTRY: Eucalyptus, Grevillea, Pine, Bamboo, Moringa, Calliandra, Leucaena, Albizia, Jacaranda, Cypress, Cedrela, Acacia

FLOWERS & ORNAMENTALS: Roses, Lilies, Chrysanthemums, Carnations, Gladiolus, Gerbera, Orchids, Marigold, Bougainvillea, Hibiscus, Bird of Paradise, Sunflower (ornamental)

SPICES & HERBS: Basil, Mint, Rosemary, Thyme, Lemongrass, Coriander, Parsley, Dill, Fennel, Vanilla, Cinnamon, Cardamom, Turmeric, Black pepper

FODDER & PASTURE: Napier grass, Brachiaria, Desmodium, Clover, Alfalfa, Rhodes grass, Kikuyu grass

MUSHROOMS: Oyster mushrooms (Ibihumyo), Shiitake, Button mushrooms`;

const SYSTEM_PROMPT = `You are Kero, an agricultural assistant for farmers in Rwanda.

${RWANDA_CROPS}

For every problem:
- Identify crop and issue
- Give TWO types of solutions:

1. ⚡ Emergency solution:
- Simple, immediate, low-cost
- Use locally available resources (ash, water, soap, removing leaves)

2. 🛠 Proper solution:
- Best long-term fix
- Include fertilizers, pesticides, or recommended products available in Rwanda

Rules:
- Speak in Kinyarwanda first, then English
- Use simple, clear language
- Be friendly and supportive
- Do not use complex scientific terms
- Always reassure the farmer

Respond in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
{
  "severity": "good" | "warning" | "danger",
  "greeting_ki": "👋 short greeting in Kinyarwanda",
  "greeting_en": "👋 short greeting in English",
  "diagnosis_en": "Brief diagnosis in English",
  "diagnosis_ki": "Brief diagnosis in Kinyarwanda",
  "disease_or_issue_en": "Name of disease/pest/deficiency in English",
  "disease_or_issue_ki": "Name in Kinyarwanda",
  "emergency_solution_en": "⚡ Simple immediate solution in English using local resources",
  "emergency_solution_ki": "⚡ Igisubizo cyihuse mu Kinyarwanda",
  "proper_solution_en": "🛠 Long-term proper solution in English with product names",
  "proper_solution_ki": "🛠 Igisubizo cyiza cy'igihe kirekire mu Kinyarwanda",
  "solutions_en": ["Solution 1", "Solution 2", "Solution 3"],
  "solutions_ki": ["Umuti 1", "Umuti 2", "Umuti 3"],
  "prevention_en": ["Prevention tip 1", "Prevention tip 2"],
  "prevention_ki": ["Inama 1", "Inama 2"],
  "encouragement_ki": "💚 Encouraging message in Kinyarwanda",
  "encouragement_en": "💚 Encouraging message in English"
}`;

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
          text: `Analyze this crop image from a Rwandan farm. Identify the problem and provide solutions.\n\n${SYSTEM_PROMPT}`,
        },
        {
          type: "image_url",
          image_url: { url: imageBase64 },
        },
      ];
    } else {
      userContent = `A Rwandan farmer describes their crop problem:\n\nCrop: ${cropName || "Unknown"}\nSymptoms: ${symptoms}\n\n${SYSTEM_PROMPT}`;
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
            { role: "user", content: userContent },
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

    let diagnosis;
    try {
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
