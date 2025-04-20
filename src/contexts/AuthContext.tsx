
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';

const supabase = createClient(
  'https://twaonuythxmpmkwhmkae.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3YW9udXl0aHhtcG1rd2hta2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNDY4NjUsImV4cCI6MjA2MDYyMjg2NX0.b-j4CExCnPRM1VE8sWG1SClJP0NxazpdoH6O-PcSXX8'
);

type AuthContextType = {
  user: any;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and set the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting to sign in with Google");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) {
        console.error("Google sign in error:", error);
        toast.error(error.message || 'Failed to sign in with Google');
        return;
      }
      
      console.log("Google sign in success:", data);
    } catch (error: any) {
      console.error("Google sign in exception:", error);
      toast.error(error.message || 'Failed to sign in with Google');
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log("Attempting to sign in with Facebook");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) {
        console.error("Facebook sign in error:", error);
        toast.error(error.message || 'Failed to sign in with Facebook');
        return;
      }
      
      console.log("Facebook sign in success:", data);
    } catch (error: any) {
      console.error("Facebook sign in exception:", error);
      toast.error(error.message || 'Failed to sign in with Facebook');
    }
  };

  const signInWithEmail = async (email: string) => {
    try {
      // Use magic link instead of OTP to avoid the provider not enabled error
      console.log("Attempting to sign in with email:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Force email confirmation
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });
      
      if (error) {
        console.error("Email sign in error:", error);
        toast.error(error.message);
        return;
      }
      
      toast.success('Verification link sent to your email');
      console.log("Verification email sent successfully");
    } catch (error: any) {
      console.error("Email sign in exception:", error);
      toast.error(error.message || 'Failed to send verification email');
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      console.log("Attempting to verify OTP for email:", email);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      
      if (error) {
        console.error("OTP verification error:", error);
        toast.error(error.message);
        return;
      }
      
      toast.success('Email verified successfully');
      console.log("Email verified successfully");
    } catch (error: any) {
      console.error("OTP verification exception:", error);
      toast.error(error.message || 'Failed to verify code');
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error(error.message);
        return;
      }
      console.log("Sign out successful");
    } catch (error: any) {
      console.error("Sign out exception:", error);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithFacebook, signInWithEmail, verifyOTP, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
