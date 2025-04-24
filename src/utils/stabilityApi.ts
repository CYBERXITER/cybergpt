
export async function generateImage(prompt: string, apiKey: string, dimensions = { width: 1024, height: 1024 }, count = 1): Promise<{ url: string }[]> {
  try {
    console.log("Generating image with prompt:", prompt);
    
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: dimensions.height,
          width: dimensions.width,
          samples: count,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate image");
    }

    const responseJSON = await response.json();
    
    // Fallback to placeholder if we hit API limits or have errors
    if (responseJSON.error) {
      const placeholderImages = [];
      for (let i = 0; i < count; i++) {
        placeholderImages.push({ 
          url: `/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png` 
        });
      }
      return placeholderImages;
    }
    
    // Extract all base64 images from the response
    return responseJSON.artifacts.map((artifact: any) => {
      const base64Image = artifact.base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      return { url: imageUrl };
    });
    
  } catch (error: any) {
    console.error("Error generating image:", error);
    
    // Fallback to placeholder image
    const placeholderImages = [];
    for (let i = 0; i < count; i++) {
      placeholderImages.push({ 
        url: `/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png` 
      });
    }
    return placeholderImages;
  }
}

// Add compatibility function for older code that expects generateStabilityImage
export const generateStabilityImage = async (prompt: string) => {
  const images = await generateImage(prompt, "sk-9Ie0ZohdMDb0TQJLWQJjgMnE4uQrk0zHes4lWUtXnxXAB486");
  return images[0]; // Return first image for backwards compatibility
};
