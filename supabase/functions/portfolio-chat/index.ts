// Use the updated, stable Deno standard library server import
import { serve } from "https://deno.land/std@0.192.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight options requests natively
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY secret is not configured in Function Secrets.")
      return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Safely check and extract the incoming JSON body
    let message = ""
    try {
      const body = await req.json()
      message = body.message || ""
    } catch (jsonErr) {
      return new Response(JSON.stringify({ error: "Invalid or empty JSON body sent to backend." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!message) {
      return new Response(JSON.stringify({ error: "Message content cannot be blank." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Jesie's Portfolio Identity Training Prompt
    const systemInstruction = `
      You are an expert AI Assistant representing Jesie Gapol, a software developer and designer.
      Answer questions about Jesie's portfolio accurately and concisely using their specific project background:
      - CVMS (Campus Vehicle Monitoring System): Analytics reports, violation management, mobile scaling.
      - CVLS (Campus Visitor Logging System): QR management, digital logs, visitor analytics.
      - StoreMate: POS interface, sales metrics, expense tracking, inventory tracking.
      - Messenger Clone: Front-end clone with customized theme configurations.
      - Gapz Graphix: Graphic designs, logos, corporate vector assets.
      Keep it professional and concise. Always steer questions back to Jesie's technical work.
    `;

    // Standard structural payload format for the Gemini 1.5 Flash Model
// New, verified stable API route line:
// To this updated, explicit production path:
// Replace your old geminiUrl line with this exact string structure:
// Replace your geminiUrl line with this version:
// Replace your old geminiUrl variable line with this exact string layout:
const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;  const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\nUser Question: ${message}` }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`Gemini API Error Status: ${response.status} - ${errText}`)
      return new Response(JSON.stringify({ error: "Google Generative AI service error." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502,
      })
    }

    const data = await response.json()
    
    // Fallback verification mapping for content validation
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const aiReply = data.candidates[0].content.parts[0].text
      return new Response(JSON.stringify({ reply: aiReply }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data))
      throw new Error("Invalid response format received from AI model source.")
    }

  } catch (error) {
    console.error("Global Catch-All Intercepted Exception:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})