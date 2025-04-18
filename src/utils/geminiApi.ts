
const GEMINI_API_KEY = 'AIzaSyBvqj7LeX6Gek7eUHydxIZ8ks5VlWLcQtk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const generateGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
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
