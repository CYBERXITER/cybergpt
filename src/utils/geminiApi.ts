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

// Global message history object with full conversation history
const chatHistories: Record<string, ChatMessage[]> = {};
const previousResponses: Record<string, string> = {};

export const generateGeminiResponse = async (prompt: string, imageBase64?: string, sessionId?: string, responseFormat?: 'normal' | 'concise' | 'bullets' | 'numbered'): Promise<string> => {
  // Initialize chat history for this session if it doesn't exist
  if (sessionId && !chatHistories[sessionId]) {
    chatHistories[sessionId] = [];
  }
  
  // Special handling for numbered format requests
  if (responseFormat === 'numbered' && sessionId && previousResponses[sessionId]) {
    const previousText = previousResponses[sessionId];
    const lines = previousText.split('\n').filter(line => line.trim().length > 0);
    
    // Format as numbered list
    const numberedResponse = lines.map((line, index) => `${index + 1}. ${line.replace(/^[•*-]\s*/, '')}`).join('\n\n');
    return numberedResponse;
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
    } else if (responseFormat === 'numbered') {
      formatInstruction = "Format your entire response as a numbered list with clear points.";
    }
    
    // Special instruction for gaming-related questions
    const gamingInstruction = isGamingQuestion ? 
      "You are a gaming expert specializing in game mechanics, programming, and educational analysis. When asked about games like Free Fire, analyze them from a technical, educational perspective focusing on concepts like client-server architecture, rendering techniques, physics engines, input handling, and network programming. Include programming examples for EDUCATIONAL PURPOSES ONLY to illustrate how games work internally. Never promote cheating but explain the technical aspects as a learning opportunity." : "";
    
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
    
    // Store this response for potential formatting later
    if (sessionId) {
      previousResponses[sessionId] = responseText;
    }
    
    // Update chat history
    if (sessionId) {
      chatHistories[sessionId].push(userMessage);
      chatHistories[sessionId].push({
        role: "model",
        parts: [{ text: responseText }]
      });
      
      // Keep history to a reasonable size
      if (chatHistories[sessionId].length > 20) {
        chatHistories[sessionId] = chatHistories[sessionId].slice(-20);
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
  if (previousResponses[sessionId]) {
    delete previousResponses[sessionId];
  }
};

// Enhanced fallback response generator when API key is missing or invalid
const generateFallbackResponse = (prompt: string, imageBase64?: string, isGamingQuestion?: boolean): string => {
  const promptLower = prompt.toLowerCase();
  
  // For gaming-related queries
  if (isGamingQuestion) {
    // For Free Fire or other game queries that mention cheats/hacks but provide educational content only
    if (promptLower.includes("free fire") || 
        promptLower.includes("freefire") || 
        promptLower.includes("pubg") ||
        promptLower.includes("fortnite")) {
      
      // If asking specifically about cheats or hacks, provide educational programming content
      if (promptLower.includes("cheat") || 
          promptLower.includes("hack") || 
          promptLower.includes("mod") || 
          promptLower.includes("script")) {
        
        return `# Game Programming & Technical Analysis (Educational)

## Understanding Game Architecture

Mobile battle royale games like Free Fire use sophisticated client-server architecture. Here's how they work from a technical perspective:

\`\`\`cpp
// Client-side game loop (simplified educational example)
class GameEngine {
private:
    float deltaTime;
    PlayerController* localPlayer;
    vector<RemotePlayer> remotePlayers;
    PhysicsSystem physicsSystem;
    RenderSystem renderSystem;
    NetworkSystem networkSystem;
    
public:
    void Update() {
        // Calculate delta time between frames
        deltaTime = CalculateDeltaTime();
        
        // Process user input
        InputData input = inputSystem.GetCurrentInput();
        localPlayer->ProcessInput(input, deltaTime);
        
        // Predict movement locally for responsive feel
        localPlayer->PredictMovement(deltaTime);
        
        // Send player state to server for validation
        networkSystem.SendPlayerState(localPlayer->GetState());
        
        // Receive updates from server about other players
        ServerUpdate serverUpdate = networkSystem.ReceiveServerUpdate();
        UpdateGameState(serverUpdate);
        
        // Run physics simulation
        physicsSystem.Simulate(deltaTime);
        
        // Render the current frame
        renderSystem.Render();
    }
};
\`\`\`

## Server-Side Validation System

Game servers constantly validate player actions to ensure fair play:

\`\`\`java
// Server-side validation (educational example)
public class ServerAuthority {
    public boolean validatePlayerMovement(Player player, Vector3 newPosition, float timestamp) {
        // Calculate maximum possible distance player could have moved
        float timeDelta = timestamp - player.getLastUpdateTime();
        float maxDistance = player.getMovementSpeed() * timeDelta * 1.2f; // 20% buffer for network lag
        
        // Check if player moved too far (impossible movement)
        if (Vector3.distance(player.getPosition(), newPosition) > maxDistance) {
            logSuspiciousActivity(player.getId(), "Impossible movement detected");
            return false; // Reject the movement
        }
        
        // Check for collision with terrain/objects
        if (worldMap.hasCollision(player.getPosition(), newPosition)) {
            logSuspiciousActivity(player.getId(), "Collision bypassing detected");
            return false; // Reject the movement
        }
        
        return true; // Movement is valid
    }
}
\`\`\`

## Technical Concepts Used in Battle Royale Games

1. **Client-Side Prediction & Server Reconciliation**
   - Games use local prediction for responsive controls
   - Server has final authority on all game states
   - Implemented through complex networking protocols

2. **Anti-Cheat Systems**
   - Runtime memory scanning
   - Code signature detection
   - Statistical anomaly detection
   - Hardware/device fingerprinting

3. **Rendering Pipeline Optimization**
   ```
   // Pseudo-code for optimized mobile rendering
   function renderFrame() {
     // Frustum culling to only render visible objects
     visibleObjects = performFrustumCulling(allWorldObjects);
     
     // Level-of-detail management
     for (object of visibleObjects) {
       distance = calculateDistanceToCamera(object);
       lodLevel = determineLODLevel(distance);
       renderWithLOD(object, lodLevel);
     }
     
     // Optimize shader complexity based on device
     applyShaders(deviceCapabilityLevel);
   }
   ```

This is purely educational content intended to help understand game programming concepts. Using or developing actual cheats violates game terms of service and damages the gaming experience for others.`;
      }
      
      // For general game questions without mentioning cheats/hacks
      return `# ${promptLower.includes("free fire") ? "Free Fire" : "Battle Royale"} Game Technical Analysis

## Core Game Programming Concepts

1. **Client-Server Architecture**

\`\`\`typescript
// Educational example of client-server architecture
interface GameState {
  players: Player[];
  worldObjects: WorldObject[];
  timestamp: number;
}

class NetworkManager {
  private serverUpdateRate = 10; // Updates per second
  private interpolationDelay = 100; // ms
  private serverStates: GameState[] = [];
  
  // Receive state updates from server
  public receiveServerUpdate(state: GameState): void {
    this.serverStates.push(state);
    // Keep only necessary history for interpolation
    while (this.serverStates.length > this.serverUpdateRate) {
      this.serverStates.shift();
    }
  }
  
  // Interpolate between server states for smooth rendering
  public getInterpolatedState(): GameState {
    if (this.serverStates.length < 2) return this.serverStates[0];
    
    const now = Date.now() - this.interpolationDelay;
    
    // Find the two states to interpolate between
    let i = 0;
    for (; i < this.serverStates.length; i++) {
      if (this.serverStates[i].timestamp >= now) break;
    }
    
    if (i === 0) return this.serverStates[0];
    if (i >= this.serverStates.length) return this.serverStates[this.serverStates.length - 1];
    
    // Calculate interpolation factor
    const before = this.serverStates[i-1];
    const after = this.serverStates[i];
    const factor = (now - before.timestamp) / (after.timestamp - before.timestamp);
    
    // Return interpolated state
    return this.interpolate(before, after, factor);
  }
  
  private interpolate(before: GameState, after: GameState, factor: number): GameState {
    // Implement interpolation logic for smooth transitions
    // This is simplified pseudo-code
    return {
      players: before.players.map((player, index) => ({
        ...player,
        position: {
          x: player.position.x + (after.players[index].position.x - player.position.x) * factor,
          y: player.position.y + (after.players[index].position.y - player.position.y) * factor,
          z: player.position.z + (after.players[index].position.z - player.position.z) * factor
        }
      })),
      worldObjects: before.worldObjects,
      timestamp: before.timestamp + (after.timestamp - before.timestamp) * factor
    };
  }
}
\`\`\`

2. **Input Handling & Character Movement**

\`\`\`java
// Educational example of player movement system
public class PlayerController {
    private Vector3 position;
    private Vector3 velocity;
    private float moveSpeed = 5.0f;
    private float jumpForce = 10.0f;
    private boolean isGrounded;
    
    public void update(float deltaTime, InputState input) {
        // Handle movement input
        Vector3 moveDirection = new Vector3(
            input.getHorizontalAxis(),
            0,
            input.getVerticalAxis()
        ).normalized();
        
        // Apply movement in look direction
        Quaternion rotation = Camera.main.transform.rotation;
        moveDirection = rotation * moveDirection;
        moveDirection.y = 0; // Keep movement on ground plane
        moveDirection = moveDirection.normalized();
        
        // Apply physics
        if (isGrounded) {
            // Ground movement
            velocity.x = moveDirection.x * moveSpeed;
            velocity.z = moveDirection.z * moveSpeed;
            
            // Jump
            if (input.isJumpPressed()) {
                velocity.y = jumpForce;
                isGrounded = false;
            }
        } else {
            // Air control (reduced)
            velocity.x += moveDirection.x * moveSpeed * 0.1f;
            velocity.z += moveDirection.z * moveSpeed * 0.1f;
            
            // Limit horizontal air velocity
            float horizontalSpeed = new Vector2(velocity.x, velocity.z).magnitude;
            if (horizontalSpeed > moveSpeed) {
                float limitFactor = moveSpeed / horizontalSpeed;
                velocity.x *= limitFactor;
                velocity.z *= limitFactor;
            }
            
            // Apply gravity
            velocity.y -= 9.8f * deltaTime;
        }
        
        // Apply velocity to position
        position += velocity * deltaTime;
        
        // Ground check would happen here
        checkGrounded();
    }
}
\`\`\`

## Graphics Optimization Techniques

Mobile battle royale games use sophisticated techniques to maintain performance:

1. **Dynamic Resolution Scaling**
   - Adjust render resolution based on device performance
   - Prioritize framerate over visual fidelity

2. **Occlusion Culling**
   - Skip rendering objects not visible to the camera
   - Drastically improves performance in complex scenes

3. **LOD (Level of Detail) System**
   ```csharp
   // Educational LOD system example
   class LODSystem {
       private Dictionary<GameObject, LODGroup> lodGroups;
       
       public void UpdateLODs(Camera camera) {
           foreach (var entry in lodGroups) {
               GameObject obj = entry.Key;
               LODGroup lodGroup = entry.Value;
               
               // Calculate distance to camera
               float distanceToCamera = Vector3.Distance(
                   camera.transform.position, 
                   obj.transform.position
               );
               
               // Select appropriate LOD level
               int lodLevel = CalculateLODLevel(distanceToCamera);
               lodGroup.SetActiveLOD(lodLevel);
           }
       }
       
       private int CalculateLODLevel(float distance) {
           // Example thresholds
           if (distance < 50) return 0;      // High detail
           else if (distance < 100) return 1; // Medium detail
           else if (distance < 200) return 2; // Low detail
           else return 3;                    // Very low detail
       }
   }
   ```

Would you like me to explain more detailed game programming concepts or focus on specific areas like player physics, networking, or rendering?`;
    }
    
    // For cybersecurity-related queries 
    if (promptLower.includes("hack") || 
        promptLower.includes("hacking") ||
        promptLower.includes("security") ||
        promptLower.includes("penetration") ||
        promptLower.includes("exploit") ||
        promptLower.includes("wifi")) {
      
      return `# Cybersecurity Educational Framework

## Network Security Analysis (Educational Context)

\`\`\`python
# Network vulnerability scanner conceptual code
import scapy.all as scapy
import socket

def network_scanner(ip_range):
    """Educational example of how vulnerability scanners work"""
    discovered_devices = []
    
    # ARP scan to discover devices
    arp_request = scapy.ARP(pdst=ip_range)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast/arp_request
    
    # Send packets and get responses
    responses = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
    
    # Process each response
    for sent, received in responses:
        device_info = {
            'ip': received.psrc,
            'mac': received.hwsrc,
            'hostname': socket.getfqdn(received.psrc)
        }
        discovered_devices.append(device_info)
    
    return discovered_devices

# Port scanning concept
def port_scanner(target_ip, port_range):
    """Educational demonstration of port scanning concepts"""
    open_ports = []
    
    for port in range(port_range[0], port_range[1] + 1):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((target_ip, port))
        if result == 0:
            service = socket.getservbyport(port) if port < 1024 else "unknown"
            open_ports.append((port, service))
        sock.close()
    
    return open_ports
\`\`\`

This code demonstrates the core concepts behind network scanning tools used by security professionals. Understanding these concepts is essential for:

1. Building robust network defense mechanisms
2. Implementing proper security controls in organizations
3. Developing secure software systems
4. Performing authorized security assessments

Remember that scanning networks requires explicit permission from network owners.`;
    }
    
    // For all other requests, default responses
    const generalResponses = [
      `I've processed your request about '${prompt}'. As your Cyber GPT assistant, I'm here to help with cybersecurity education, content creation, and general AI assistance. What specific aspects would you like to explore further?`,
      
      `That's an interesting query about '${prompt}'. As a cybersecurity and AI assistant, I can provide information on various technical topics, help with content creation, or answer general questions. Could you provide more details about what you're looking to learn?`,
      
      `Thanks for asking about '${prompt}'. I'm Cyber GPT, your AI assistant specializing in cybersecurity, technology, and digital content creation. I'd be happy to provide more specific information if you could elaborate on your question.`,
      
      `I understand you're interested in '${prompt}'. As your Cyber GPT assistant, I can help with cybersecurity concepts, technology questions, content creation, and many other topics. What particular information are you looking for?`
    ];
    
    // Return a random response
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }
};
