
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Facebook, User } from "lucide-react";
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="max-w-md w-full px-6">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to Study Squad</h2>
          <p className="text-gray-600 mt-2">Your AI-powered study companion</p>
        </div>

        {/* Sign in Card */}
        <Card className="p-6 shadow-md border border-gray-200 rounded-xl">
          {!showOTP ? (
            <>
              {/* Google Sign in */}
              <Button
                onClick={signInWithGoogle}
                variant="outline"
                className="w-full justify-center mb-3 border-gray-300 hover:bg-gray-50"
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

              {/* Facebook Sign in */}
              <Button
                onClick={signInWithFacebook}
                variant="outline"
                className="w-full justify-center mb-4 border-gray-300 hover:bg-gray-50"
              >
                <Facebook className="w-5 h-5 mr-2 text-blue-600" />
                Continue with Facebook
              </Button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300"></span>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
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

              <p className="text-center text-xs text-gray-500 mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-violet-100 rounded-full mb-4">
                  <Mail className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-medium">Check your email</h3>
                <p className="text-sm text-gray-600">
                  We've sent a verification link to<br /><span className="font-medium">{email}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Click the link in the email to sign in. If you didn't receive an email, check your spam folder.
                </p>
              </div>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowOTP(false)}
              >
                Back to sign in
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          New to Study Squad? <a href="/login" className="text-violet-600 hover:text-violet-700 font-medium">Create an account</a>
        </p>
      </div>
    </div>
  );
}
