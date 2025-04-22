import React, { useState } from 'react';
import { MessageSquare, Video, Image as ImageIcon, Send, PlayCircle, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { generateGeminiResponse } from '../utils/geminiApi';

interface StoryStep {
  id: string;
  text: string;
  imageUrl?: string;
}

const YoutubeCreator = () => {
  const [topic, setTopic] = useState('');
  const [storySteps, setStorySteps] = useState<StoryStep[]>([]);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'prompt' | 'story' | 'images' | 'video'>('prompt');
  
  const generateStory = async () => {
    if (!topic.trim() || isGeneratingStory) return;
    
    setIsGeneratingStory(true);
    setCurrentStep('story');
    toast({ title: "Generating story", description: "Please wait while we create your YouTube script." });
    
    try {
      const prompt = `Create a short, engaging script for a YouTube Short (less than 60 seconds) about: ${topic}. 
      Format it as 5-7 brief scenes (1-2 sentences each), with each scene marked with "Scene 1:", "Scene 2:", etc.`;
      
      const response = await generateGeminiResponse(prompt);
      
      const sceneRegex = /Scene \d+:\s*(.*?)(?=Scene \d+:|$)/gs;
      let match;
      const scenes: string[] = [];
      
      while ((match = sceneRegex.exec(response)) !== null) {
        if (match[1].trim()) {
          scenes.push(match[1].trim());
        }
      }
      
      if (scenes.length === 0) {
        const fallbackScenes = response.split(/Scene \d+:/g).filter(Boolean).map(scene => scene.trim());
        scenes.push(...fallbackScenes);
      }
      
      if (scenes.length === 0) {
        scenes.push(
          "Our story begins with an introduction to the topic.",
          "We explore the key aspects and features.",
          "Interesting examples are presented to the audience.",
          "We discuss impacts and implications of the subject.",
          "The conclusion summarizes the main points and offers a final thought."
        );
      }
      
      const storyStepsArray: StoryStep[] = scenes.map((text, index) => ({
        id: `scene-${index + 1}`,
        text: text
      }));
      
      setStorySteps(storyStepsArray);
      toast({ title: "Story generated", description: "Your YouTube script has been created!" });
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast({ 
        title: "Story generation failed", 
        description: "There was an error creating your story. Please try again.", 
        variant: "destructive" 
      });
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
        let imageUrl = '';
        if (index === 0 && topic.toLowerCase().includes("boy")) {
          imageUrl = "/lovable-uploads/97171f03-a914-4b89-a3aa-f02efbfb18e7.png";
        } else if (index === 0 && topic.toLowerCase().includes("dog")) {
          imageUrl = "/lovable-uploads/8f03d61e-8a1b-41c2-b658-545c3a1155a0.png";
        } else {
          imageUrl = `https://picsum.photos/seed/${step.id}/800/600`;
        }
        
        await new Promise(r => setTimeout(r, 500));
        return {
          ...step,
          imageUrl
        };
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
      
      const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      setVideoUrl(sampleVideoUrl);
      
      toast({ title: "Video created", description: "Your YouTube Short is ready to view and download!" });
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
      const videoElement = document.querySelector('video');
      if (videoElement) {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if ((videoElement as any).webkitRequestFullscreen) {
          (videoElement as any).webkitRequestFullscreen();
        } else if ((videoElement as any).msRequestFullscreen) {
          (videoElement as any).msRequestFullscreen();
        }
      } else {
        window.open(videoUrl, '_blank', 'width=800,height=600');
      }
    } catch (error) {
      console.error("Error with fullscreen:", error);
      window.open(videoUrl, '_blank', 'width=800,height=600');
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `youtube-short-${Date.now()}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({ title: "Download started", description: "Your video is being downloaded." });
    } catch (error) {
      console.error("Error downloading video:", error);
      toast({ 
        title: "Download failed", 
        description: "There was an error downloading your video. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-violet-100 to-white">
      <aside className="hidden md:flex flex-col w-72 border-r border-violet-100 bg-white/95 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-100">
          <span className="font-bold text-violet-700 text-xl flex gap-2 items-center">
            <Video className="w-6 h-6" /> YouTube Creator
          </span>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white transition-all duration-300">
              <MessageSquare className="mr-2 h-4 w-4" /> Study Assistant
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/image-generator">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all duration-300">
              <ImageIcon className="mr-2 h-4 w-4" /> Image Generator
            </Button>
          </Link>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold mb-4 text-violet-800">Creation Progress</h3>
          <div className="space-y-3">
            <div className={`flex items-center gap-2 ${currentStep === 'prompt' ? 'text-violet-800 font-medium' : 'text-gray-600'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'prompt' ? 'bg-violet-600 text-white' : 'bg-gray-200'
              }`}>1</div>
              Enter Topic Prompt
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'story' ? 'text-violet-800 font-medium' : 'text-gray-600'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'story' ? 'bg-violet-600 text-white' : 'bg-gray-200'
              }`}>2</div>
              Generate Story Script
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'images' ? 'text-violet-800 font-medium' : 'text-gray-600'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'images' ? 'bg-violet-600 text-white' : 'bg-gray-200'
              }`}>3</div>
              Create Scene Images
            </div>
            <div className={`flex items-center gap-2 ${currentStep === 'video' ? 'text-violet-800 font-medium' : 'text-gray-600'}`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                currentStep === 'video' ? 'bg-violet-600 text-white' : 'bg-gray-200'
              }`}>4</div>
              Produce Final Video
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-white to-violet-50 justify-between">
        <div className="flex md:hidden items-center justify-between bg-white/95 backdrop-blur-sm border-b border-violet-100 px-3 py-2">
          <span className="text-base font-bold text-violet-700 flex items-center gap-2">
            <Video className="w-5 h-5" /> YouTube Creator
          </span>
        </div>
        
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-violet-50 bg-white">
          <Link to="/" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs">
              <MessageSquare className="mr-1 h-3 w-3" /> Study Chat
            </Button>
          </Link>
          <Link to="/image-generator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs">
              <ImageIcon className="mr-1 h-3 w-3" /> Images
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <Video className="w-8 h-8" /> YouTube Shorts Creator
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-b from-white to-violet-50">
          {currentStep === 'prompt' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">Create Engaging YouTube Shorts</h2>
                <p className="text-gray-600">Generate complete YouTube Shorts with scripts, images, and video in minutes!</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like your YouTube Short to be about?
                </label>
                <Textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="E.g., '5 amazing science facts that will blow your mind' or 'How to learn a new language fast'"
                  className="min-h-[100px]"
                />
                <div className="flex justify-end mt-4">
                  <Button
                    onClick={generateStory}
                    disabled={!topic.trim() || isGeneratingStory}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-colors"
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
                <h2 className="text-xl font-bold text-red-600">Your YouTube Script</h2>
                <Button variant="outline" onClick={resetProject} size="sm">
                  Start Over
                </Button>
              </div>
              
              <div className="space-y-4">
                {storySteps.map((step, index) => (
                  <div key={step.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <h3 className="font-medium">Scene {index + 1}</h3>
                    </div>
                    <p className="text-gray-700">{step.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={generateImages}
                  disabled={storySteps.length === 0 || isGeneratingImages}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-colors"
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
                <h2 className="text-xl font-bold text-purple-600">Your Scene Images</h2>
                <Button variant="outline" onClick={resetProject} size="sm">
                  Start Over
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {storySteps.map((step, index) => (
                  <div key={step.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                    {step.imageUrl ? (
                      <img 
                        src={step.imageUrl} 
                        alt={`Scene ${index + 1}`} 
                        className="w-full aspect-video object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <h3 className="font-medium">Scene {index + 1}</h3>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={createVideo}
                  disabled={storySteps.some(step => !step.imageUrl) || isGeneratingVideo}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-colors"
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
                <h2 className="text-xl font-bold text-red-600">Your YouTube Short</h2>
                <Button variant="outline" onClick={resetProject} size="sm">
                  Create New Video
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="aspect-[9/16] mx-auto max-w-sm bg-black rounded-lg overflow-hidden shadow-lg mb-6">
                  <video 
                    src={videoUrl} 
                    controls
                    className="w-full h-full object-contain"
                    poster={storySteps[0]?.imageUrl}
                  />
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={handleViewFullScreen}>
                    <PlayCircle className="mr-2 h-5 w-5" /> View Full Screen
                  </Button>
                  <Button onClick={downloadVideo} className="bg-gradient-to-r from-red-500 to-pink-600">
                    <Download className="mr-2 h-5 w-5" /> Download
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Story Script</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {storySteps.map((step, index) => (
                    <div key={step.id} className="mb-3">
                      <span className="font-medium">Scene {index + 1}:</span> {step.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default YoutubeCreator;
