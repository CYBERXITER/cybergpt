
import React, { useState, useRef, useEffect } from 'react';
import { Send, GraduationCap, BookOpen, PenTool, Calculator, Beaker, History, Upload, Minimize, Maximize, Sparkles, BookMarked, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { generateGeminiResponse } from '../utils/geminiApi';
import { fileToBase64 } from '../utils/fileUtils';

type ResponseAction = 'simplify' | 'shorten' | 'complex' | 'bulletPoints' | 'headings';

interface ResponseOption {
  label: string;
  action: ResponseAction;
  icon: React.ReactNode;
}

const StudyBuddyChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !fileBase64) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: uploadedFile 
        ? `${userMessage} [Uploaded: ${uploadedFile.name}]` 
        : userMessage 
    }]);
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateGeminiResponse(userMessage, fileBase64 || undefined);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      // Clear file after sending
      setUploadedFile(null);
      setFileBase64(null);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again."
      }]);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept images and PDFs
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Invalid file",
        description: "Only images and PDF files are supported",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      setFileBase64(base64);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready to send`,
      });
    } catch (error) {
      console.error('Error encoding file:', error);
      toast({
        title: "Upload error",
        description: "Failed to process the file",
        variant: "destructive"
      });
    }
  };

  const formatResponse = (lastResponse: string, action: ResponseAction) => {
    if (!lastResponse) return;
    
    setIsLoading(true);
    
    let promptPrefix = '';
    switch (action) {
      case 'simplify':
        promptPrefix = "Please simplify the following explanation in easier terms: ";
        break;
      case 'shorten':
        promptPrefix = "Please provide a shorter version of: ";
        break;
      case 'complex':
        promptPrefix = "Please provide a more detailed and complex explanation of: ";
        break;
      case 'bulletPoints':
        promptPrefix = "Please convert the following into bullet points: ";
        break;
      case 'headings':
        promptPrefix = "Please reformat with clear headings and sections: ";
        break;
    }
    
    // Remove the last assistant message and add the formatting request
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages.pop(); // Remove the last assistant message
      return [...newMessages, { role: 'user', content: `${action} this response` }];
    });
    
    generateGeminiResponse(promptPrefix + lastResponse)
      .then(response => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response
        }]);
      })
      .catch(error => {
        console.error('Error formatting response:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I apologize, but I couldn't format the response. Please try again."
        }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const responseOptions: ResponseOption[] = [
    { label: 'Simplify', action: 'simplify', icon: <Minimize className="h-4 w-4" /> },
    { label: 'Shorten', action: 'shorten', icon: <Minimize className="h-4 w-4" /> },
    { label: 'Make Complex', action: 'complex', icon: <Maximize className="h-4 w-4" /> },
    { label: 'Bullet Points', action: 'bulletPoints', icon: <BookMarked className="h-4 w-4" /> },
    { label: 'Add Headings', action: 'headings', icon: <Brain className="h-4 w-4" /> },
  ];

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
                <div dangerouslySetInnerHTML={{ 
                  __html: message.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
                    .replace(/# (.*?)$/gm, '<h2 class="text-xl font-bold my-2">$1</h2>') // Heading
                    .replace(/## (.*?)$/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>') // Subheading
                    .replace(/\n\n/g, '<br /><br />') // Line breaks
                    .replace(/\n/g, '<br />') // Line breaks
                    .replace(/\* (.*?)$/gm, '<li>$1</li>') // Bullet points
                }} />
                
                {message.role === 'assistant' && index === messages.length - 1 && !isLoading && (
                  <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-purple-100">
                    {responseOptions.map((option) => (
                      <Button 
                        key={option.action}
                        variant="outline" 
                        size="sm"
                        className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        onClick={() => formatResponse(message.content, option.action)}
                      >
                        {option.icon}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                )}
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
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Upload className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Upload a file</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload an image or PDF to analyze
                    </p>
                  </div>
                  <div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="text-sm"
                    />
                  </div>
                  {uploadedFile && (
                    <div className="text-sm text-purple-600 font-medium">
                      Ready to send: {uploadedFile.name}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              type="submit" 
              disabled={(!input.trim() && !fileBase64) || isLoading}
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
