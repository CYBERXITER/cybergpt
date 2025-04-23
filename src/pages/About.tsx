import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ImageIcon, Video, ExternalLink, Shield, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ParticlesBackground from '../components/ParticlesBackground';

const About = () => {
  return (
    <div className="min-h-screen w-full bg-black text-green-400">
      <ParticlesBackground />
      
      {/* Matrix background animation (simplified) */}
      <div className="fixed inset-0 z-0 opacity-25">
        <div className="matrix-bg"></div>
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-md border-b border-green-800/50 sticky top-0 z-20">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png" 
                alt="Cyber GPT Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-green-500">Cyber GPT</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/" className="text-green-400 hover:text-green-300 transition-colors">Home</Link>
              <Link to="/study-assistant" className="text-green-400 hover:text-green-300 transition-colors">AI Assistant</Link>
              <Link to="/image-generator" className="text-green-400 hover:text-green-300 transition-colors">Image Generator</Link>
              <Link to="/youtube-creator" className="text-green-400 hover:text-green-300 transition-colors">YouTube Creator</Link>
              <Link to="/about" className="text-green-400 font-bold border-b-2 border-green-500 transition-colors">About</Link>
            </nav>
            
            <Link to="/" className="md:hidden">
              <Button variant="ghost" size="sm" className="text-green-400">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
          </div>
        </header>
        
        {/* Hero section */}
        <section className="bg-gradient-to-b from-black to-green-900/20 py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src="/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png" 
                alt="Cyber GPT Logo" 
                className="w-40 h-40 drop-shadow-[0_0_15px_rgba(0,255,0,0.7)] animate-pulse"
              />
              
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">About Cyber GPT</h1>
                <p className="text-lg text-green-300 max-w-2xl">
                  Cyber GPT is an advanced AI platform specializing in cybersecurity education, content creation, and digital assistance. We integrate cutting-edge AI tools to provide you with powerful capabilities for learning, creating, and exploring the digital world.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 px-4 bg-black/80">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-green-400">Platform Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/60 border border-green-800/30 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all">
                <div className="bg-green-500/20 p-3 rounded-full w-fit mb-4 mx-auto">
                  <MessageSquare className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-green-400">AI Assistant</h3>
                <p className="text-gray-400 text-center">
                  Get instant answers to your cybersecurity questions, learn about ethical hacking concepts, and receive educational guidance from our advanced AI.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link to="/study-assistant">
                    <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                      Try Assistant
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-black/60 border border-green-800/30 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all">
                <div className="bg-green-500/20 p-3 rounded-full w-fit mb-4 mx-auto">
                  <ImageIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-green-400">Image Generator</h3>
                <p className="text-gray-400 text-center">
                  Transform your ideas into stunning visuals using our AI-powered image generation tool, perfect for creating cyberpunk, tech, and digital art.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link to="/image-generator">
                    <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                      Generate Images
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-black/60 border border-green-800/30 p-6 rounded-lg hover:shadow-[0_0_15px_rgba(0,255,0,0.3)] transition-all">
                <div className="bg-green-500/20 p-3 rounded-full w-fit mb-4 mx-auto">
                  <Video className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-green-400">YouTube Creator</h3>
                <p className="text-gray-400 text-center">
                  Generate complete YouTube Shorts with AI-written scripts, matching visuals, and downloadable videos in just a few clicks.
                </p>
                <div className="mt-4 flex justify-center">
                  <Link to="/youtube-creator">
                    <Button variant="outline" size="sm" className="border-green-500/50 text-green-400">
                      Create Videos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technology & Mission section */}
        <section className="py-16 px-4 bg-gradient-to-t from-black to-green-900/20">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-black/60 border border-green-800/30 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
                  <Shield className="h-6 w-6" /> Our Mission
                </h3>
                <p className="text-gray-300 mb-4">
                  At Cyber GPT, we're committed to democratizing access to cybersecurity education and providing ethical tools for learning and content creation.
                </p>
                <p className="text-gray-300 mb-4">
                  We believe in empowering individuals to understand technology better while promoting responsible and ethical use of AI systems.
                </p>
                <p className="text-gray-300">
                  Our platform serves as an educational resource for those interested in cybersecurity, digital content creation, and AI technologies.
                </p>
              </div>
              
              <div className="bg-black/60 border border-green-800/30 p-6 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
                  <Code className="h-6 w-6" /> Our Technology
                </h3>
                <p className="text-gray-300 mb-4">
                  Cyber GPT leverages multiple advanced AI systems including Google's Gemini technology for natural language processing and Stability AI for image generation.
                </p>
                <p className="text-gray-300 mb-4">
                  Our platform integrates these technologies into a seamless experience that allows users to create content quickly and efficiently.
                </p>
                <p className="text-gray-300">
                  We continuously improve our systems to provide the most accurate, helpful, and ethical AI assistance possible.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Discord CTA */}
        <section className="py-16 px-4 bg-black/60 border-t border-green-800/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-green-400">Join Our Community</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Connect with like-minded individuals, get help with your projects, and stay updated on the latest features and improvements.
            </p>
            <a 
              href="https://discord.gg/K4ZeEKJdGb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 text-lg flex items-center gap-2">
                <ExternalLink className="h-5 w-5" /> Join our Discord Server
              </Button>
            </a>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-black/80 border-t border-green-800/40 py-6 px-4 mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Cyber GPT • Made by Maheer Khan • &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
        
        {/* Matrix animation styles */}
        <style>{`
          .matrix-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('/lovable-uploads/b838814f-d0e0-4078-89ef-53886047d9b8.png');
            background-size: cover;
            background-position: center;
            opacity: 0.15;
          }
        `}</style>
      </div>
    </div>
  );
};

export default About;
