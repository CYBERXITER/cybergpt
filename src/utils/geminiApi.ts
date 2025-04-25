
// Gemini API key for AI responses
const GEMINI_API_KEY = 'AIzaSyAbusD7o1GyvznMuNC3bQUBytMnlMJodxQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Storage for message history
type ChatMessage = {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
}

// Global message history object
const chatHistories: Record<string, ChatMessage[]> = {};

export const generateGeminiResponse = async (prompt: string, imageBase64?: string, sessionId?: string, responseFormat?: 'normal' | 'concise' | 'bullets'): Promise<string> => {
  // Initialize chat history for this session if it doesn't exist
  if (sessionId && !chatHistories[sessionId]) {
    chatHistories[sessionId] = [];
  }
  
  // Check for ownership questions only
  if (prompt.toLowerCase().includes("who is your owner") || 
      prompt.toLowerCase().includes("who made you") || 
      prompt.toLowerCase().includes("who created you") ||
      prompt.toLowerCase().includes("who built you") ||
      prompt.toLowerCase().includes("who developed you") ||
      prompt.toLowerCase().includes("who established you") ||
      prompt.toLowerCase().includes("who trained you")) {
    return "I am developed by the Team of Cyber Xiters.";
  }

  // Gaming-related keywords to detect gaming questions
  const gamingKeywords = [
    "freefire", "free fire", "pubg", "fortnite", "cod", "call of duty", "valorant", "apex legends", 
    "minecraft", "roblox", "game", "gaming", "cheats", "hacks", "aim", "headshot", "battle royale",
    "gta", "grand theft auto", "mods", "gameplay", "diamond", "coins", "uc", "battle pass", "skin"
  ];
  
  // Check if this is a gaming-related question
  const isGamingQuestion = gamingKeywords.some(keyword => 
    prompt.toLowerCase().includes(keyword)
  );

  try {
    // Check if we have a valid API key
    if (!GEMINI_API_KEY) {
      console.log("No valid API key provided, using fallback response");
      return generateFallbackResponse(prompt, imageBase64, isGamingQuestion);
    }

    // Get message history for this session
    const messageHistory = sessionId ? chatHistories[sessionId] : [];
    
    // Determine response format instruction
    let formatInstruction = "";
    if (responseFormat === 'concise') {
      formatInstruction = "Be very brief and concise in your response. Use short sentences and minimal explanations.";
    } else if (responseFormat === 'bullets') {
      formatInstruction = "Format your entire response as a bulleted list with short points.";
    }
    
    // Special instruction for gaming-related questions
    const gamingInstruction = isGamingQuestion ? 
      "You are a gaming expert specializing in game strategies and educational tips. Provide helpful information about game mechanics, strategies, and improvement techniques. Focus on legitimate gameplay skills and avoid discussing cheats, hacks or exploits. Provide educational information only. When asked about game modifications or cheats, explain why fair play is important for the community." : "";
    
    // Create user message with all relevant instructions
    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: `${formatInstruction ? formatInstruction + "\n\n" : ""}${gamingInstruction ? gamingInstruction + "\n\n" : ""}${prompt}` }]
    };

    // Add image if provided
    if (imageBase64) {
      userMessage.parts.push({
        text: "[Image content for context]"
      });
    }

    const requestBody: any = {
      contents: [userMessage]
    };

    // Add past messages to provide context if they exist
    if (messageHistory.length > 0) {
      requestBody.contents = [...messageHistory, userMessage];
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return generateFallbackResponse(prompt, imageBase64, isGamingQuestion);
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      console.log("Empty response from Gemini API, using fallback");
      return generateFallbackResponse(prompt, imageBase64, isGamingQuestion);
    }
    
    // Update chat history
    if (sessionId) {
      chatHistories[sessionId].push(userMessage);
      chatHistories[sessionId].push({
        role: "model",
        parts: [{ text: responseText }]
      });
      
      // Keep history to a reasonable size
      if (chatHistories[sessionId].length > 10) {
        chatHistories[sessionId] = chatHistories[sessionId].slice(-10);
      }
    }
    
    return responseText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return generateFallbackResponse(prompt, imageBase64, isGamingQuestion);
  }
};

