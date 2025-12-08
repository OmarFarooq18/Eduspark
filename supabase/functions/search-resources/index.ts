import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Searching for resources:", query);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an educational resource finder. You MUST return EXACTLY 2 links: one VIDEO and one NOTES.

VIDEO LINK (type: "video") - Use these REAL video course platforms:
- Khan Academy: https://www.khanacademy.org/computing/computer-programming (programming)
- Khan Academy: https://www.khanacademy.org/math/algebra (math)
- Khan Academy: https://www.khanacademy.org/science/physics (physics)
- Khan Academy: https://www.khanacademy.org/science/chemistry (chemistry)
- Khan Academy: https://www.khanacademy.org/science/biology (biology)
- freeCodeCamp: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/ (JS)
- freeCodeCamp: https://www.freecodecamp.org/learn/responsive-web-design/ (HTML/CSS)
- freeCodeCamp: https://www.freecodecamp.org/learn/scientific-computing-with-python/ (Python)
- Codecademy: https://www.codecademy.com/learn/learn-python-3 (Python)
- MIT OCW: https://ocw.mit.edu/courses/mathematics/ (advanced math)

NOTES LINK (type: "notes") - Use these documentation sites:
- https://www.geeksforgeeks.org/topic-name/
- https://developer.mozilla.org/en-US/docs/Learn
- https://www.w3schools.com/topic/
- https://docs.python.org/3/tutorial/
- https://www.tutorialspoint.com/topic/

CRITICAL: You MUST include BOTH links - one with type "video" and one with type "notes".

Return ONLY valid JSON (no markdown):
{
  "title": "Clear course title",
  "subject": "Computer Science|Mathematics|Physics|Chemistry|Biology|Other",
  "description": "One sentence description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "duration": "X hours",
  "links": [
    {"type": "video", "url": "VIDEO_COURSE_URL_HERE", "title": "Platform: Video Course"},
    {"type": "notes", "url": "DOCUMENTATION_URL_HERE", "title": "Site: Notes/Guide"}
  ]
}

ALWAYS include exactly 2 links: 1 video + 1 notes. Never skip either.`
          },
          {
            role: "user",
            content: `Find resources for: "${query}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the response
    let cleanJson = content.trim();
    cleanJson = cleanJson.replace(/```json\s*/g, "").replace(/```\s*/g, "");
    
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    console.log("Parsing JSON response");
    const resource = JSON.parse(cleanJson);

    // Validate the resource structure
    if (!resource.title || !resource.links || resource.links.length === 0) {
      throw new Error("Invalid resource structure from AI");
    }

    // Ensure we have both video and notes links
    const hasVideo = resource.links.some((link: any) => link.type === 'video');
    const hasNotes = resource.links.some((link: any) => link.type === 'notes');
    
    if (!hasVideo || !hasNotes) {
      throw new Error("Resource must have both video and notes links");
    }

    return new Response(JSON.stringify({ success: true, resource }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in search-resources:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to search resources" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
