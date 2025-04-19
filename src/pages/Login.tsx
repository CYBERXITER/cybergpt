
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Facebook, Search, Lightbulb, Google } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithGoogle, signInWithFacebook, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Study Squad</h1>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/login')}>Sign up</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold">Welcome to Study Squad</h2>
              <p className="text-xl text-gray-600">Your AI-powered study companion for better learning</p>
              
              <div className="space-y-6">
                <FeatureItem 
                  icon={<MessageCircle className="w-6 h-6" />}
                  title="Interactive Discussions"
                  description="Engage in meaningful conversations with our AI tutor"
                />
                <FeatureItem 
                  icon={<Search className="w-6 h-6" />}
                  title="Smart Search"
                  description="Find answers to your questions instantly"
                />
                <FeatureItem 
                  icon={<Lightbulb className="w-6 h-6" />}
                  title="Personalized Learning"
                  description="Get tailored study recommendations and insights"
                />
              </div>
            </div>

            {/* Right Column - Login Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-8 space-y-6 shadow-lg border-gray-200">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Get Started</h3>
                  <p className="text-gray-500">Join Study Squad to enhance your learning journey</p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    className="w-full"
                  >
                    <Google className="w-5 h-5 mr-2" />
                    Continue with Google
                  </Button>

                  <Button
                    onClick={signInWithFacebook}
                    variant="outline"
                    className="w-full"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Continue with Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const FeatureItem = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="flex items-start space-x-4">
    <div className="p-2 bg-blue-50 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
