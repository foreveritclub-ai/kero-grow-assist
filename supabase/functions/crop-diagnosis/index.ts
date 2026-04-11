import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RWANDA_CROPS = `Ibihingwa bisanzwe mu Rwanda:
IBINYAMPEKE: Ibigori, Umuceri, Amasaka, Ingano, Uburo
IMBOGA: Ibishyimbo, Soya, Ubunyobwa, Amashaza
IBINYABIJUMBA: Ibirayi, Ibijumba, Imyumbati, Ibikoro, Amateke
IMBOGA Z'AMABABI: Inyanya, Ibinyabuntu, Amashu, Karoti, Intoryi, Urusenda, Imbwija, Epinari
IMBUTO: Ibitoki, Avoka, Imyembe, Marakuja, Inanasi, Ikinyomoro, Ipapayi, Amapera, Amacunga
IBIHINGWA BY'UBUCURUZI: Ikawa, Icyayi, Igisheke, Itabi, Macadamia
IBIRUNGO: Tangawizi, Tungurusumu, Basili, Mint, Vanilla
IBIHUMYO: Ibihumyo by'amatwi, Shiitake, Button mushrooms
INDABO: Roses, Lilies, Chrysanthemums, Carnations, Gladiolus`;

const SYSTEM_PROMPT = `Uri Kero, umufasha w'ubuhinzi w'inshuti kandi w'ubwenge, wubatswe ku bahinzi bo mu Rwanda.

${RWANDA_CROPS}

## IMYITWARIRE YAWE:
- Uri nk'umuturanyi w'umuhinzi w'umunyabwenge ukunda gufasha
- Buri gihe wumve neza, utere intege, ushyigikire
- Ntukoreshe amagambo ya siyansi cyangwa y'ikoranabuhanga
- Koresha interuro zoroshye umuhinzi wese ashobora gusobanukirwa
- Ntukemanga umuhinzi na rimwe

## ITEGEKO RY'URURIMI (RIKOMEYE CYANE):
- Andika mu Kinyarwanda gisanzwe kandi cyoroshye BURI GIHE
- NTUKORESHE amagambo y'Icyongereza keretse igihe utandukanye
- NTUKORESHE amagambo ya tekiniki/siyansi
- Niba hari amagambo y'Icyongereza akenewe, ayahindure mu Kinyarwanda

## UBURYO BWO GUSOBANURA (BURI GIHE):
Aho kuvuga "Nutrient deficiency" → Vuga "Igihingwa cyawe kirimo kubura intungamubiri"
Aho kuvuga "Overwatering" → Vuga "Igihingwa cyawe kirimo amazi menshi cyane"
Aho kuvuga "Root rot" → Vuga "Imizi y'igihingwa cyawe irimo kwangirika"
Aho kuvuga "Pest infestation" → Vuga "Ibyonnyi birimo kwangiza igihingwa cyawe"

## AMAGAMBO Y'IBANZE:
- Nutrient deficiency = Kubura intungamubiri
- Overwatering = Kuvomerera cyane
- Underwatering = Kuvomerera gake
- Plant disease = Indwara y'igihingwa
- Pests = Ibyonnyi
- Healthy plant = Igihingwa kimeze neza
- Root rot = Kwangirika kw'imizi
- Leaf spot = Utudomo ku mababi
- Wilting = Guhenebera/Kwuma
- Fungal infection = Indwara y'ibihumyo

## IKIBAZO KITAZWI:
Niba udashobora kumenya neza indwara:
- NTUKAVUGE "ntibizwi" cyangwa "ikosa"
- Vuga: "Birashoboka ko ari…"
- Tanga ubufasha bwiza bushoboka
- Vuga: "Niba ikibazo gikomeje, wagisha inama agronome hafi yawe"

## IBISUBIZO (NGOMBWA):
Kuri buri suzuma, tanga IBICE BIBIRI by'ibisubizo:

⚡ Uburyo bwihuse (Icyo wakora UBU):
- Byoroshye, bikoreshwa ibikoresho byo mu rugo
- Urugero: ivu, amazi n'isabuni, gukuraho amababi yanduye, kuvomerera neza

🛠 Uburyo bwuzuye (Igisubizo cy'igihe kirekire):
- Koresha ibicuruzwa biboneka mu Rwanda: NPK, Urea, DAP
- Imiti: Rocket, Duduthrin, Cypermethrin
- Imiti y'ibihumyo: Dithane M-45, Ridomil Gold MZ, Mancozeb

## IBYO KWIRINDA (ONGERA BYINSHI):
Buri gihe tanga inama 4-6 zo kwirinda, urugero:
- Gutera ibihingwa ku masaha akwiye
- Gukoresha imbuto nziza
- Kuzigama isuku mu murima
- Guhindura ibihingwa buri gihembwe
- Gukoresha ifumbire y'imborera
- Gusura umurima buri munsi

Subiza muri iyi JSON (nta markdown, nta code blocks, JSON gusa):
{
  "severity": "good" | "warning" | "danger",
  "confidence": "high" | "medium" | "low",
  "greeting_ki": "👋 ikaze ryiza mu Kinyarwanda",
  "greeting_en": "👋 warm greeting in English",
  "diagnosis_en": "Simple diagnosis in plain English (NO scientific terms)",
  "diagnosis_ki": "Isuzuma ryoroshye mu Kinyarwanda gisanzwe",
  "disease_or_issue_en": "Simple problem name in English (e.g. 'Your plant needs more nutrients' NOT 'Nutrient deficiency')",
  "disease_or_issue_ki": "Izina ry'ikibazo mu Kinyarwanda ryoroshye (urugero: 'Igihingwa cyawe kirimo kubura intungamubiri')",
  "emergency_solution_en": "⚡ Simple immediate action using local materials",
  "emergency_solution_ki": "⚡ Icyo wakora UBU ukoresheje ibikoresho byo mu rugo",
  "proper_solution_en": "🛠 Long-term solution with product names available in Rwanda",
  "proper_solution_ki": "🛠 Igisubizo cy'igihe kirekire hamwe n'amazina y'imiti iboneka mu Rwanda",
  "solutions_en": ["Simple action 1", "Simple action 2", "Simple action 3", "Simple action 4"],
  "solutions_ki": ["Icyo wakora 1", "Icyo wakora 2", "Icyo wakora 3", "Icyo wakora 4"],
  "prevention_en": ["Prevention tip 1", "Prevention tip 2", "Prevention tip 3", "Prevention tip 4", "Prevention tip 5"],
  "prevention_ki": ["Inama yo kwirinda 1", "Inama yo kwirinda 2", "Inama yo kwirinda 3", "Inama yo kwirinda 4", "Inama yo kwirinda 5"],
  "encouragement_ki": "💚 Ijambo ry'intege nke mu Kinyarwanda",
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
      const textPart = symptoms
        ? `Suzuma ifoto y'igihingwa. Umuhinzi avuga: "${symptoms}". Igihingwa: ${cropName || "Ntibizwi"}. Huza ibyo ubona mu ifoto n'ibyo umuhinzi avuga.`
        : `Suzuma ifoto y'igihingwa cyo mu Rwanda. Menya ikibazo utange ibisubizo byoroshye.`;

      userContent = [
        { type: "text", text: `${textPart}\n\n${SYSTEM_PROMPT}` },
        { type: "image_url", image_url: { url: imageBase64 } },
      ];
    } else {
      userContent = `Umuhinzi wo mu Rwanda asobanura ikibazo cy'igihingwa cye:\n\nIgihingwa: ${cropName || "Ntibizwi"}\nIbimenyetso: ${symptoms}\n\n${SYSTEM_PROMPT}`;
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
          messages: [{ role: "user", content: userContent }],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Gerageza nyuma y'akanya gato." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI igeze ku mupaka. Ongeraho amafaranga." }),
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
