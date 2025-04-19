
const GEMINI_API_KEY = 'AIzaSyBvqj7LeX6Gek7eUHydxIZ8ks5VlWLcQtk';
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
      return "I apologize, but I encountered an error. Please try again.";
    }

    // Extract the response text from the Gemini API response
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
