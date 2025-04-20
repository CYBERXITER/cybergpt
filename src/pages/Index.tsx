
import { useAuth } from "../contexts/AuthContext";
import StudyBuddyChat from "../components/StudyBuddyChat";
import { Button } from "@/components/ui/button";
import { MessageCircle, Search, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="relative w-full h-screen">
        <StudyBuddyChat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-violet-600">Study Squad</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="text-violet-600 border-violet-200 hover:bg-violet-50"
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
            <Button 
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => navigate('/login')}
            >
              Sign up
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-violet-600 mb-6 leading-tight">
              Your AI-powered study companion for better learning
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Get instant answers, analyze documents, and receive personalized study recommendations
            </p>
            <Button 
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg h-auto"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard 
              icon={<MessageCircle className="w-8 h-8 text-violet-600" />}
              title="Interactive Discussions"
              description="Get your questions answered instantly with AI-powered chat assistance"
            />
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-violet-600" />}
              title="Smart Search"
              description="Upload and analyze PDFs, images, and documents for quick insights"
            />
            <FeatureCard 
              icon={<Lightbulb className="w-8 h-8 text-violet-600" />}
              title="Personalized Learning"
              description="Receive tailored study recommendations based on your interests"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="flex flex-col items-center p-8 bg-white rounded-2xl border border-violet-100 shadow-sm hover:shadow-md transition-shadow text-center group cursor-pointer">
    <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 mb-6 group-hover:bg-violet-100 transition-colors">
      {icon}
    </div>
    <h3 className="font-semibold text-xl mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
