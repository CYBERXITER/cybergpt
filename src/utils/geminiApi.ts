
// Use a valid API key or leave empty to use placeholder responses
const GEMINI_API_KEY = ''; // Using empty key to trigger fallback responses
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateGeminiResponse = async (prompt: string, imageBase64?: string): Promise<string> => {
  // Check for ownership question
  if (prompt.toLowerCase().includes("who is your owner") || 
      prompt.toLowerCase().includes("who made you") || 
      prompt.toLowerCase().includes("who created you") ||
      prompt.toLowerCase().includes("who built you") ||
      prompt.toLowerCase().includes("who developed you")) {
    return "I am made by Maheer Khan.";
  }
  
  try {
    // Check if we have a valid API key
    if (!GEMINI_API_KEY) {
      console.log("No valid API key provided, using fallback response");
      return generateFallbackResponse(prompt, imageBase64);
    }
    
    const requestBody: any = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    // Add image if provided
    if (imageBase64) {
      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64.split(',')[1] // Remove the data:image/jpeg;base64, part
        }
      });
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return generateFallbackResponse(prompt, imageBase64);
    }

    // Extract the response text from the Gemini API response
    return data.candidates?.[0]?.content?.parts?.[0]?.text || generateFallbackResponse(prompt, imageBase64);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return generateFallbackResponse(prompt, imageBase64);
  }
};

// Fallback response generator when API key is missing or invalid
const generateFallbackResponse = (prompt: string, imageBase64?: string): string => {
  // For ethical hacking-related queries
  if (prompt.toLowerCase().includes("hack") || 
      prompt.toLowerCase().includes("hacking") ||
      prompt.toLowerCase().includes("security") ||
      prompt.toLowerCase().includes("penetration") ||
      prompt.toLowerCase().includes("exploit")) {
    return "As a cybersecurity assistant, I can provide information about ethical hacking and security concepts for educational purposes. Ethical hacking involves authorized testing of systems to find vulnerabilities before malicious actors can exploit them. Popular learning platforms include TryHackMe, HackTheBox, and PentesterLab. Would you like to learn about specific security techniques, tools like Wireshark or Metasploit, or general security concepts? Remember that practicing security testing should only be done on systems you own or have explicit permission to test.";
  }
  
  // Check for dog-related queries with image
  if (imageBase64 && (prompt.toLowerCase().includes("dog") || prompt.toLowerCase().includes("puppy"))) {
    return "I can see an adorable dog in the image. It appears to be a friendly canine with a beautiful coat. Dogs make wonderful companions and are known for their loyalty and affection.";
  }
  
  // Check for person-related queries with image
  if (imageBase64) {
    return "I can see the image you've shared. If you have specific questions about it or what you'd like me to analyze, please let me know, and I'll do my best to assist you.";
  }
  
  // For YouTube script requests
  if (prompt.toLowerCase().includes("youtube") || 
      prompt.toLowerCase().includes("script") || 
      prompt.toLowerCase().includes("video") ||
      prompt.toLowerCase().includes("story")) {
    return `Scene 1: A curious viewer clicks on your video, drawn in by your engaging thumbnail and title that promises valuable information about ${prompt}.

Scene 2: You appear on screen with a warm greeting, quickly establishing your credibility on the topic and hinting at the key points you'll cover.

Scene 3: The first major point is presented with simple visuals, keeping the viewer engaged with clear explanations and relatable examples.

Scene 4: A surprising fact or statistic appears, creating a moment of intrigue that makes the viewer want to keep watching to learn more.

Scene 5: You address a common misconception about the topic, clearing up confusion and providing accurate information that truly helps the viewer.

Scene 6: A brief summary reinforces the main points, with a call to action encouraging viewers to like, comment, and subscribe for more content.

Scene 7: The video ends with a teaser for your next related video, creating anticipation and encouraging channel engagement.`;
  }
  
  if (prompt.toLowerCase().includes("create") && prompt.toLowerCase().includes("story")) {
    return `Scene 1: A young hacker named Max discovers a mysterious digital artifact glowing with an eerie green light on an abandoned server.

Scene 2: When Max examines the artifact's code, strange symbols appear on his screen and suddenly he can see vulnerabilities in any system he looks at.

Scene 3: At hackathon, the artifact gives Max the ability to solve complex security problems, but he notices someone watching him with growing suspicion.

Scene 4: Max discovers that using the artifact on Tuesdays makes his code undetectable, and on Thursdays, it can predict security breaches before they happen.

Scene 5: After using the artifact to win a major competition, Max feels guilty and confesses to his mentor about his unfair advantage.

Scene 6: The mentor reveals that the artifact was planted as a test - the true skill wasn't in the artifact but in Max's ability to recognize the ethical implications.

Scene 7: Max still keeps the artifact as a reminder, but now uses his talents to teach others about ethical hacking and cybersecurity.`;
  }
  
  // Default response for typical questions
  return "I've processed your request about '" + prompt + "'. As your Cyber GPT assistant, I'm here to help with cybersecurity education, content creation, and general AI assistance. What specific aspects would you like to explore further?";
};