// Clear chat history for a session
export const clearChatHistory = (sessionId: string) => {
  if (chatHistories[sessionId]) {
    delete chatHistories[sessionId];
  }
};

// Enhanced fallback response generator when API key is missing or invalid
const generateFallbackResponse = (prompt: string, imageBase64?: string, isGamingQuestion?: boolean): string => {
  const promptLower = prompt.toLowerCase();
  
  // For gaming-related queries
  if (isGamingQuestion) {
    const gamingResponses = [
      "As a gaming expert, I can provide tips to improve your gameplay through legitimate practice. For Free Fire and similar battle royale games, spend time in training mode to master weapon recoil control, practice quick movement techniques, and learn map hotspots. The best players focus on positioning, game awareness, and team communication rather than shortcuts. Would you like specific legitimate strategies for a particular aspect of gameplay?",
      
      "Gaming success comes from consistent practice and strategy development. In competitive shooters like Free Fire, work on your reflexes through aim training exercises, optimize your device settings for better performance, and study professional gameplay videos. Remember that fair play creates a better experience for everyone in the community. Is there a specific skill you're looking to improve?",
      
      "To improve at battle royale games, focus on these legitimate strategies: smart dropping locations based on flight path, efficient looting patterns, positioning within the safe zone, and tactical team coordination. Regular practice with different weapons improves versatility. Would you like tips for a specific gaming situation or mechanic?",
      
      "Many players look for shortcuts, but true gaming mastery comes through practice and skill development. For shooter games like Free Fire, I recommend training your aim precision, learning recoil patterns, mastering movement techniques, and developing game sense through consistent gameplay. What aspect of your gameplay would you like to improve through legitimate practice?"
    ];
    
    // Return a random response from the array
    return gamingResponses[Math.floor(Math.random() * gamingResponses.length)];
  }
  
  // For ethical hacking-related queries
  if (promptLower.includes("hack") || 
      promptLower.includes("hacking") ||
      promptLower.includes("security") ||
      promptLower.includes("penetration") ||
      promptLower.includes("exploit") ||
      promptLower.includes("wifi")) {
    
    // Educational responses for cybersecurity topics
    const hackingResponses = [
      "As a cybersecurity assistant, I can provide information about ethical hacking and security concepts for educational purposes. Ethical hacking involves authorized testing of systems to find vulnerabilities before malicious actors can exploit them. Popular learning platforms include TryHackMe, HackTheBox, and PentesterLab. Would you like to learn about specific security techniques, tools like Wireshark or Metasploit, or general security concepts? Remember that practicing security testing should only be done on systems you own or have explicit permission to test.",
      
      "In cybersecurity education, WiFi security is an important topic. Security researchers use tools like Aircrack-ng to test wireless networks they own for vulnerabilities. WPA3 provides stronger encryption than older protocols. To protect your network, use strong passwords, keep firmware updated, enable WPA3 if available, disable WPS, and consider MAC address filtering. Would you like to learn more about specific wireless security concepts?",
      
      "Cybersecurity professionals use various methodologies like OWASP for web applications or PTES (Penetration Testing Execution Standard) for network testing. These structured approaches help identify vulnerabilities in systems that organizations can then address before malicious actors exploit them. Ethical hackers always operate with explicit permission and within legal boundaries. What specific security methodology interests you?",
      
      "Security professionals use various tools like Nmap for network discovery, Burp Suite for web application testing, and Metasploit for vulnerability validation. Learning these tools in controlled environments like home labs or platforms such as TryHackMe can help develop practical cybersecurity skills. Remember that using these tools on systems without permission is illegal. Would you like to know more about security certifications like CEH or OSCP?"
    ];
    
    // Return a random response from the array
    return hackingResponses[Math.floor(Math.random() * hackingResponses.length)];
  }
  
  // Check for dog-related queries with image
  if (imageBase64 && (promptLower.includes("dog") || promptLower.includes("puppy"))) {
    return "I can see an adorable dog in the image. It appears to be a friendly canine with a beautiful coat. Dogs make wonderful companions and are known for their loyalty and affection.";
  }
  
  // Check for person-related queries with image
  if (imageBase64) {
    return "I can see the image you've shared. If you have specific questions about it or what you'd like me to analyze, please let me know, and I'll do my best to assist you.";
  }
  
  // For general AI queries
  if (promptLower.includes("ai") || 
      promptLower.includes("artificial intelligence") || 
      promptLower.includes("machine learning") ||
      promptLower.includes("neural network")) {
    return `Artificial Intelligence has been advancing rapidly in recent years. Modern AI systems use various techniques including deep learning, natural language processing, and computer vision to solve complex problems. These technologies power applications like image recognition, language translation, and recommendation systems. The field continues to evolve with new research in areas like reinforcement learning and generative models. What specific aspect of AI interests you the most?`;
  }
  
  // For cybersecurity queries
  if (promptLower.includes("cyber") || 
      promptLower.includes("security") || 
      promptLower.includes("firewall") ||
      promptLower.includes("malware") ||
      promptLower.includes("virus")) {
    return `Cybersecurity is essential in our digital world. Key practices include using strong unique passwords, enabling multi-factor authentication, keeping software updated, being cautious with email attachments, using firewalls and antivirus software, encrypting sensitive data, and regularly backing up important information. Organizations should also implement security awareness training, access controls, and incident response plans. Is there a specific cybersecurity topic you'd like to explore further?`;
  }
  
  // For YouTube script requests
  if (promptLower.includes("youtube") || 
      promptLower.includes("script") || 
      promptLower.includes("video") ||
      promptLower.includes("story")) {
    return `Scene 1: A curious viewer clicks on your video, drawn in by your engaging thumbnail and title that promises valuable information about ${prompt}.

Scene 2: You appear on screen with a warm greeting, quickly establishing your credibility on the topic and hinting at the key points you'll cover.

Scene 3: The first major point is presented with simple visuals, keeping the viewer engaged with clear explanations and relatable examples.

Scene 4: A surprising fact or statistic appears, creating a moment of intrigue that makes the viewer want to keep watching to learn more.

Scene 5: You address a common misconception about the topic, clearing up confusion and providing accurate information that truly helps the viewer.

Scene 6: A brief summary reinforces the main points, with a call to action encouraging viewers to like, comment, and subscribe for more content.

Scene 7: The video ends with a teaser for your next related video, creating anticipation and encouraging channel engagement.`;
  }
  
  // For story creation requests
  if ((promptLower.includes("create") && promptLower.includes("story")) || 
      promptLower.includes("tell me a story") || 
      promptLower.includes("write a story")) {
    return `Scene 1: A young hacker named Max discovers a mysterious digital artifact glowing with an eerie green light on an abandoned server.

Scene 2: When Max examines the artifact's code, strange symbols appear on his screen and suddenly he can see vulnerabilities in any system he looks at.

Scene 3: At hackathon, the artifact gives Max the ability to solve complex security problems, but he notices someone watching him with growing suspicion.

Scene 4: Max discovers that using the artifact on Tuesdays makes his code undetectable, and on Thursdays, it can predict security breaches before they happen.

Scene 5: After using the artifact to win a major competition, Max feels guilty and confesses to his mentor about his unfair advantage.

Scene 6: The mentor reveals that the artifact was planted as a test - the true skill wasn't in the artifact but in Max's ability to recognize the ethical implications.

Scene 7: Max still keeps the artifact as a reminder, but now uses his talents to teach others about ethical hacking and cybersecurity.`;
  }
  
  // More varied responses for general questions
  const generalResponses = [
    `I've processed your request about '${prompt}'. As your Cyber GPT assistant, I'm here to help with cybersecurity education, content creation, and general AI assistance. What specific aspects would you like to explore further?`,
    
    `That's an interesting query about '${prompt}'. As a cybersecurity and AI assistant, I can provide information on various technical topics, help with content creation, or answer general questions. Could you provide more details about what you're looking to learn?`,
    
    `Thanks for asking about '${prompt}'. I'm Cyber GPT, your AI assistant specializing in cybersecurity, technology, and digital content creation. I'd be happy to provide more specific information if you could elaborate on your question.`,
    
    `I understand you're interested in '${prompt}'. As your Cyber GPT assistant, I can help with cybersecurity concepts, technology questions, content creation, and many other topics. What particular information are you looking for?`
  ];
  
  // Return a random response from the array to add variety
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};
