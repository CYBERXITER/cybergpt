
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Image as ImageIcon, Code, ShieldAlert, List, FileText, PanelLeft, Clock, Zap, Gamepad, Target, Hash } from "lucide-react";
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
import "../index.css";

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
      content: "Hello! I'm Cyber Xiters, your AI assistant for cybersecurity education, gaming strategies, and technology. How can I help you today?",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const [codePrompt, setCodePrompt] = useState("");
  const [gamePrompt, setGamePrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState<string>(`session-${Date.now()}`);
  const [responseFormat, setResponseFormat] = useState<'normal' | 'concise' | 'bullets' | 'numbered'>('normal');

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
      // Check if the user is asking for a numbered response
      let format = responseFormat;
      if (inputMessage.toLowerCase().includes("in numbers") || 
          inputMessage.toLowerCase().includes("in numbered format") || 
          inputMessage.toLowerCase().includes("as a numbered list")) {
        format = 'numbered';
      }
      
      // Call Gemini API with the session ID to maintain history
      const response = await generateGeminiResponse(inputMessage, undefined, sessionId, format);
      
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
        `Generate detailed code examples and explanations for educational purposes related to: ${codePrompt}. Provide secure coding examples with proper comments and educational context.`, 
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

  const generateGamingAdvice = async () => {
    if (!gamePrompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call Gemini API with gaming instruction 
      const response = await generateGeminiResponse(
        `As a gaming expert, provide detailed technical analysis and educational code examples about: ${gamePrompt}. Include specific programming concepts and implementation details where relevant.`, 
        undefined, 
        `game-${Date.now()}`
      );
      
      const userMessage: Message = {
        role: "user",
        content: gamePrompt,
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
      setGamePrompt("");
    } catch (error) {
      console.error("Error generating gaming advice:", error);
      toast.error("Failed to generate gaming advice. Please try again.");
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
    <div className="relative min-h-screen bg-gradient-to-b from-green-900/30 to-black text-white">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/lovable-uploads/7ec40821-bc70-42c0-b129-7a93ae35b8b3.png"
            alt="Cyber Xiters Logo"
            className="h-32 w-32 mb-2 animate-pulse"
          />
          <h1 className="text-4xl font-bold text-green-500 mb-2 cyber-glow">CYBER XITERS</h1>
          <p className="text-gray-300">Your AI assistant for cybersecurity, gaming, and technology</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-4 mb-4 bg-black/70 backdrop-blur-sm border-green-700 animate-fade-in">
            <TabsTrigger 
              value="chat" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-700 data-[state=active]:text-white hover:bg-green-900/30 transition-all duration-300"
            >
              <Bot className="mr-2 h-5 w-5" /> Chat
            </TabsTrigger>
            <TabsTrigger 
              value="game" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-700 data-[state=active]:text-white hover:bg-green-900/30 transition-all duration-300"
            >
              <Gamepad className="mr-2 h-5 w-5" /> Gaming
            </TabsTrigger>
            <TabsTrigger 
              value="image" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-700 data-[state=active]:text-white hover:bg-green-900/30 transition-all duration-300"
            >
              <ImageIcon className="mr-2 h-5 w-5" /> Image
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-700 data-[state=active]:text-white hover:bg-green-900/30 transition-all duration-300"
            >
              <Code className="mr-2 h-5 w-5" /> Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="w-full animate-fade-in">
            <Card className="bg-black/80 border-green-700/50 backdrop-blur-sm glass-card">
              <div className="flex justify-between items-center px-4 pt-4">
                <div className="flex items-center gap-2">
                  <PanelLeft className="h-4 w-4 text-green-500" />
                  <span className="text-green-400 text-sm">Response Format:</span>
                </div>
                
                <ToggleGroup type="single" value={responseFormat} onValueChange={(value) => value && setResponseFormat(value as 'normal' | 'concise' | 'bullets' | 'numbered')}>
                  <ToggleGroupItem value="normal" aria-label="Normal format" className="text-xs hover:bg-green-900/30 data-[state=on]:bg-green-800">
                    Normal
                  </ToggleGroupItem>
                  <ToggleGroupItem value="concise" aria-label="Concise format" className="text-xs hover:bg-green-900/30 data-[state=on]:bg-green-800">
                    Concise
                  </ToggleGroupItem>
                  <ToggleGroupItem value="bullets" aria-label="Bullet points" className="text-xs hover:bg-green-900/30 data-[state=on]:bg-green-800">
                    <List className="h-3 w-3 mr-1" /> Bullets
                  </ToggleGroupItem>
                  <ToggleGroupItem value="numbered" aria-label="Numbered list" className="text-xs hover:bg-green-900/30 data-[state=on]:bg-green-800">
                    <Hash className="h-3 w-3 mr-1" /> Numbered
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
                    } animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                          : "bg-black/80 border border-green-700/50 text-white"
                      } hover:scale-[1.01] transition-all duration-200`}
                    >
                      {message.type === "text" ? (
                        <div className="whitespace-pre-wrap markdown-content"
                           dangerouslySetInnerHTML={{ 
                             __html: message.content
                               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                               .replace(/\*(.*?)\*/g, '<em>$1</em>')
                               .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                               .replace(/`([^`]+)`/g, '<code>$1</code>')
                               .replace(/# (.*?)\n/g, '<h1>$1</h1>')
                               .replace(/## (.*?)\n/g, '<h2>$1</h2>')
                               .replace(/### (.*?)\n/g, '<h3>$1</h3>')
                               .replace(/(?:\n|^)(\d+\.) (.*?)(?:\n|$)/g, '<ol><li>$2</li></ol>')
                               .replace(/(?:\n|^)[*-] (.*?)(?:\n|$)/g, '<ul><li>$1</li></ul>')
                         }}
                        />
                      ) : (
                        <div>
                          <p>{message.content}</p>
                          {message.imageUrl && (
                            <img 
                              src={message.imageUrl} 
                              alt="Generated" 
                              className="mt-2 rounded-lg max-w-full hover:scale-105 transition-transform duration-300 cursor-pointer" 
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
                  className="flex-1 mr-2 bg-black/70 border-green-700/50 text-white focus:border-green-500 focus:ring-green-500/30 transition-all"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 shadow-md hover:shadow-green-700/20"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="game" className="w-full animate-fade-in">
            <Card className="bg-black/80 border-green-700/50 backdrop-blur-sm glass-card">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-medium text-white">Gaming Assistant</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Get expert gaming knowledge, technical insights, and educational information about game mechanics, programming concepts, and more.
                </p>
                <Textarea
                  placeholder="Ask about game mechanics, programming concepts, or technical aspects of games..."
                  value={gamePrompt}
                  onChange={(e) => setGamePrompt(e.target.value)}
                  className="mb-4 bg-black/70 border-green-700/50 text-white focus:border-green-500 resize-none"
                  rows={3}
                />
                <Button 
                  onClick={generateGamingAdvice} 
                  disabled={isLoading || !gamePrompt.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 group"
                >
                  <Target className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  {isLoading ? "Generating..." : "Get Gaming Analysis"}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  <Card className="bg-black/50 border border-green-700/30 p-3 hover:bg-green-900/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-medium text-green-400">Game Mechanics</h4>
                    </div>
                    <p className="text-xs text-gray-400">Learn about technical implementations, physics engines, and optimization techniques</p>
                  </Card>
                  <Card className="bg-black/50 border border-green-700/30 p-3 hover:bg-green-900/20 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <h4 className="text-sm font-medium text-green-400">Performance Analysis</h4>
                    </div>
                    <p className="text-xs text-gray-400">Technical insights on improving gameplay skills through understanding game architecture</p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="image" className="w-full animate-fade-in">
            <Card className="bg-black/80 border-green-700/50 backdrop-blur-sm glass-card">
              <div className="p-4">
                <h3 className="text-xl font-medium mb-2 text-white">Image Generation</h3>
                <p className="text-gray-300 mb-4">
                  Generate images using Stability AI. Describe what you want to see.
                </p>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="mb-4 bg-black/70 border-green-700/50 text-white focus:border-green-500"
                  rows={3}
                />
                <div className="flex justify-between gap-3">
                  <Link to="/image-generator" className="flex-1">
                    <Button 
                      className="w-full bg-black/60 border-green-700 hover:bg-green-900/50 transition-all duration-300"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> Advanced Generator
                    </Button>
                  </Link>
                  <Button 
                    onClick={generateStabilityImage} 
                    disabled={isLoading || !imagePrompt.trim()}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-all duration-300"
                  >
                    {isLoading ? "Generating..." : "Generate Image"}
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-green-900 my-4" />
              
              <div className="p-4 h-[40vh] overflow-y-auto">
                {messages.filter(m => m.type === "image").map((message, index) => (
                  message.imageUrl && (
                    <div key={`img-${index}`} className="mb-4 animate-fade-in hover:scale-[1.02] transition-all duration-300">
                      <p className="text-sm text-gray-300 mb-1">Prompt: {messages[messages.indexOf(message) - 1]?.content}</p>
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        className="rounded-lg max-w-full shadow-lg shadow-green-900/30" 
                      />
                    </div>
                  )
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="w-full animate-fade-in">
            <Card className="bg-black/80 border-green-700/50 backdrop-blur-sm glass-card">
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <ShieldAlert className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-xl font-medium text-white">Code Analysis & Security</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Get educational code examples and technical explanations for cybersecurity, game programming, and software development concepts.
                </p>
                <Textarea
                  placeholder="Ask about programming concepts, security implementations, or request code examples..."
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  className="mb-4 bg-black/70 border-green-700/50 text-white focus:border-green-500"
                  rows={3}
                />
                <Button 
                  onClick={generateSecurityCode} 
                  disabled={isLoading || !codePrompt.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 group"
                >
                  <Code className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  {isLoading ? "Generating..." : "Generate Code Examples"}
                </Button>
              </div>
              
              <div className="p-4 mt-2">
                <h4 className="text-sm font-medium text-green-400 mb-2">Example Queries:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/30 border border-green-700/30 p-2 rounded hover:bg-green-900/10 cursor-pointer">
                    "Explain game collision detection algorithms with code examples"
                  </div>
                  <div className="bg-black/30 border border-green-700/30 p-2 rounded hover:bg-green-900/10 cursor-pointer">
                    "Show me implementations of cryptography in Python"
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <style jsx global>{`
          .markdown-content pre {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
            border: 1px solid rgba(0, 255, 0, 0.2);
          }
          
          .markdown-content code {
            background-color: rgba(0, 0, 0, 0.4);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: monospace;
            color: #00cc00;
          }
          
          .markdown-content h1, 
          .markdown-content h2, 
          .markdown-content h3 {
            color: #00ff00;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            font-weight: bold;
          }
          
          .markdown-content h1 {
            font-size: 1.5rem;
          }
          
          .markdown-content h2 {
            font-size: 1.25rem;
          }
          
          .markdown-content h3 {
            font-size: 1.1rem;
          }
          
          .markdown-content ul, 
          .markdown-content ol {
            margin-left: 1.5rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .markdown-content ul li {
            list-style-type: disc;
          }
          
          .markdown-content ol li {
            list-style-type: decimal;
          }
          
          .cyber-glow {
            text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
            }
            50% {
              text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00;
            }
            100% {
              text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
            }
          }
          
          .glass-card {
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 255, 0, 0.1);
            border: 1px solid rgba(0, 255, 0, 0.2);
            transition: all 0.3s ease;
          }
          
          .glass-card:hover {
            box-shadow: 0 8px 32px rgba(0, 255, 0, 0.2);
            border: 1px solid rgba(0, 255, 0, 0.3);
          }
        `}</style>
        
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>Made by Cyber Xiters Team</p>
        </div>
      </div>
    </div>
  );
};

export default CyberAssistant;
