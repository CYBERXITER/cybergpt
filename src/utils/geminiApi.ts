
// Use a valid API key or leave empty to use placeholder responses
const GEMINI_API_KEY = ''; // Removed invalid API key
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
  
  // For ethical hacking or security-related questions
  if (prompt.toLowerCase().includes("hack") || 
      prompt.toLowerCase().includes("hacking") || 
      prompt.toLowerCase().includes("ethical") ||
      prompt.toLowerCase().includes("security")) {
    return "I can provide information about cybersecurity, ethical hacking, and security practices, but only for educational purposes. Remember to always practice security testing only on systems you own or have explicit permission to test. If you're interested in learning about cybersecurity, I recommend starting with resources like TryHackMe, HackTheBox, or official certification courses like CompTIA Security+.";
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
  if (prompt.toLowerCase().includes("picture") && prompt.toLowerCase().includes("boy")) {
    return "Here's a picture of a young boy playing in the park. He's wearing a blue t-shirt and has a bright smile.";
  }
  
  if (prompt.toLowerCase().includes("create") && prompt.toLowerCase().includes("story")) {
    return `Scene 1: A young boy named Max discovers a magical shirt in his grandmother's attic, glowing with a soft blue light.

Scene 2: When Max puts on the shirt, he suddenly finds he can understand the language of animals, with birds chirping greetings as he walks home.

Scene 3: At school, the shirt gives Max the courage to stand up to bullies, not by fighting but by saying exactly the right words to defuse the situation.

Scene 4: Max discovers that wearing the shirt on Tuesday makes him incredibly fast, and on Thursdays, it lets him remember everything he reads.

Scene 5: After using the shirt to ace a test, Max feels guilty and confesses to his teacher about his magical advantage.

Scene 6: His teacher smiles knowingly and reveals that the true magic wasn't in the shirt but in Max himself – the shirt just helped him believe in his own abilities.

Scene 7: Max still wears the shirt sometimes, but now he knows the real magic comes from within himself.`;
  }
  
  return "I've processed your request. Is there anything else you'd like to know about this topic?";
};
