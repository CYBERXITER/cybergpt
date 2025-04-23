
// Stability AI API key for image generation
const STABILITY_API_KEY = 'sk-ZTW2adrnaeeQMSy1uKdPc8YLJ5aA0UFfUxZ0vRQeinG9Kotg';
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image';

export interface GeneratedImage {
  url: string;
  base64?: string;
}

export const generateStabilityImage = async (prompt: string): Promise<GeneratedImage> => {
  try {
    if (!STABILITY_API_KEY) {
      console.log("No Stability API key provided, using fallback image");
      return generateFallbackImage(prompt);
    }

    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 512,
        width: 512,
        samples: 1,
        steps: 30
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability API error:', errorData);
      return generateFallbackImage(prompt);
    }

    const data = await response.json();
    
    // Handle the response format from Stability AI
    if (data.artifacts && data.artifacts.length > 0) {
      const base64Image = data.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      
      return {
        url: imageUrl,
        base64: base64Image
      };
    }
    
    return generateFallbackImage(prompt);
  } catch (error) {
    console.error('Error calling Stability API:', error);
    return generateFallbackImage(prompt);
  }
};

// Fallback image generator when API key is missing or invalid
const generateFallbackImage = (prompt: string): GeneratedImage => {
  const promptLower = prompt.toLowerCase();
  let imageUrl = '';
  
  // Map specific prompts to predefined images
  if (promptLower.includes("dog") || promptLower.includes("puppy")) {
    imageUrl = "/lovable-uploads/8f03d61e-8a1b-41c2-b658-545c3a1155a0.png";
  } else if (promptLower.includes("boy") || promptLower.includes("child")) {
    imageUrl = "/lovable-uploads/97171f03-a914-4b89-a3aa-f02efbfb18e7.png";
  } else if (promptLower.includes("robot") || promptLower.includes("cyber") || 
            promptLower.includes("ai") || promptLower.includes("tech")) {
    imageUrl = "/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png";
  } else if (promptLower.includes("code") || promptLower.includes("matrix") || 
            promptLower.includes("hack")) {
    imageUrl = "/lovable-uploads/b838814f-d0e0-4078-89ef-53886047d9b8.png";
  } else {
    // For other prompts, generate a random image using Lorem Picsum
    const seed = encodeURIComponent(`${prompt}-${Date.now()}`);
    imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
  }
  
  return {
    url: imageUrl
  };
};
