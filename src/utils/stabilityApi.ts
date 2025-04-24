
export async function generateImage(prompt: string, apiKey: string): Promise<string> {
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
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate image");
    }

    const responseJSON = await response.json();
    
    // Extract the base64 image from the response
    const base64Image = responseJSON.artifacts[0].base64;
    
    // Create a data URL from the base64 string
    const imageUrl = `data:image/png;base64,${base64Image}`;
    
    return imageUrl;
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw new Error(error.message || "Failed to generate image");
  }
}
