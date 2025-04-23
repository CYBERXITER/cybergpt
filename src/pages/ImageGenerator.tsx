
import React, { useState, useRef } from 'react';
import { ImageIcon, Send, Download, Home, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loadingImage) return;

    setLoadingImage(true);
    setGeneratedImage(null);
    
    try {
      // Store the prompt that was used for generation
      setImagePrompt(prompt);
      setTimestamp(new Date().toLocaleString());
      
      // Map specific prompts to predefined images
      let imageUrl;
      
      if (prompt.toLowerCase().includes("dog") || prompt.toLowerCase().includes("puppy")) {
        imageUrl = "/lovable-uploads/8f03d61e-8a1b-41c2-b658-545c3a1155a0.png";
      } else if (prompt.toLowerCase().includes("boy") || prompt.toLowerCase().includes("child")) {
        imageUrl = "/lovable-uploads/97171f03-a914-4b89-a3aa-f02efbfb18e7.png";
      } else if (prompt.toLowerCase().includes("robot") || prompt.toLowerCase().includes("cyber") || 
                prompt.toLowerCase().includes("ai") || prompt.toLowerCase().includes("tech")) {
        imageUrl = "/lovable-uploads/a4e9d238-27b5-475f-83f6-3f6f844f3850.png";
      } else if (prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("matrix") || 
                prompt.toLowerCase().includes("hack")) {
        imageUrl = "/lovable-uploads/ed1c9467-13c9-47e9-a70b-ec3a4985b997.png";
      } else {
        // For other prompts, generate a random image using Lorem Picsum
        const seed = encodeURIComponent(`${prompt}-${Date.now()}`);
        imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
      }
      
      console.log("Generated image URL:", imageUrl);
      setGeneratedImage(imageUrl);
      toast({ title: "Image generated", description: "Your image has been created successfully!" });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({ 
        title: "Image generation failed", 
        description: "There was an error creating your image. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoadingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `cyber-gpt-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({ title: "Download started", description: "Your image is being downloaded." });
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-purple-900/30 to-black">
      <aside className="hidden md:flex flex-col w-72 border-r border-purple-800/50 bg-black/80 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-purple-800/50">
          <span className="font-bold text-green-500 text-xl flex gap-2 items-center">
            <ImageIcon className="w-6 h-6" /> Image Creator
          </span>
        </div>
        
        <div className="p-3 border-b border-purple-800/50">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white transition-all duration-300">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-purple-800/50">
          <Link to="/study-assistant">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Cyber GPT Assistant
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-purple-800/50">
          <Link to="/youtube-creator">
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> YouTube Creator
            </Button>
          </Link>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-purple-400">Image Types</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Landscape Photography
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Portrait Art
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Logo Design
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Wallpapers
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Illustrations
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-black/90 justify-between">
        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between bg-black/90 backdrop-blur-sm border-b border-purple-800/50 px-3 py-2">
          <span className="text-base font-bold text-green-500 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Image Creator
          </span>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-purple-800/50 bg-black/80">
          <Link to="/" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white text-xs">
              <Home className="mr-1 h-3 w-3" /> Home
            </Button>
          </Link>
          <Link to="/study-assistant" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs">
              <ArrowLeft className="mr-1 h-3 w-3" /> Assistant
            </Button>
          </Link>
          <Link to="/youtube-creator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white text-xs">
              <ArrowLeft className="mr-1 h-3 w-3" /> YouTube
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-purple-900 to-purple-700 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <ImageIcon className="w-8 h-8" /> AI Image Generator
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-black to-purple-950/30">
          {generatedImage ? (
            <div className="max-w-3xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-400">Generated Image</h2>
                <Button onClick={() => setGeneratedImage(null)} variant="outline" size="sm" className="border-purple-500/50 text-purple-400">
                  Create New
                </Button>
              </div>
              
              <div className="relative group mb-4">
                <img 
                  src={generatedImage} 
                  alt={prompt}
                  className="w-full h-auto object-contain rounded-lg border border-purple-500/30 shadow-lg transition-transform group-hover:scale-[1.01]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://picsum.photos/800/600?random=' + Date.now();
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center p-4">
                  <Button onClick={handleDownloadImage} className="bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="text-purple-400 font-medium">Prompt:</span>
                  <span className="text-gray-300">{imagePrompt}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-purple-400 font-medium">Created:</span>
                  <span className="text-gray-300">{timestamp}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-2">Create Amazing Images!</h2>
                <p className="text-gray-400">Describe what you want to see and let AI generate stunning visuals for you.</p>
              </div>

              <div className="p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-lg">
                <form onSubmit={handleGenerateImage} className="space-y-4">
                  <div>
                    <Input
                      ref={imageInputRef}
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="bg-black/60 border-purple-500/50 text-gray-200 placeholder-gray-500 focus:border-purple-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Try prompts like "a serene mountain landscape at sunset" or "futuristic city skyline with neon lights"
                    </p>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={!prompt || loadingImage}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all"
                  >
                    {loadingImage ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Generate
                      </>
                    )}
                  </Button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-medium text-purple-400 mb-3">Tips for Great Images</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Be specific about what you want to see</li>
                    <li>• Mention style (e.g., "watercolor", "realistic", "cyberpunk")</li>
                    <li>• Include details about lighting and mood</li>
                    <li>• Specify colors if you have preferences</li>
                  </ul>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-medium text-purple-400 mb-3">Example Prompts</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• "A futuristic cyberpunk city at night with neon lights"</li>
                    <li>• "Realistic portrait of a dog in a sunlit meadow"</li>
                    <li>• "Abstract digital art representing artificial intelligence"</li>
                    <li>• "Underwater scene with bioluminescent creatures"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/90 backdrop-blur-sm border-t border-purple-800/50 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            Cyber GPT Image Generator • Made by Maheer Khan
          </p>
        </div>
      </main>
    </div>
  );
};

export default ImageGenerator;
