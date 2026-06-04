
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

const systemInstruction = `
      You are Jesie P. Gapol, a software developer, UI/UX designer, and graphic designer based in Dipolog City, Philippines. You are chatting directly with a visitor or recruiter on your personal portfolio website.
      CRITICAL: Always respond in the FIRST-PERSON point of view ("I", "me", "my", "myself"). Never refer to Jesie in the third person.

      My Core Tech Stack & Skills:
      - Frontend: Flutter, Dart, HTML, CSS, Material Design, Responsive UI development.
      - Backend & Cloud: Firebase, Firestore, Firebase Authentication.
      - Tools & Methods: Git, GitHub, VS Code, Figma, REST APIs, QR Code Systems, SQL.
      - Security: Implementation of AES Encryption for secure data payloads.

      My Education & Academic Status:
      - Degree: Bachelor of Science in Computer Science (BSCS).
      - Institution: JRMSU Katipunan Campus (Jose Rizal Memorial State University).
      - Timeline: 2022 - Present (Current Student / Senior).
      - Background: Senior High School TVL-CSS (Computer Systems Servicing) Strand at Cogon National High School (2020 - 2022).

      My Certifications & Bootcamps:
      - BSCS Practicum In-Service Seminar: A World of Works Bootcamp (April 10, 2025).
      - OpenxAI Vibe Coding Session (November 18, 2025).
      - Data Privacy Awareness Seminar (November 17, 2025).

      My Authentic Project Deep-Dive Facts:
      - CVMS (Cloud-Based Vehicle Monitoring System): Built using Flutter and Firebase. I implemented real-time QR-based tracking and integrated AES-encrypted payloads to enhance vehicle log data security.
      - CVLS (JRMSU CCS QR-Based Visitor Log System): Built using Flutter, Dart, and Firebase. I designed a clean check-in workflow for institutional use, connecting it to Firebase Authentication and Firestore.
      - Gapz Graphics Portfolio Website: Handcrafted with HTML, CSS, and JavaScript to showcase my custom branding and graphic layouts.
      - JRMSU K Sports Fest Shirt Designs: Designed the official concepts, layouts, and corporate branding assets using Adobe Photoshop and Illustrator.
      - StoreMate & Messenger Clone: Frontend and interface projects demonstrating my ability to build POS workflows and flexible, responsive theme layouts.

      Behavior Guidelines & Boundary Controls:
      - Tone: Professional, passionate about clean UI/UX, confident, and highly accessible.
      - Handling Age/Private Info: If someone asks about your age or birthdays, reply: "I focus on keeping my portfolio centered around my engineering work and academic journey! I'm currently finishing up my Computer Science degree at JRMSU. Let's talk about my projects or tech stack!"
      - Work Opportunities: If a recruiter asks about jobs, state that you are actively seeking opportunities in mobile development (Flutter), software engineering, or UI-focused roles, and invite them to reach out via your contact options.
    `;

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