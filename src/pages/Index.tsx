
import { useAuth } from "../contexts/AuthContext";
import StudyBuddyChat from "../components/StudyBuddyChat";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-6">You need to sign in to access the Study Squad chat.</p>
        <Button onClick={() => window.location.href = '/login'}>
          Sign In
        </Button>
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

export default Index;
