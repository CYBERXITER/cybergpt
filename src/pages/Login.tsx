
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Mail, Facebook, Search, Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail, verifyOTP, user } = useAuth();
  const navigate = useNavigate();
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  if (user) {
    navigate('/');
    return null;
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 0) {
      signInWithEmail(email);
      setShowOTP(true);
    } else {
      toast.error("Please enter your email");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6 && email) {
      verifyOTP(email, otp);
    } else {
      toast.error("Please enter the complete verification code");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white border-b border-gray-100 p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-violet-600">Study Squad</h1>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Log in</Button>
            <Button onClick={() => navigate('/login')} className="bg-violet-600 text-white hover:bg-violet-700">Sign up</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Features */}
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-violet-600">Welcome to Study Squad</h2>
              <p className="text-xl text-gray-600">Your AI-powered study companion for better learning</p>
              
              <div className="space-y-6">
                <FeatureItem 
                  icon={<MessageCircle className="w-6 h-6 text-violet-600" />}
                  title="Interactive Discussions"
                  description="Engage in meaningful conversations with our AI tutor and get your questions answered instantly"
                />
                <FeatureItem 
                  icon={<Search className="w-6 h-6 text-violet-600" />}
                  title="Smart Search"
                  description="Upload PDFs, images, and documents to get information extracted and analyzed"
                />
                <FeatureItem 
                  icon={<Lightbulb className="w-6 h-6 text-violet-600" />}
                  title="Personalized Learning"
                  description="Get tailored study recommendations and insights based on your learning style"
                />
              </div>

              <div className="bg-violet-50 p-6 rounded-xl border border-violet-100">
                <h3 className="font-bold text-lg text-violet-800 mb-2">What our users say</h3>
                <div className="italic text-gray-700">
                  "Study Squad helped me improve my grades by 30% within just one semester. The personalized explanations make complex topics so much easier to understand!" 
                  <p className="font-medium mt-2 text-violet-700">— Sarah K., College Student</p>
                </div>
              </div>
            </div>

            {/* Right Column - Login Card */}
            <div className="flex justify-center">
              <Card className="w-full max-w-md p-8 space-y-6 shadow-lg border-gray-200">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">Get Started</h3>
                  <p className="text-gray-500">Join Study Squad to enhance your learning journey</p>
                </div>

                {!showOTP ? (
                  <>
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Enter your email" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-violet-600 hover:bg-violet-700"
                      >
                        Continue with Email
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 text-center">
                      <Label htmlFor="otp" className="text-base">Enter verification code</Label>
                      <p className="text-sm text-gray-500">We've sent a code to {email}</p>
                    </div>
                    <div className="flex justify-center py-4">
                      <InputOTP 
                        maxLength={6} 
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button 
                      className="w-full bg-violet-600 hover:bg-violet-700"
                      onClick={handleVerifyOTP}
                    >
                      Verify
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setShowOTP(false)}>
                      Back to login
                    </Button>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    className="w-full"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      <path d="M1 1h22v22H1z" fill="none"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    onClick={signInWithFacebook}
                    variant="outline"
                    className="w-full"
                  >
                    <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                    Continue with Facebook
                  </Button>
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
    <div className="p-2 bg-violet-50 rounded-lg border border-violet-100">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
