
import { useAuth } from "../contexts/AuthContext";
import StudyBuddyChat from "../components/StudyBuddyChat";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle, Search, Lightbulb } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="w-full bg-white border-b border-gray-100 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-violet-600">Study Squad</h1>
            <div className="space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/login'} 
                className="text-violet-600 hover:text-violet-700"
              >
                Log in
              </Button>
              <Button 
                onClick={() => window.location.href = '/login'} 
                className="bg-violet-600 text-white hover:bg-violet-700"
              >
                Sign up
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-4 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-violet-600 mb-4">Welcome to Study Squad</h2>
          <p className="text-xl text-gray-600 mb-8">Your AI-powered study companion for better learning</p>
          
          <div className="grid md:grid-cols-3 gap-6 w-full mb-8">
            <FeatureCard 
              icon={<MessageCircle className="w-8 h-8 text-violet-600" />}
              title="Interactive Discussions"
              description="Get your questions answered instantly"
            />
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-violet-600" />}
              title="Smart Search"
              description="Upload PDFs, images, and documents"
            />
            <FeatureCard 
              icon={<Lightbulb className="w-8 h-8 text-violet-600" />}
              title="Personalized Learning"
              description="Get tailored study recommendations"
            />
          </div>
          
          <Button 
            onClick={() => window.location.href = '/login'} 
            className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-8 text-lg"
          >
            Get Started
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="absolute top-4 right-4 z-10"
        onClick={signOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
      <StudyBuddyChat />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="flex flex-col items-center p-6 bg-violet-50 rounded-xl border border-violet-100 text-center">
    <div className="p-3 bg-white rounded-lg border border-violet-100 mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
