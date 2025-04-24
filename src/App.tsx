
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import ParticlesBackground from "./components/ParticlesBackground";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import StudyAssistant from "./pages/StudyAssistant";
import ImageGenerator from "./pages/ImageGenerator";
import YoutubeCreator from "./pages/YoutubeCreator";
import CyberAssistant from "./pages/CyberAssistant";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/study-assistant" element={<StudyAssistant />} />
            <Route path="/image-generator" element={<ImageGenerator />} />
            <Route path="/youtube-creator" element={<YoutubeCreator />} />
            <Route path="/cyber-assistant" element={<CyberAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
