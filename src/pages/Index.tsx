
import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ImageIcon, Video, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StudyBuddyChat from "../components/StudyBuddyChat";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-violet-100 to-white">
      <StudyBuddyChat />
    </div>
  );
};

export default Index;
