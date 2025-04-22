
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F1F0FB] via-[#ede9fe] to-white relative overflow-hidden">
      {/* Decorative background animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-[#a78bfa]/60 to-[#6366f1]/30 rounded-full blur-3xl opacity-50 left-[-200px] top-[-300px] animate-pulse"></div>
        <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-[#fcd34d]/40 to-[#a78bfa]/40 rounded-full blur-2xl opacity-40 right-[-100px] bottom-[-200px] animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Animated Logo and Branding */}
      <div className="flex flex-col items-center z-10 mt-10 animate-fade-in">
        <div className="mb-4">
          {/* Animated logo with floating effect */}
          <img
            src="/lovable-uploads/0d2334ef-f2c1-4ba4-8527-0080c632325d.png"
            alt="Study Squad Logo"
            className="w-32 h-32 md:w-44 md:h-44 xl:w-52 xl:h-52 object-contain drop-shadow-lg rounded-full animate-[floatLogo_3s_ease-in-out_infinite]"
            style={{
              animationName: 'floatLogo',
              animationDuration: '3s',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-violet-700 via-violet-500 to-[#4f46e5] drop-shadow-lg flex items-center gap-2 transition-all animate-scale-in">
          Study Squad Assistant
        </h1>
        <span className="text-sm md:text-lg text-violet-500 font-medium mt-1 animate-fade-in-slow">
          made by Maheer Khan
        </span>
      </div>

      {/* Slogan */}
      <div className="mt-5 mb-10 max-w-xl text-center animate-fade-in">
        <p className="text-lg md:text-2xl font-semibold text-violet-700/90">
          Unlock your study power with personalized AI help for Questions, Images, Wallpapers, Logos &amp; Stories. Try out the Get Started options below!
        </p>
      </div>

      {/* CTA - Get Started */}
      <div className="flex gap-6 mb-14 animate-scale-in">
        <Link to="/study-assistant">
          <Button size="lg" className="text-white font-bold text-xl px-8 py-4 bg-gradient-to-br from-violet-500 via-violet-600 to-blue-500 shadow-lg hover:from-violet-600 hover:to-indigo-400 transition-all animate-pulse focus:ring-2 focus:ring-violet-300">
            Get Started
          </Button>
        </Link>
        <Link to="/youtube-creator">
          <Button
            size="lg"
            className="text-white font-bold text-xl px-8 py-4 bg-gradient-to-br from-pink-500 via-pink-600 to-red-500 shadow-lg hover:from-red-600 hover:to-pink-400 transition-all animate-pulse focus:ring-2 focus:ring-pink-200"
          >
            YouTube Shorts
          </Button>
        </Link>
      </div>

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
      `}</style>
    </div>
  );
};

export default Index;
