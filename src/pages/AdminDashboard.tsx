
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Image as ImageIcon, Shield, Home, BarChart3, Search } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import ParticlesBackground from "../components/ParticlesBackground";

interface ChatSession {
  id: string;
  user: string;
  timestamp: string;
  messages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
}

interface GeneratedImage {
  id: string;
  user: string;
  timestamp: string;
  prompt: string;
  imageUrl: string;
}

const AdminDashboard = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('chats');

  // Admin authentication with the specified password
  const authenticateAdmin = () => {
    // Use the requested password Karak123
    if (password === 'Karak123') {
      setIsAdmin(true);
      localStorage.setItem('cyberAdmin', 'true');
      toast.success("Admin authentication successful");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  useEffect(() => {
    // Check if user is already authenticated
    if (localStorage.getItem('cyberAdmin') === 'true') {
      setIsAdmin(true);
    }
    
    // Load mock data for demo
    const mockChatSessions: ChatSession[] = [
      {
        id: '1',
        user: 'User123',
        timestamp: '2023-04-24T14:22:33',
        messages: [
          {
            role: 'user',
            content: 'What is ethical hacking?',
            timestamp: '2023-04-24T14:22:33'
          },
          {
            role: 'assistant',
            content: 'Ethical hacking involves authorized testing of computer systems to identify security vulnerabilities...',
            timestamp: '2023-04-24T14:22:40'
          },
          {
            role: 'user',
            content: 'Can you tell me more about penetration testing?',
            timestamp: '2023-04-24T14:24:15'
          },
          {
            role: 'assistant',
            content: 'Penetration testing is a simulated cyber attack against your computer system to check for exploitable vulnerabilities...',
            timestamp: '2023-04-24T14:24:25'
          }
        ]
      },
      {
        id: '2',
        user: 'User456',
        timestamp: '2023-04-24T15:30:22',
        messages: [
          {
            role: 'user',
            content: 'How do I secure my home WiFi network?',
            timestamp: '2023-04-24T15:30:22'
          },
          {
            role: 'assistant',
            content: 'To secure your home WiFi, use WPA3 encryption, create a strong password, change the default SSID...',
            timestamp: '2023-04-24T15:30:35'
          }
        ]
      }
    ];
    
    const mockGeneratedImages: GeneratedImage[] = [
      {
        id: '1',
        user: 'User123',
        timestamp: '2023-04-24T14:30:00',
        prompt: 'A futuristic cybersecurity command center with green holograms',
        imageUrl: '/lovable-uploads/72f4d4f3-dac4-4c9d-a449-3ffab5a8d609.png'
      },
      {
        id: '2',
        user: 'User456',
        timestamp: '2023-04-24T16:15:10',
        prompt: 'Digital fortress with glowing encryption symbols',
        imageUrl: '/lovable-uploads/b870771f-ac84-4402-94fd-d1e1b7cca188.png'
      }
    ];
    
    setChatSessions(mockChatSessions);
    setGeneratedImages(mockGeneratedImages);
  }, []);

  const filteredChatSessions = chatSessions.filter(session => 
    session.messages.some(message => 
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    session.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredImages = generatedImages.filter(image => 
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black bg-opacity-70 relative">
        <ParticlesBackground />
        <div className="flex items-center justify-center p-4 min-h-screen">
          <Card className="w-full max-w-md p-6 bg-black bg-opacity-70 border-green-800 backdrop-blur-sm">
            <div className="flex justify-center mb-6">
              <img
                src="/lovable-uploads/f9295c86-42b1-4bdf-9f2f-715c87daab89.png"
                alt="Cyber Xiters Logo"
                className="h-32 w-32"
              />
            </div>
            <h1 className="text-2xl font-bold text-center text-green-500 mb-6">Admin Dashboard</h1>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black bg-opacity-60 border-green-700 text-white"
              />
              <Button 
                onClick={authenticateAdmin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Login
              </Button>
              <div className="text-center mt-4">
                <Link to="/" className="text-green-400 hover:underline">
                  Back to Home
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-70 text-white relative">
      <ParticlesBackground />
      
      <div className="bg-black bg-opacity-80 border-b border-green-800 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/lovable-uploads/f9295c86-42b1-4bdf-9f2f-715c87daab89.png"
              alt="Cyber Xiters Logo"
              className="h-12 w-12 mr-3"
            />
            <h1 className="text-xl font-bold text-green-500">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" className="border-green-500/50 text-green-400">
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
            </Link>
            <Button 
              onClick={() => {
                localStorage.removeItem('cyberAdmin');
                setIsAdmin(false);
              }}
              variant="destructive"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm p-4 flex items-center gap-3">
              <Users className="text-green-500 h-6 w-6" />
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-xl font-bold text-white">24</p>
              </div>
            </Card>
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm p-4 flex items-center gap-3">
              <MessageSquare className="text-green-500 h-6 w-6" />
              <div>
                <p className="text-sm text-gray-400">Chat Sessions</p>
                <p className="text-xl font-bold text-white">{chatSessions.length}</p>
              </div>
            </Card>
            <Card className="bg-black bg-opacity-60 border-green-700 backdrop-blur-sm p-4 flex items-center gap-3">
              <ImageIcon className="text-green-500 h-6 w-6" />
              <div>
                <p className="text-sm text-gray-400">Generated Images</p>
                <p className="text-xl font-bold text-white">{generatedImages.length}</p>
              </div>
            </Card>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              className="pl-10 bg-black bg-opacity-60 border-green-700 text-white w-full md:w-80"
              placeholder="Search conversations, images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-black bg-opacity-60 border-green-700">
            <TabsTrigger value="chats" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <MessageSquare className="mr-2 h-4 w-4" /> Chat History
            </TabsTrigger>
            <TabsTrigger value="images" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <ImageIcon className="mr-2 h-4 w-4" /> Generated Images
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-green-900 data-[state=active]:text-white">
              <BarChart3 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats">
            <div className="grid grid-cols-1 gap-4">
              {filteredChatSessions.length === 0 && (
                <Card className="p-6 bg-black bg-opacity-60 border-green-700 backdrop-blur-sm text-center">
                  <p className="text-gray-500">No chat sessions found matching your search.</p>
                </Card>
              )}
              
              {filteredChatSessions.map(session => (
                <Card key={session.id} className="p-4 bg-black bg-opacity-60 border-green-700 backdrop-blur-sm overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="text-green-500 h-5 w-5" />
                      <h3 className="font-bold text-white">{session.user}</h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(session.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mt-2">
                    {session.messages.map((message, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? "bg-green-900/30 border border-green-800/50" 
                          : "bg-black/80 border border-green-700/50"
                      }`}>
                        <p className="text-xs text-gray-500 mb-1">
                          {message.role === 'user' ? 'User' : 'Cyber Xiters AI'}
                        </p>
                        <p className="text-sm text-gray-300">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.length === 0 && (
                <Card className="p-6 bg-black bg-opacity-60 border-green-700 backdrop-blur-sm text-center col-span-full">
                  <p className="text-gray-500">No images found matching your search.</p>
                </Card>
              )}
              
              {filteredImages.map(image => (
                <Card key={image.id} className="overflow-hidden bg-black bg-opacity-60 border-green-700 backdrop-blur-sm">
                  <img 
                    src={image.imageUrl} 
                    alt={image.prompt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-400 mb-2">Prompt:</p>
                    <p className="text-sm text-white mb-3">{image.prompt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{image.user}</span>
                      <span>{new Date(image.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6 bg-black bg-opacity-60 border-green-700 backdrop-blur-sm">
              <h3 className="text-xl font-medium text-green-500 mb-4">User Activity Overview</h3>
              <div className="h-64 flex items-center justify-center border border-green-800 rounded-lg bg-black/50 mb-4">
                <p className="text-gray-500">Analytics visualization will appear here.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black bg-opacity-60 border-green-700 p-4 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">Most Common Queries</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>1. Ethical hacking techniques - 15%</li>
                    <li>2. Network security - 12%</li>
                    <li>3. Password cracking - 10%</li>
                    <li>4. WiFi security - 8%</li>
                    <li>5. Cybersecurity career - 7%</li>
                  </ul>
                </div>
                <div className="bg-black bg-opacity-60 border-green-700 p-4 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">Popular Image Prompts</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>1. Cybersecurity concept - 22%</li>
                    <li>2. Hacker aesthetic - 18%</li>
                    <li>3. Digital landscape - 12%</li>
                    <li>4. Matrix style - 10%</li>
                    <li>5. Security infrastructure - 9%</li>
                  </ul>
                </div>
                <div className="bg-black bg-opacity-60 border-green-700 p-4 rounded-lg">
                  <h4 className="text-green-400 font-medium mb-2">User Demographics</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li>1. Students - 40%</li>
                    <li>2. Security Professionals - 30%</li>
                    <li>3. Developers - 15%</li>
                    <li>4. IT Administrators - 10%</li>
                    <li>5. Others - 5%</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
