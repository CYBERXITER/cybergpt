
import React, { useState, useRef, useEffect } from 'react';
import { Send, GraduationCap, BookOpen, PenTool, Calculator, Beaker, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateGeminiResponse } from '../utils/geminiApi';

const StudyBuddyChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateGeminiResponse(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const studyCategories = [
    { icon: PenTool, text: "Essay Writing" },
    { icon: Calculator, text: "Mathematics" },
    { icon: Beaker, text: "Sciences" },
    { icon: History, text: "History" },
    { icon: BookOpen, text: "Literature" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Study Squad</h1>
          </div>
          <p className="text-center text-purple-100 text-lg">Your Personal Academic Assistant</p>
          <p className="text-center text-purple-200 text-sm mt-1">Made by Maheer Khan</p>
        </div>

        {/* Study Categories */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-purple-50">
          {studyCategories.map((category, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-purple-100 transition-colors border border-purple-100"
              onClick={() => setInput(`Help me with ${category.text}`)}
            >
              <category.icon className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm text-gray-700">{category.text}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-purple-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <GraduationCap className="h-16 w-16 mx-auto text-purple-400 mb-4" />
              <p className="text-xl font-semibold mb-2">Welcome to Study Squad!</p>
              <p className="text-md mb-4">Your 24/7 study companion for academic excellence</p>
              <div className="mt-6 text-sm text-gray-600 max-w-md mx-auto">
                <p className="font-medium mb-2">I can help you with:</p>
                <ul className="space-y-2 text-left px-8 list-disc">
                  <li>Writing essays and papers</li>
                  <li>Solving math problems</li>
                  <li>Understanding scientific concepts</li>
                  <li>Analyzing historical events</li>
                  <li>Literature analysis and comprehension</li>
                </ul>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white border border-purple-100 text-gray-800 rounded-bl-none shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-purple-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-purple-100 bg-white">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask any study-related question..."
              className="flex-1 border-purple-200 focus:border-purple-400"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudyBuddyChat;
