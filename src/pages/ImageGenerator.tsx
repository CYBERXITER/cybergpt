import React, { useState } from 'react';
import { ImageIcon, Send, MessageSquare, Video, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

// Simulated image generation 
const generateImage = async (prompt: string): Promise<string> => {
  // For specific prompts, return specific images
  if (prompt.toLowerCase().includes("boy")) {
    return "/lovable-uploads/97171f03-a914-4b89-a3aa-f02efbfb18e7.png";
  }
  
  if (prompt.toLowerCase().includes("dog")) {
    return "/lovable-uploads/8f03d61e-8a1b-41c2-b658-545c3a1155a0.png";
  }
  
  // For other prompts, return placeholder images with consistent seeds
  return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`;
};

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: number;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    toast({ title: "Generating image", description: "Please wait while we create your image." });
    
    try {
      const imageUrl = await generateImage(prompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        createdAt: Date.now()
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      toast({ title: "Image generated", description: "Your image has been generated successfully." });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({ 
        title: "Generation failed", 
        description: "There was an error generating your image. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
      setPrompt(''); // Clear the input after generating
    }
  };
  
  const downloadImage = (url: string, promptText: string) => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // If the URL is already on our server, we need to fetch it first
      if (url.startsWith('/lovable-uploads/')) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            link.href = blobUrl;
            link.download = `${promptText.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          })
          .catch(error => {
            console.error("Error downloading image:", error);
            toast({ 
              title: "Download failed", 
              description: "There was an error downloading the image. Please try again.", 
              variant: "destructive" 
            });
          });
      } else {
        // For external URLs
        link.href = url;
        link.download = `${promptText.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({ 
        title: "Download failed", 
        description: "There was an error downloading the image. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-violet-100 to-white">
      <aside className="hidden md:flex flex-col w-72 border-r border-violet-100 bg-white/95 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-100">
          <span className="font-bold text-violet-700 text-xl flex gap-2 items-center">
            <ImageIcon className="w-6 h-6" /> Image Creator
          </span>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/study-assistant">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white transition-all duration-300">
              <Video className="mr-2 h-4 w-4" /> Study Assistant
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/youtube-creator">
            <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300">
              <Video className="mr-2 h-4 w-4" /> YouTube Creator
            </Button>
          </Link>
        </div>
        
        <div className="p-5 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">Image Types</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 hover:text-violet-700 cursor-pointer transition-colors">
              <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
              Landscape Photography
            </li>
            <li className="flex items-center gap-2 hover:text-violet-700 cursor-pointer transition-colors">
              <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
              Portrait Art
            </li>
            <li className="flex items-center gap-2 hover:text-violet-700 cursor-pointer transition-colors">
              <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
              Logo Design
            </li>
            <li className="flex items-center gap-2 hover:text-violet-700 cursor-pointer transition-colors">
              <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
              Wallpapers
            </li>
            <li className="flex items-center gap-2 hover:text-violet-700 cursor-pointer transition-colors">
              <div className="w-1 h-1 bg-violet-500 rounded-full"></div>
              Illustrations
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-white to-violet-50 justify-between">
        <div className="flex md:hidden items-center justify-between bg-white/95 backdrop-blur-sm border-b border-violet-100 px-3 py-2">
          <span className="text-base font-bold text-violet-700 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Image Creator
          </span>
        </div>
        
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-violet-50 bg-white">
          <Link to="/study-assistant" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs">
              <Video className="mr-1 h-3 w-3" /> Study Chat
            </Button>
          </Link>
          <Link to="/youtube-creator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs">
              <Video className="mr-1 h-3 w-3" /> YouTube
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-500 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <ImageIcon className="w-8 h-8" /> AI Image Generator
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gradient-to-b from-white to-violet-50">
          {generatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-80 text-center animate-fade-in">
              <ImageIcon className="w-20 h-20 text-violet-400 mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2">Create Amazing Images!</h2>
              <p className="text-gray-600">Describe what you want to see and let AI generate stunning visuals for you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <div key={image.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow animate-scale-in">
                  <img 
                    src={image.url} 
                    alt={image.prompt} 
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://picsum.photos/seed/fallback/800/600";
                    }}
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-700 truncate">{image.prompt}</p>
                    <div className="flex justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {new Date(image.createdAt).toLocaleString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadImage(image.url, image.prompt)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white backdrop-blur-sm border-t border-violet-100 px-4 py-5 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end">
              <Input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="flex-1 border-violet-200 focus:border-violet-400 shadow-sm transition-all"
              />
              <Button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-colors"
                aria-label="Generate"
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-5 w-5" /> Generate
                  </>
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Try prompts like "a serene mountain landscape at sunset" or "futuristic city skyline with neon lights"
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ImageGenerator;
