import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, ImageIcon, Video } from "lucide-react";
import ParticlesBackground from "../components/ParticlesBackground";
import { CategoryDialog } from "../components/CategoryDialog";

const Index = () => {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      setShowCategoryDialog(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-green-500">
      <ParticlesBackground />
      
      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center z-10 mt-10 animate-fade-in">
          <div className="mb-6 relative">
            <img
              src="/lovable-uploads/d6ec949f-c851-49b9-9ad9-1be4ff947f0c.png"
              alt="Cyber GPT Logo"
              className="w-32 h-32 md:w-44 md:h-44 xl:w-52 xl:h-52 object-contain drop-shadow-[0_0_15px_rgba(0,255,0,0.7)] animate-pulse"
            />
            <div className="absolute -inset-2 rounded-full border-2 border-green-500 opacity-50 animate-ping"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-700 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)] mb-2 text-center animate-pulse">
            CYBER GPT
          </h1>
          
          <span className="text-sm md:text-lg text-green-400 font-medium mt-1 animate-fade-in-slow">
            made by Maheer Khan
          </span>
        </div>

        {/* Slogan */}
        <div className="mt-6 mb-10 max-w-xl text-center animate-fade-in">
          <p className="text-lg md:text-2xl font-semibold text-green-400">
            Your AI assistant for cybersecurity, images, and more
          </p>
        </div>

        {/* CTA - Main buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14 w-full max-w-5xl">
          <Link to="/study-assistant" className="w-full">
            <Button size="lg" className="w-full text-white font-bold text-xl h-20 bg-gradient-to-br from-green-500 to-green-700 border border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] transition-all group">
              <MessageSquare className="mr-2 h-6 w-6 group-hover:animate-bounce" />
              <span>AI Assistant</span>
            </Button>
          </Link>
          
          <Link to="/image-generator" className="w-full">
            <Button size="lg" className="w-full text-white font-bold text-xl h-20 bg-gradient-to-br from-green-600 to-green-800 border border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] transition-all group">
              <ImageIcon className="mr-2 h-6 w-6 group-hover:animate-bounce" />
              <span>Image Generator</span>
            </Button>
          </Link>
          
          <Link to="/youtube-creator" className="w-full md:col-span-2 lg:col-span-1">
            <Button size="lg" className="w-full text-white font-bold text-xl h-20 bg-gradient-to-br from-green-500 to-green-700 border border-green-400 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_20px_rgba(0,255,0,0.6)] transition-all group">
              <Video className="mr-2 h-6 w-6 group-hover:animate-bounce" />
              <span>YouTube Creator</span>
            </Button>
          </Link>
        </div>

        {/* Discord Button */}
        <a 
          href="https://discord.gg/K4ZeEKJdGb" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mb-10"
        >
          <Button 
            size="lg" 
            className="text-white font-bold text-xl px-8 py-4 bg-gradient-to-br from-indigo-500 to-indigo-700 border border-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all group"
          >
            <ExternalLink className="mr-2 h-6 w-6 group-hover:animate-bounce" />
            Join Discord Server
          </Button>
        </a>

        {/* About Section */}
        <div id="about" className="w-full max-w-5xl bg-black/50 backdrop-blur-sm border border-green-500 p-8 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.3)] mb-20">
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">About Cyber GPT</h2>
          <div className="space-y-4 text-green-200">
            <p>
              We've been developing high-quality AI tools for cybersecurity enthusiasts, 
              developers, and digital creators. Our platform combines powerful AI capabilities 
              with intuitive interfaces.
            </p>
            <p>
              Cyber GPT provides AI assistance for educational purposes related to cybersecurity, 
              ethical hacking, and penetration testing. Our tools help you understand security 
              concepts, create content, and generate images for your projects.
            </p>
            <p>
              We prioritize responsible usage of AI technology and encourage our users to apply 
              these tools ethically and legally. Join our growing community on Discord to connect 
              with like-minded individuals.
            </p>
          </div>
        </div>
      </div>

      <CategoryDialog 
        open={showCategoryDialog} 
        onOpenChange={setShowCategoryDialog} 
      />

      {/* Animation keyframes */}
      <style>{`
        @keyframes floatLogo {
          0% { transform: translateY(0px);}
          50% { transform: translateY(-24px);}
          100% { transform: translateY(0px);}
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fade-in-slow {
          animation: fade-in 1.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Index;
