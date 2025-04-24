
import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Image as ImageIcon,
  Youtube,
  Bot,
  Info,
  ShieldAlert,
  BarChart
} from "lucide-react";
import { Button } from "../components/ui/button";
import ParticlesBackground from "../components/ParticlesBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-black">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center mb-12">
          <img
            src="/lovable-uploads/b870771f-ac84-4402-94fd-d1e1b7cca188.png"
            alt="Cyber Xiters Logo"
            className="h-32 w-32 mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-green-500 text-center mb-2">
            CYBER XITERS
          </h1>
          <p className="text-xl text-gray-300 text-center">
            Your AI assistant for cybersecurity, images, and more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Cyber Assistant Card */}
          <Link to="/cyber-assistant" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <ShieldAlert className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                Cyber Assistant
              </h2>
              <p className="text-gray-400 text-center">
                Your AI-powered cybersecurity assistant with image generation and code support.
              </p>
            </div>
          </Link>

          {/* Study Buddy Card */}
          <Link to="/study-assistant" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                Study Assistant
              </h2>
              <p className="text-gray-400 text-center">
                Get help with studies, homework, and academic research.
              </p>
            </div>
          </Link>

          {/* Image Generator Card */}
          <Link to="/image-generator" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <ImageIcon className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                Image Generator
              </h2>
              <p className="text-gray-400 text-center">
                Create custom images with AI-powered image generation.
              </p>
            </div>
          </Link>

          {/* YouTube Creator Card */}
          <Link to="/youtube-creator" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <Youtube className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                YouTube Creator
              </h2>
              <p className="text-gray-400 text-center">
                Generate ideas, scripts, and content for YouTube videos.
              </p>
            </div>
          </Link>

          {/* About Card */}
          <Link to="/about" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <Info className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                About
              </h2>
              <p className="text-gray-400 text-center">
                Learn more about Cyber Xiters and its capabilities.
              </p>
            </div>
          </Link>
          
          {/* Admin Dashboard Card */}
          <Link to="/admin-dashboard" className="group">
            <div className="bg-gray-900 bg-opacity-80 border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:bg-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-900 bg-opacity-30 mb-6 mx-auto">
                <BarChart className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-white text-center mb-3">
                Admin Dashboard
              </h2>
              <p className="text-gray-400 text-center">
                View usage analytics and monitor system performance.
              </p>
            </div>
          </Link>
        </div>
        
        <div className="text-center mt-12 text-gray-500 text-sm">
          Made by Cyber Xiters Team
        </div>
      </div>
    </div>
  );
};

export default Index;
