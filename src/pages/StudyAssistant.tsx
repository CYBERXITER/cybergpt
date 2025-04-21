
import React from 'react';
import { Book, ImageIcon, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const StudyAssistant = () => {
  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-violet-100 to-white">
      <aside className="hidden md:flex flex-col w-72 border-r border-violet-100 bg-white/95 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-100">
          <span className="font-bold text-violet-700 text-xl flex gap-2 items-center">
            <Book className="w-6 h-6" /> Study Assistant
          </span>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/image-generator">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white transition-all duration-300">
              <ImageIcon className="mr-2 h-4 w-4" /> Image Creator
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
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-white to-violet-50 justify-between">
        <div className="flex md:hidden items-center justify-between bg-white/95 backdrop-blur-sm border-b border-violet-100 px-3 py-2">
          <span className="text-base font-bold text-violet-700 flex items-center gap-2">
            <Book className="w-5 h-5" /> Study Assistant
          </span>
        </div>
        
        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-violet-50 bg-white">
          <Link to="/image-generator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs">
              <ImageIcon className="mr-1 h-3 w-3" /> Image Creator
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
            <Book className="w-8 h-8" /> Study Squad Assistant
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gradient-to-b from-white to-violet-50">
          <div className="flex flex-col items-center justify-center min-h-80 text-center animate-fade-in">
            <Book className="w-20 h-20 text-violet-400 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2">Study Assistant AI</h2>
            <p className="text-gray-600 max-w-md">Your personalized study companion. Ask any question and get help with your studies.</p>
          </div>
        </div>

        <div className="bg-white backdrop-blur-sm border-t border-violet-100 px-4 py-5 sticky bottom-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end">
              <input
                placeholder="Ask me anything about your studies..."
                className="flex-1 rounded-md border border-violet-200 focus:border-violet-400 px-4 py-3 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-violet-300"
              />
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition-colors"
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyAssistant;
