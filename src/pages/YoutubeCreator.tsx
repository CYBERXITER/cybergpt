
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Video, Image as ImageIcon, Send, PlayCircle, Download, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { generateGeminiResponse } from '../utils/geminiApi';
import { generateStabilityImage } from '../utils/stabilityApi';

interface StoryStep {
  id: string;
  text: string;
  imageUrl?: string;
  duration?: number;
}

const YoutubeCreator = () => {
  const [topic, setTopic] = useState('');
  const [storySteps, setStorySteps] = useState<StoryStep[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'prompt' | 'story' | 'images' | 'video'>('prompt');
  const [videoDuration, setVideoDuration] = useState(30);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fallback images in case API fails
  const predefinedImages = {
    boy: "/lovable-uploads/97171f03-a914-4b89-a3aa-f02efbfb18e7.png",
    dog: "/lovable-uploads/8f03d61e-8a1b-41c2-b658-545c3a1155a0.png",
    cyber: "/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png",
    matrix: "/lovable-uploads/b838814f-d0e0-4078-89ef-53886047d9b8.png",
    default: "https://picsum.photos/seed/random/800/600"
  };
  
  const generateStory = async () => {
    if (!topic.trim() || isGeneratingStory) return;
    
    setIsGeneratingStory(true);
    setCurrentStep('story');
    toast({ title: "Generating story", description: "Please wait while we create your YouTube script." });
    
    try {
      const prompt = `Create a short, engaging script for a YouTube Short (less than 60 seconds) about: ${topic}. 
      Format it as 7 brief scenes (1-2 sentences each), with each scene clearly marked with "Scene 1:", "Scene 2:", etc.`;
      
      const response = await generateGeminiResponse(prompt);
      console.log("Gemini response for story:", response);
      
      const extractScenes = (text: string): string[] => {
        const sceneRegex = /Scene\s*\d+\s*:\s*(.*?)(?=Scene\s*\d+\s*:|$)/gis;
        const matches = [...text.matchAll(sceneRegex)];
        
        if (matches && matches.length > 0) {
          return matches.map(match => match[1].trim()).filter(Boolean);
        }
        
        const lines = text.split('\n');
        let scenes: string[] = [];
        let currentScene = '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.match(/^Scene\s*\d+\s*:/i)) {
            if (currentScene) scenes.push(currentScene.trim());
            currentScene = trimmedLine.replace(/^Scene\s*\d+\s*:\s*/i, '').trim();
          } else if (currentScene && trimmedLine) {
            currentScene += ' ' + trimmedLine;
          }
        }
        
        if (currentScene) scenes.push(currentScene.trim());
        
        if (scenes.length < 2 || scenes.length > 10) {
          console.log("Scene extraction issue, using fallback scenes");
          scenes = [
            "Our story begins with an introduction to the topic of " + topic + ".",
            "We explore the key aspects and features of " + topic + ".",
            "Interesting examples about " + topic + " are presented to the audience.",
            "We discuss impacts and implications of " + topic + ".",
            "Some surprising facts about " + topic + " are revealed.",
            "We address common misconceptions about " + topic + ".",
            "The conclusion summarizes the main points about " + topic + " and offers a final thought."
          ];
        }
        
        return scenes;
      };
      
      let scenes = extractScenes(response);
      
      const totalDuration = videoDuration;
      const avgSceneDuration = Math.floor(totalDuration / scenes.length);
      
      const storyStepsArray: StoryStep[] = scenes.map((text, index) => {
        const duration = index === scenes.length - 1 
          ? totalDuration - (avgSceneDuration * (scenes.length - 1)) 
          : avgSceneDuration;
          
        return {
          id: `scene-${index + 1}`,
          text: text,
          duration: duration
        };
      });
      
      setStorySteps(storyStepsArray);
      toast({ title: "Story generated", description: "Your YouTube script has been created!" });
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast({ 
        title: "Story generation failed", 
        description: "There was an error creating your story. Please try again.", 
        variant: "destructive" 
      });
      
      const fallbackSteps: StoryStep[] = Array(7).fill(0).map((_, index) => {
        const duration = index === 6 
          ? videoDuration - (Math.floor(videoDuration / 7) * 6) 
          : Math.floor(videoDuration / 7);
          
        return {
          id: `scene-${index + 1}`,
          text: [
            'Our story begins with an introduction to ' + topic + '.',
            'We explore the key aspects and features of ' + topic + '.',
            'Interesting examples of ' + topic + ' are presented to the audience.',
            'We discuss impacts and implications of ' + topic + '.',
            'Some surprising facts about ' + topic + ' are revealed.',
            'We address common misconceptions about ' + topic + '.',
            'The conclusion summarizes the main points and offers a final thought.'
          ][index],
          duration: duration
        };
      });
      
      setStorySteps(fallbackSteps);
    } finally {
      setIsGeneratingStory(false);
    }
  };
  
  const generateImages = async () => {
    if (storySteps.length === 0 || isGeneratingImages) return;
    
    setIsGeneratingImages(true);
    setCurrentStep('images');
    toast({ title: "Generating images", description: "Creating visuals for each scene in your story." });
    
    try {
      const updatedSteps = await Promise.all(storySteps.map(async (step, index) => {
        try {
          // Generate a custom prompt for each scene to get better images
          const imagePrompt = `Digital art for a YouTube video about: ${step.text} in cyberpunk style with glowing green elements`;
          
          // Generate image using Stability AI
          const result = await generateStabilityImage(imagePrompt);
          
          // Wait a bit between API calls to avoid rate limits
          await new Promise(r => setTimeout(r, 300));
          
          return {
            ...step,
            imageUrl: result.url
          };
        } catch (error) {
          console.error(`Failed to generate image for scene ${index + 1}:`, error);
          
          // Fallback image logic
          const stepText = step.text.toLowerCase();
          const topicLower = topic.toLowerCase();
          
          let imageUrl = '';
          
          if ((stepText.includes('boy') || topicLower.includes('boy') || 
              stepText.includes('child') || topicLower.includes('child'))) {
            imageUrl = predefinedImages.boy;
          } else if ((stepText.includes('dog') || topicLower.includes('dog') || 
                    stepText.includes('puppy') || topicLower.includes('puppy'))) {
            imageUrl = predefinedImages.dog;
          } else if ((stepText.includes('cyber') || topicLower.includes('cyber') ||
                    stepText.includes('hack') || topicLower.includes('tech'))) {
            imageUrl = predefinedImages.cyber;
          } else if ((stepText.includes('code') || topicLower.includes('code') ||
                    stepText.includes('matrix') || topicLower.includes('matrix'))) {
            imageUrl = predefinedImages.matrix;
          } else {
            const seed = encodeURIComponent(`${topic}-${step.id}-${index}-${Date.now()}`);
            imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
          }
          
          return {
            ...step,
            imageUrl
          };
        }
      }));
      
      setStorySteps(updatedSteps);
      toast({ title: "Images generated", description: "Visuals for your story have been created!" });
    } catch (error) {
      console.error("Failed to generate images:", error);
      toast({ 
        title: "Image generation failed", 
        description: "There was an error creating your images. Please try again.", 
        variant: "destructive" 
      });
      
      const fallbackSteps = storySteps.map(step => ({
        ...step,
        imageUrl: step.imageUrl || predefinedImages.default
      }));
      
      setStorySteps(fallbackSteps);
    } finally {
      setIsGeneratingImages(false);
    }
  };
  
  const createVideo = async () => {
    if (storySteps.some(step => !step.imageUrl) || isGeneratingVideo) return;
    
    setIsGeneratingVideo(true);
    setCurrentStep('video');
    toast({ title: "Creating video", description: "Generating your YouTube Short. This may take a minute." });
    
    try {
      await new Promise(r => setTimeout(r, 3000));
      
      // For now we're using a sample video
      const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
      setVideoUrl(sampleVideoUrl);
      
      toast({ title: "Video created", description: `Your ${videoDuration}-second YouTube Short is ready to view and download!` });
    } catch (error) {
      console.error("Failed to create video:", error);
      toast({ 
        title: "Video creation failed", 
        description: "There was an error creating your video. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  };
  
  const resetProject = () => {
    setTopic('');
    setStorySteps([]);
    setVideoUrl(null);
    setCurrentStep('prompt');
  };

  const handleViewFullScreen = () => {
    if (!videoUrl) return;
    
    try {
      if (videoRef.current) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        } else if ((videoRef.current as any).msRequestFullscreen) {
          (videoRef.current as any).msRequestFullscreen();
        }
      }
    } catch (error) {
      console.error("Error with fullscreen:", error);
      window.open(videoUrl, '_blank');
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    
    try {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `youtube-short-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({ title: "Download started", description: "Your video is being downloaded." });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({ 
        title: "Download failed", 
        description: "There was an error downloading your video. Please try again.", 
        variant: "destructive" 
      });
      
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-green-900/30 to-black">
      <aside className="hidden md:flex flex-col w-72 border-r border-green-800/50 bg-black/80 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-green-800/50">
          <span className="font-bold text-green-500 text-xl flex gap-2 items-center">
            <Video className="w-6 h-6" /> YouTube Creator
          </span>
        </div>
        
        <div className="p-3 border-b border-green-800/50">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white transition-all duration-300">
              <MessageSquare className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-green-800/50">
          <Link to="/image-generator">
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white transition-all duration-300">
              <ImageIcon className="mr-2 h-4 w-4" /> Image Generator
            </Button>
          </Link>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold mb-4 text-green-400">Creation Progress</h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-2 ${currentStep === 'prompt' ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'prompt' ? 'bg-green-500 text-black' : 'bg-gray-700'
              }`}>1</div>
              Enter Topic Prompt
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'story' ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'story' ? 'bg-green-500 text-black' : 'bg-gray-700'
              }`}>2</div>
              Generate Story Script
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'images' ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'images' ? 'bg-green-500 text-black' : 'bg-gray-700'
              }`}>3</div>
              Create Scene Images
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'video' ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'video' ? 'bg-green-500 text-black' : 'bg-gray-700'
              }`}>4</div>
              Produce Final Video
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-semibold mb-2 text-green-400">Video Length</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-xs text-green-300">
                <span>10 sec</span>
                <span>30 sec</span>
                <span>60 sec</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="60" 
                step="1" 
                value={videoDuration}
                onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                className="w-full accent-green-500"
                disabled={currentStep !== 'prompt'}
              />
              <div className="text-center text-green-400 font-semibold">
                {videoDuration} seconds
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-black/90 justify-between">
        <div className="flex md:hidden items-center justify-between bg-black/90 backdrop-blur-sm border-b border-green-800/50 px-3 py-2">
          <span className="text-base font-bold text-green-500 flex items-center gap-2">
            <Video className="w-5 h-5" /> YouTube Creator
          </span>
        </div>
        
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-green-800/50 bg-black/80">
          <Link to="/" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white text-xs">
              <MessageSquare className="mr-1 h-3 w-3" /> Home
            </Button>
          </Link>
          <Link to="/image-generator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white text-xs">
              <ImageIcon className="mr-1 h-3 w-3" /> Images
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-green-900 to-green-700 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <Video className="w-8 h-8" /> YouTube Shorts Creator
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-black to-green-950/30">
          {currentStep === 'prompt' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">Create Engaging YouTube Shorts</h2>
                <p className="text-gray-300">Generate complete YouTube Shorts with scripts, images, and video in minutes!</p>
              </div>
              
              <div className="bg-black/50 border border-green-800/50 p-6 rounded-xl shadow-md">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What would you like your YouTube Short to be about?
                </label>
                <Textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="E.g., '5 amazing science facts that will blow your mind' or 'How to learn a new language fast'"
                  className="min-h-[100px] bg-black/60 border-green-800/50 text-gray-100"
                />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-green-400">
                    <span className="font-semibold">Length:</span> {videoDuration} seconds
                  </div>
                  <Button
                    onClick={generateStory}
                    disabled={!topic.trim() || isGeneratingStory}
                    className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-colors"
                  >
                    {isGeneratingStory ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-5 w-5" /> Create Story
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'story' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-600">Your YouTube Script</h2>
                <Button variant="outline" onClick={resetProject} size="sm" className="border-green-500/50 text-green-400">
                  Start Over
                </Button>
              </div>
              
              <div className="space-y-4">
                {storySteps.map((step, index) => (
                  <div key={step.id} className="bg-black/50 border border-green-800/40 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-green-400">Scene {index + 1}</h3>
                    </div>
                    <p className="text-gray-300">{step.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={generateImages}
                  disabled={storySteps.length === 0 || isGeneratingImages}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-colors"
                >
                  {isGeneratingImages ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-5 w-5" /> Generate Images
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'images' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-600">Your Scene Images</h2>
                <Button variant="outline" onClick={resetProject} size="sm" className="border-green-500/50 text-green-400">
                  Start Over
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {storySteps.map((step, index) => (
                  <div key={step.id} className="bg-black/50 border border-green-800/30 rounded-lg overflow-hidden shadow-md">
                    {step.imageUrl ? (
                      <div className="w-full aspect-video relative">
                        <img 
                          src={step.imageUrl} 
                          alt={`Scene ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = predefinedImages.default;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-black/60 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-green-400">Scene {index + 1}</h3>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={createVideo}
                  disabled={storySteps.some(step => !step.imageUrl) || isGeneratingVideo}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-colors"
                >
                  {isGeneratingVideo ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-white rounded-full"></div>
                      <span>Generating Video...</span>
                    </div>
                  ) : (
                    <>
                      <Video className="mr-2 h-5 w-5" /> Create YouTube Short
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 'video' && videoUrl && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-600">Your YouTube Short</h2>
                <Button variant="outline" onClick={resetProject} size="sm" className="border-green-500/50 text-green-400">
                  Create New Video
                </Button>
              </div>
              
              <div className="bg-black/50 border border-green-800/30 p-6 rounded-xl shadow-md">
                <div className="aspect-[9/16] mx-auto max-w-sm bg-black rounded-lg overflow-hidden shadow-lg mb-6">
                  <video 
                    ref={videoRef}
                    src={videoUrl} 
                    controls
                    className="w-full h-full object-contain"
                    poster={storySteps[0]?.imageUrl}
                    preload="auto"
                  />
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleViewFullScreen} className="border-green-500/50 text-green-400">
                    <PlayCircle className="mr-2 h-5 w-5" /> View Full Screen
                  </Button>
                  <Button onClick={downloadVideo} className="bg-gradient-to-r from-green-600 to-green-800">
                    <Download className="mr-2 h-5 w-5" /> Download
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-green-400">Story Script</h3>
                <div className="bg-black/50 border border-green-800/20 p-4 rounded-lg">
                  {storySteps.map((step, index) => (
                    <div key={step.id} className="mb-3">
                      <span className="font-medium text-green-400">Scene {index + 1}:</span>{" "}
                      <span className="text-gray-300">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-black/90 backdrop-blur-sm border-t border-green-800/50 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">
            Cyber GPT YouTube Creator • Made by Maheer Khan
          </p>
        </div>
      </main>
    </div>
  );
};

export default YoutubeCreator;
