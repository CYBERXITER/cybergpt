
import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Common educational responses to simulate an AI assistant
const educationalResponses = {
  math: [
    "To solve this math problem, you'll need to apply the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a.",
    "When working with fractions, remember to find the common denominator first.",
    "For geometry problems, try drawing the figure and labeling all the known values.",
    "To simplify this expression, you can factor out the common terms.",
    "When solving systems of equations, you can use substitution or elimination methods.",
  ],
  english: [
    "When writing an essay, make sure your thesis statement clearly presents your main argument.",
    "To analyze literature, pay attention to themes, characters, setting, and literary devices.",
    "For grammar questions, remember that subject and verb must agree in number (singular/plural).",
    "When proofreading, read your text backward to catch spelling errors more easily.",
    "A strong conclusion should restate your thesis and provide a sense of closure.",
  ],
  science: [
    "The scientific method includes: observation, question, hypothesis, experiment, analysis, and conclusion.",
    "In chemistry, remember that the periodic table organizes elements by their atomic number.",
    "For biology questions, think about how structure relates to function in living organisms.",
    "In physics, remember that F = ma (Force equals mass times acceleration).",
    "When balancing chemical equations, ensure the number of atoms of each element is the same on both sides.",
  ],
  history: [
    "When analyzing historical events, consider the political, economic, social, and technological factors.",
    "Primary sources are created during the time period you're studying, while secondary sources are created later.",
    "Creating a timeline can help you understand the sequence and relationship between historical events.",
    "Compare and contrast different historical perspectives to develop a more nuanced understanding.",
    "Look for cause and effect relationships to understand why historical events occurred.",
  ],
  general: [
    "Breaking down complex problems into smaller parts can make them easier to solve.",
    "Try explaining the concept in your own words to check your understanding.",
    "Creating flashcards can be an effective way to memorize important information.",
    "Don't forget to take breaks while studying - research shows it improves retention!",
    "If you're stuck, try approaching the problem from a different angle.",
  ]
};

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

  const generateResponse = (question: string) => {
    // Convert the question to lowercase for easier keyword matching
    const lowerQuestion = question.toLowerCase();
    
    // Determine the subject based on keywords in the question
    let subject = 'general';
    
    if (lowerQuestion.includes('math') || lowerQuestion.includes('equation') || 
        lowerQuestion.includes('calculate') || lowerQuestion.includes('formula') ||
        lowerQuestion.includes('algebra') || lowerQuestion.includes('geometry')) {
      subject = 'math';
    } else if (lowerQuestion.includes('english') || lowerQuestion.includes('essay') || 
               lowerQuestion.includes('grammar') || lowerQuestion.includes('writing') ||
               lowerQuestion.includes('literature') || lowerQuestion.includes('poem')) {
      subject = 'english';
    } else if (lowerQuestion.includes('science') || lowerQuestion.includes('biology') || 
               lowerQuestion.includes('chemistry') || lowerQuestion.includes('physics') ||
               lowerQuestion.includes('experiment') || lowerQuestion.includes('lab')) {
      subject = 'science';
    } else if (lowerQuestion.includes('history') || lowerQuestion.includes('war') || 
               lowerQuestion.includes('century') || lowerQuestion.includes('civilization') ||
               lowerQuestion.includes('revolution') || lowerQuestion.includes('ancient')) {
      subject = 'history';
    }
    
    // Get responses for the detected subject
    const subjectResponses = educationalResponses[subject] || educationalResponses.general;
    
    // Generate a specific response based on the question
    if (lowerQuestion.includes('help') || lowerQuestion.includes('how are you')) {
      return "I'm your Study Buddy AI! I can help with homework in math, science, English, history, and more. What subject are you working on?";
    } else if (lowerQuestion.includes('thank')) {
      return "You're welcome! Feel free to ask if you have more questions. Good luck with your studies!";
    } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi ')) {
      return "Hello there! I'm your Study Buddy AI. What homework can I help you with today?";
    } else if (lowerQuestion.includes('bye') || lowerQuestion.includes('goodbye')) {
      return "Goodbye! Good luck with your studies. Come back anytime you need help!";
    } else {
      // Return a random response from the appropriate subject
      return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response generation with slight delay for realism
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Study Buddy AI Assistant</h1>
          </div>
          <p className="text-center text-purple-100">Your 24/7 homework helper and study companion</p>
        </div>

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">👋 Hi there! Need help with your homework?</p>
              <p className="mt-2">Ask me anything about your studies!</p>
              <div className="mt-6 text-sm text-gray-400 max-w-md mx-auto">
                <p>Try asking questions like:</p>
                <ul className="mt-2 space-y-1 text-left px-8 list-disc">
                  <li>"Can you help me with this math problem?"</li>
                  <li>"How do I write a good thesis statement?"</li>
                  <li>"Explain the scientific method"</li>
                  <li>"What were the main causes of World War II?"</li>
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
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question here..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudyBuddyChat;
