
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, GalleryVertical, FileText, Image as ImageIcon, MessageSquare, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { generateGeminiResponse } from '../utils/geminiApi';
import { fileToBase64 } from '../utils/fileUtils';
import { Link } from 'react-router-dom';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  files?: DisplayFile[];
}
interface DisplayFile {
  name: string;
  type: string;
  url: string;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

const StudyBuddyChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('recent-chats');
    return saved ? JSON.parse(saved) : [{
      id: Date.now().toString(),
      messages: [],
      createdAt: Date.now()
    }];
  });
  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id || '');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('recent-chats', JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
  };

  async function processFiles(files: File[]) {
    const validFiles = files.filter(file =>
      (file.type.startsWith('image/') || file.type === 'application/pdf')
    );
    if (validFiles.length === 0) {
      toast({ title: "Invalid file", description: "Only images and PDFs allowed.", variant: "destructive" });
      return;
    }
    
    // Create URL previews for the files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews]);
    setFileList(prev => [...prev, ...validFiles]);
    toast({ title: "Files ready", description: `${validFiles.length} file(s) added.` });
    
    // Focus the input field after adding files
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const files: File[] = [];
    if (e.clipboardData?.items) {
      for (const item of e.clipboardData.items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
    }
    if (files.length > 0) await processFiles(files);
  };

  const removeFile = (idx: number) => {
    setFileList(prev => prev.filter((_, i) => i !== idx));
    setFilePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && fileList.length === 0) return;

    setIsLoading(true);

    const filesForMsg: DisplayFile[] = await Promise.all(fileList.map(async (file) => {
      const base64 = await fileToBase64(file);
      return {
        name: file.name,
        type: file.type,
        url: base64
      };
    }));

    const newUserMsg: ChatMessage = {
      role: 'user',
      content: input.trim(),
      files: filesForMsg.length > 0 ? filesForMsg : undefined
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, newUserMsg] }
          : s
      )
    );
    setInput('');
    setFileList([]);
    setFilePreviews([]);

    let aiResponse = "";
    try {
      let imageBase64;
      if (filesForMsg.length > 0 && filesForMsg[0].type.startsWith('image/')) {
        imageBase64 = filesForMsg[0].url;
      }
      aiResponse = await generateGeminiResponse(input.trim(), imageBase64);
    } catch {
      aiResponse = "I apologize, there was an error in generating a response.";
    }

    const newAIMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponse
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, newAIMessage] }
          : s
      )
    );
    setIsLoading(false);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      createdAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleSelectChat = (id: string) => {
    setCurrentSessionId(id);
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-b from-violet-100 to-white">
      <aside className="hidden md:flex flex-col w-72 border-r border-violet-100 bg-white/95 backdrop-blur-sm min-h-screen">
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-100">
          <span className="font-bold text-violet-700 text-xl flex gap-2 items-center">
            <GalleryVertical className="w-6 h-6" /> Recent Chats
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="ml-2 rounded-full hover:bg-violet-100 transition-all duration-300"
            onClick={createNewChat}
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/image-generator">
            <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white transition-all duration-300">
              <ImageIcon className="mr-2 h-4 w-4" /> Image Generator
            </Button>
          </Link>
        </div>
        
        <div className="p-3 border-b border-violet-100">
          <Link to="/youtube-creator">
            <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-300">
              <MessageSquare className="mr-2 h-4 w-4" /> YouTube Creator
            </Button>
          </Link>
        </div>
        
        <ul className="flex-1 overflow-y-auto px-2 pt-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <button
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg mb-2 transition-all duration-200 ${
                  s.id === currentSessionId
                    ? "bg-violet-100 font-bold text-violet-800"
                    : "hover:bg-violet-50 text-gray-700"
                }`}
                onClick={() => handleSelectChat(s.id)}
              >
                <GalleryVertical className="w-4 h-4 mr-2" />
                Chat {new Date(s.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 min-h-screen flex flex-col bg-gradient-to-br from-white to-violet-50 justify-between">
        <div className="flex md:hidden items-center justify-between bg-white/95 backdrop-blur-sm border-b border-violet-100 px-3 py-2">
          <span className="text-base font-bold text-violet-700 flex items-center gap-2">
            <GalleryVertical className="w-5 h-5" /> Recent Chats
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
            onClick={createNewChat}
            title="New Chat"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="md:hidden flex overflow-x-auto gap-2 px-3 py-2 border-b border-violet-50 bg-white">
          {sessions.map((s) => (
            <button
              key={s.id}
              className={`px-3 py-1 rounded-full text-xs ${
                s.id === currentSessionId ? "bg-violet-200 font-bold text-violet-800" : "bg-violet-50 hover:bg-violet-100"
              }`}
              onClick={() => handleSelectChat(s.id)}
            >
              {new Date(s.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </button>
          ))}
        </div>

        <div className="md:hidden flex justify-between gap-2 px-3 py-2 border-b border-violet-50 bg-white">
          <Link to="/image-generator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
              <ImageIcon className="mr-1 h-3 w-3" /> Image Gen
            </Button>
          </Link>
          <Link to="/youtube-creator" className="flex-1">
            <Button size="sm" className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs">
              <MessageSquare className="mr-1 h-3 w-3" /> YouTube
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-500 shadow-lg">
          <span className="text-white font-bold text-2xl flex items-center gap-2">
            <GalleryVertical className="w-8 h-8" /> Study Squad Assistant
            <span className="text-xs font-normal opacity-70 ml-1">made by Maheer Khan</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gradient-to-b from-white to-violet-50" onPaste={handlePaste}>
          {currentSession?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-80 text-center animate-fade-in">
              <GalleryVertical className="w-20 h-20 text-violet-400 mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-violet-700 mb-2">Start a New Conversation!</h2>
              <p className="text-gray-600">Ask any study question and upload your files or images for instant AI-powered assistance.</p>
            </div>
          ) : (
            currentSession.messages.map((msg, idx) => (
              <div key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`rounded-2xl p-4 md:p-6 max-w-[80%] shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white' 
                    : 'bg-white border border-violet-100 text-gray-800'
                }`}>
                  <div className="mb-2 whitespace-pre-line">{msg.content}</div>
                  {msg.files && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {msg.files.map(f =>
                        f.type.startsWith('image/') ? (
                          <img key={f.name} src={f.url} alt={f.name} className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition-transform cursor-pointer" />
                        ) : (
                          <div key={f.name} className="flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-100 rounded-lg">
                            <FileText className="w-5 h-5 text-violet-600" />
                            <span className="text-xs">{f.name}</span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-violet-200 p-4 rounded-2xl shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* File Preview Area */}
        {filePreviews.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm border-t border-violet-100 px-4 py-3 flex gap-2 overflow-x-auto">
            {filePreviews.map((preview, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={preview} 
                  alt={`Preview ${idx}`} 
                  className="h-16 w-16 object-cover rounded-lg border border-violet-200 shadow-sm"
                />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white backdrop-blur-sm border-t border-violet-100 px-4 py-5 flex gap-2 items-end sticky bottom-0">
          <Input
            ref={chatInputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onPaste={handlePaste}
            placeholder="Ask anything or paste images…"
            className="flex-1 border-violet-200 focus:border-violet-400 shadow-sm transition-all"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
                aria-label="Upload"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-2">
                <div className="font-medium mb-2">Upload images or PDFs</div>
                <Input multiple type="file" accept="image/*,application/pdf"
                  onChange={handleFileChange} ref={fileInputRef} />
                <div className="flex gap-2 flex-wrap mt-1">
                  {fileList.map((fl, idx) =>
                    <div key={fl.name + idx} className="relative hover:scale-105 transition-transform">
                      {fl.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(fl)} alt={fl.name} className="w-14 h-14 object-cover rounded-lg border" />
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-1 bg-violet-50 rounded-lg border border-violet-100">
                          <FileText className="w-4 h-4 text-violet-700" />
                          <span className="text-xs">{fl.name}</span>
                        </div>
                      )}
                      <button type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                        aria-label="Remove file"
                      >&times;</button>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            disabled={(!input.trim() && fileList.length === 0) || isLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 transition-colors"
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </main>
    </div>
  );
};

export default StudyBuddyChat;
