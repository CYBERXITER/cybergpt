
import React, { useState, useRef, useCallback } from 'react';
import { ImageIcon, Send, Download, Home, ArrowLeft, UploadCloud } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { generateStabilityImage } from '../utils/stabilityApi';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || loadingImage) return;

    setLoadingImage(true);
    setGeneratedImage(null);
    
    try {
      // Store the prompt that was used for generation
      setImagePrompt(prompt);
      setTimestamp(new Date().toLocaleString());
      
      // Generate image using Stability AI
      const result = await generateStabilityImage(prompt);
      console.log("Generated image URL:", result.url);
      setGeneratedImage(result.url);
      
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setUploadedImage(event.target.result);
        toast({ title: "Image uploaded", description: "Your image has been uploaded successfully!" });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-green-900/30 to-black">
      <aside className="hidden md:flex flex-col w-72 border-r border-green-800/50 bg-black/80 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-green-800/50">
          <span className="font-bold text-green-500 text-xl flex gap-2 items-center">
            <ImageIcon className="w-6 h-6" /> Image Creator
          </span>
        </div>
        
        <div className="p-3 border-b border-green-800/50">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white transition-all duration-300">
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-green-800/50">
          <Link to="/study-assistant">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> Cyber GPT Assistant
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-green-800/50">
          <Link to="/youtube-creator">
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> YouTube Creator
            </Button>
          </Link>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-3 text-green-400">Image Types</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Landscape Photography
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Portrait Art
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Logo Design
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Wallpapers
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Illustrations
            </li>
          </ul>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-black/90 justify-between">
        {/* Mobile header */}
        <div className="flex md:hidden items-center justify-between bg-black/90 backdrop-blur-sm border-b border-green-800/50 px-3 py-2">
          <span className="text-base font-bold text-green-500 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" /> Image Creator
          </span>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-green-800/50 bg-black/80">
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

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-green-900 to-green-700 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <ImageIcon className="w-8 h-8" /> AI Image Generator
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-black to-green-950/30">
          {generatedImage ? (
            <div className="max-w-3xl mx-auto p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-green-500/30 shadow-lg animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-400">Generated Image</h2>
                <Button onClick={() => setGeneratedImage(null)} variant="outline" size="sm" className="border-green-500/50 text-green-400">
                  Create New
                </Button>
              </div>
              
              <div className="relative group mb-4">
                <img 
                  src={generatedImage} 
                  alt={prompt}
                  className="w-full h-auto object-contain rounded-lg border border-green-500/30 shadow-lg transition-transform group-hover:scale-[1.01]"
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
                  <span className="text-green-400 font-medium">Prompt:</span>
                  <span className="text-gray-300">{imagePrompt}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-green-400 font-medium">Created:</span>
                  <span className="text-gray-300">{timestamp}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-2">Create Amazing Images!</h2>
                <p className="text-gray-400">Describe what you want to see and let AI generate stunning visuals for you.</p>
              </div>

              <div className="p-6 bg-black/50 backdrop-blur-sm rounded-xl border border-green-500/30 shadow-lg">
                <form onSubmit={handleGenerateImage} className="space-y-4">
                  <div>
                    <Input
                      ref={imageInputRef}
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="bg-black/60 border-green-500/50 text-gray-200 placeholder-gray-500 focus:border-green-400"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Try prompts like "a cyborg warrior with glowing green eyes" or "futuristic cyberpunk city at night"
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button"
                      onClick={triggerFileInput}
                      variant="outline" 
                      className="border-green-500/50 text-green-400"
                    >
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload Image
                    </Button>

                    <Button 
                      type="submit"
                      disabled={!prompt || loadingImage}
                      className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all"
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
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </form>

                {uploadedImage && (
                  <div className="mt-4 p-4 border border-green-500/30 rounded-lg">
                    <h3 className="text-green-400 font-medium mb-2">Uploaded Image</h3>
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-auto max-h-60 object-contain rounded border border-green-500/20" 
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h3 className="text-lg font-medium text-green-400 mb-3">Tips for Great Images</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Be specific about what you want to see</li>
                    <li>• Mention style (e.g., "cyberpunk", "realistic", "digital art")</li>
                    <li>• Include details about lighting and mood</li>
                    <li>• Specify colors if you have preferences</li>
                  </ul>
                </div>
                
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h3 className="text-lg font-medium text-green-400 mb-3">Example Prompts</h3>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• "A futuristic cyberpunk city at night with neon green lights"</li>
                    <li>• "A cyber warrior with glowing green eyes and digital armor"</li>
                    <li>• "Abstract digital art representing hacking and cybersecurity"</li>
                    <li>• "A green robotic mask with circuit patterns in a dark environment"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-black/90 backdrop-blur-sm border-t border-green-800/50 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            Cyber GPT Image Generator • Made by Maheer Khan
          </p>
        </div>
      </main>
    </div>
  );
};

export default ImageGenerator;
