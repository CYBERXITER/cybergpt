
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Image as ImageIcon, Code, ShieldAlert, List, FileText, PanelLeft, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import ParticlesBackground from "../components/ParticlesBackground";
import { generateImage } from "../utils/stabilityApi";
import { generateGeminiResponse, clearChatHistory } from "../utils/geminiApi";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type: "text" | "image";
  imageUrl?: string;
}

const CyberAssistant = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Cyber Xiters, your AI assistant for cybersecurity education and awareness. How can I help you today?",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [codePrompt, setCodePrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState<string>(`session-${Date.now()}`);
  const [responseFormat, setResponseFormat] = useState<'normal' | 'concise' | 'bullets'>('normal');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clean up session data when component unmounts
    return () => {
      clearChatHistory(sessionId);
    };
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call Gemini API with the session ID to maintain history
      const response = await generateGeminiResponse(inputMessage, undefined, sessionId, responseFormat);
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get a response. Please try again.");
      
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
        type: "text",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateStabilityImage = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const images = await generateImage(imagePrompt, "sk-9Ie0ZohdMDb0TQJLWQJjgMnE4uQrk0zHes4lWUtXnxXAB486");
      
      if (!images || images.length === 0) {
        throw new Error("Failed to generate image");
      }
      
      const userMessage: Message = {
        role: "user",
        content: imagePrompt,
        timestamp: new Date(),
        type: "text",
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: "Here's the image I generated:",
        timestamp: new Date(),
        type: "image",
        imageUrl: images[0].url,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setImagePrompt("");
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecurityCode = async () => {
    if (!codePrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call Gemini API with instruction to generate security-related code
      const response = await generateGeminiResponse(
        `Generate code for educational purposes related to: ${codePrompt}. Only provide defensive security code or educational examples.`, 
        undefined, 
        `code-${Date.now()}`
      );
      
      const userMessage: Message = {
        role: "user",
        content: codePrompt,
        timestamp: new Date(),
        type: "text",
      };

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setCodePrompt("");
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error("Failed to generate code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat history cleared. How can I assist you today?",
      timestamp: new Date(),
      type: "text",
    }]);
    clearChatHistory(sessionId);
    toast.success("Chat history has been cleared");
  };

  return (
    <div className="relative min-h-screen bg-black bg-opacity-70 text-white">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/lovable-uploads/f9295c86-42b1-4bdf-9f2f-715c87daab89.png"
            alt="Cyber Xiters Logo"
            className="h-32 w-32 mb-2"
          />
          <h1 className="text-4xl font-bold text-green-500 mb-2">CYBER XITERS</h1>
          <p className="text-gray-300">Your AI assistant for cybersecurity, images, and more</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-4 bg-black bg-opacity-60 border-green-700">
            <TabsTrigger value="chat" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <Bot className="mr-2 h-5 w-5" /> Chat
            </TabsTrigger>
            <TabsTrigger value="image" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <ImageIcon className="mr-2 h-5 w-5" /> Image Generation
            </TabsTrigger>
            <TabsTrigger value="code" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <Code className="mr-2 h-5 w-5" /> Security Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="w-full">
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm">
              <div className="flex justify-between items-center px-4 pt-4">
                <div className="flex items-center gap-2">
                  <PanelLeft className="h-4 w-4 text-green-500" />
                  <span className="text-green-400 text-sm">Response Format:</span>
                </div>
                
                <ToggleGroup type="single" value={responseFormat} onValueChange={(value) => value && setResponseFormat(value as 'normal' | 'concise' | 'bullets')}>
                  <ToggleGroupItem value="normal" aria-label="Normal format" className="text-xs">
                    Normal
                  </ToggleGroupItem>
                  <ToggleGroupItem value="concise" aria-label="Concise format" className="text-xs">
                    Concise
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bullets" aria-label="Bullet points" className="text-xs">
                    <List className="h-3 w-3 mr-1" /> Bullets
                  </ToggleGroupItem>
                </ToggleGroup>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-400" 
                  onClick={clearChat}
                >
                  <Clock className="h-3 w-3 mr-1" /> Clear Chat
                </Button>
              </div>
              
              <div className="p-4 h-[60vh] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === "user" ? "flex justify-end" : "flex justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-green-600 text-white"
                          : "bg-black/80 border border-green-700/50 text-white"
                      }`}
                    >
                      {message.type === "text" ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div>
                          <p>{message.content}</p>
                          {message.imageUrl && (
                            <img 
                              src={message.imageUrl} 
                              alt="Generated" 
                              className="mt-2 rounded-lg max-w-full" 
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <Separator className="bg-green-900" />
              <div className="p-4 flex">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 mr-2 bg-black bg-opacity-60 border-green-700 text-white"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="w-full">
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm">
              <div className="p-4">
                <h3 className="text-xl font-medium mb-2 text-white">Image Generation</h3>
                <p className="text-gray-300 mb-4">
                  Generate images using Stability AI. Describe what you want to see.
                </p>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="mb-4 bg-black bg-opacity-60 border-green-700 text-white"
                  rows={3}
                />
                <div className="flex justify-between gap-3">
                  <Link to="/image-generator" className="flex-1">
                    <Button 
                      className="w-full bg-black bg-opacity-60 border-green-700 hover:bg-green-900"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> Advanced Generator
                    </Button>
                  </Link>
                  <Button 
                    onClick={generateStabilityImage} 
                    disabled={isLoading || !imagePrompt.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? "Generating..." : "Generate Image"}
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-green-900 my-4" />
              
              <div className="p-4 h-[40vh] overflow-y-auto">
                {messages.filter(m => m.type === "image").map((message, index) => (
                  message.imageUrl && (
                    <div key={`img-${index}`} className="mb-4">
                      <p className="text-sm text-gray-300 mb-1">Prompt: {messages[messages.indexOf(message) - 1]?.content}</p>
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        className="rounded-lg max-w-full" 
                      />
                    </div>
                  )
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="w-full">
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm">
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <ShieldAlert className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-xl font-medium text-white">Security Code Assistance</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Get educational code examples for cybersecurity purposes. Learn about secure coding practices and security tools.
                </p>
                <Textarea
                  placeholder="Describe the security code you need help with..."
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  className="mb-4 bg-black bg-opacity-60 border-green-700 text-white"
                  rows={3}
                />
                <Button 
                  onClick={generateSecurityCode} 
                  disabled={isLoading || !codePrompt.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Generating..." : "Generate Security Code"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Made by Cyber Xiters Team</p>
        </div>
      </div>
    </div>
  );
};

export default CyberAssistant;
