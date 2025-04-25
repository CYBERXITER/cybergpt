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
  
  // Special handling for numbered format requests - return previous response in numbered format
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
      "You are a gaming expert specializing in game strategies and educational tips. First provide a detailed analysis of game mechanics, strategies, and programming techniques. When asked about game modifications, cheats or hacks, provide educational code examples and explain how they work from a technical perspective ONLY FOR EDUCATIONAL PURPOSES. Format any code in proper markdown with syntax highlighting." : "";
    
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
    if (promptLower.includes("hack") || 
        promptLower.includes("cheat") || 
        promptLower.includes("mod") || 
        promptLower.includes("script")) {
      
      return `# Game Programming Educational Guide

## Understanding Game Mechanics

Games like Free Fire use client-server architecture where:

\`\`\`cpp
// Client-side prediction (simplified)
class PlayerMovement {
private:
    Vector3 position;
    float speed = 5.0f;
    
public:
    void Update(float deltaTime) {
        // Local prediction
        Vector3 input = GetUserInput();
        Vector3 newPosition = position + input * speed * deltaTime;
        
        // Update local position
        position = newPosition;
        
        // Send to server for validation
        SendToServer(newPosition);
    }
};
\`\`\`

Game developers implement strict validation to prevent unauthorized modifications:

\`\`\`cpp
// Server-side validation (conceptual)
bool ValidatePlayerPosition(Player* player, Vector3 reportedPosition) {
    // Calculate maximum possible movement distance
    float maxDistance = player->GetSpeed() * timeSinceLastUpdate * 1.2f; // 20% buffer for network lag
    
    // Check if movement is physically possible
    if (Vector3::Distance(player->GetLastValidPosition(), reportedPosition) > maxDistance) {
        LogPossibleCheat(player);
        return false;
    }
    
    return true;
}
\`\`\`

## Educational Analysis

Understanding game security helps developers create better anti-cheat systems. Studying these concepts is valuable for:

1. Game development education
2. Cybersecurity training
3. Software architecture understanding
4. Network programming knowledge

I encourage legitimate gameplay and following the game's terms of service.`;
    }
    
    const gamingResponses = [
      `# Free Fire Game Strategy Guide

## Core Mechanics for Improvement

1. **Recoil Control Training**
   ```
   // Conceptual training algorithm
   for (int day = 1; day <= 30; day++) {
       // Practice 15 minutes daily
       practiceRecoilPattern("M4A1");
       practiceRecoilPattern("AK47");
       practiceRecoilPattern("SCAR");
       
       // Review and adjust
       analyzePatternsAndAdjustSettings();
   }
   ```

2. **Map Awareness Development**
   ```javascript
   // Mental mapping technique
   function improveMapAwareness() {
     const hotZones = ["Factory", "Clock Tower", "Observatory"];
     const rotationPaths = mapData.getOptimalPaths();
     
     // Practice optimal drop locations
     for (const zone of hotZones) {
       memorizeLootSpawns(zone);
       practiceRotationFrom(zone, rotationPaths);
     }
   }
   ```

3. **Movement Mechanics**
   Advanced zigzag patterns with proper timing can make your character harder to hit:
   ```
   // Pseudocode for zigzag movement
   while (inCombat) {
     moveDirection(LEFT, 0.6);
     crouchForDuration(0.2);
     moveDirection(RIGHT, 0.6);
     jumpAndRotate();
     repeatPattern();
   }
   ```

Would you like me to explain any specific game mechanics in more detail?`,
      
      `# Battle Royale Performance Optimization

## Technical Approach to Skill Improvement

1. **Frame Rate Optimization**
   ```java
   // Device settings optimization
   public class PerformanceSettings {
     public static void optimizeForGameplay() {
       // Clean system resources
       clearBackgroundApps();
       
       // Optimize graphics settings
       setGraphicsQuality(GraphicsQuality.BALANCED);
       setFrameRateLimit(60);
       disableShadows();
       disableAntiAliasing();
       
       // Reduce input lag
       enableGameMode();
     }
   }
   ```

2. **Sensitivity Calibration**
   Finding your ideal sensitivity is critical for consistent aim:
   ```
   // Start with this formula for baseline
   float baselineSensitivity = (screenDPI * 0.5) / averageReactionTimeMs;
   
   // Then fine-tune within ±15%
   for (float modifier = 0.85; modifier <= 1.15; modifier += 0.05) {
     testSensitivity(baselineSensitivity * modifier);
   }
   ```

3. **Landing Strategy Algorithm**
   ```python
   def optimal_landing_strategy(flight_path, zone_data):
     potential_spots = []
     
     for spot in zone_data:
       loot_quality = spot.get_loot_rating()
       distance_from_path = calculate_distance(flight_path, spot)
       player_density = estimate_player_density(spot, flight_path)
       
       # Algorithm for ranking spots
       spot_score = (loot_quality * 0.5) - (distance_from_path * 0.3) - (player_density * 0.2)
       potential_spots.append((spot, spot_score))
     
     return sorted(potential_spots, key=lambda x: x[1], reverse=True)
   ```

Would you like more specific code examples for improving gameplay mechanics?`,
      
      `# Advanced Game Sense Development

## Algorithmic Approach to Tactical Gameplay

1. **Decision Tree for Combat Scenarios**

   ```python
   def combat_decision_making(situation):
       if situation.enemy_count > 2 and situation.health < 70:
           return Tactics.REPOSITION_AND_HEAL
       
       if situation.has_high_ground and situation.zone_closing_in > 60:
           return Tactics.HOLD_POSITION
       
       if situation.ammo_status < AmmoStatus.SUFFICIENT:
           return Tactics.CONSERVE_AND_LOOT
       
       # Engagement distance calculation
       effective_range = get_weapon_effective_range(situation.equipped_weapon)
       if situation.enemy_distance > effective_range:
           return Tactics.CLOSE_DISTANCE
       else:
           return Tactics.ENGAGE
   ```

2. **Strategic Map Rotation**

   ```javascript
   // Rotating around the safe zone optimally
   function calculateOptimalRotation(currentPosition, safeZone, threats) {
     const pathOptions = [];
     
     // Generate potential paths (8 directions)
     for (let angle = 0; angle < 360; angle += 45) {
       const path = {
         direction: angle,
         safety: calculatePathSafety(currentPosition, angle, threats),
         coverPoints: identifyCover(currentPosition, angle, safeZone),
         timeToSafeZone: estimateTimeToSafeZone(currentPosition, angle, safeZone)
       };
       
       // Calculate overall path score
       path.score = (path.safety * 0.4) + 
                   (path.coverPoints * 0.3) + 
                   ((100 - path.timeToSafeZone) * 0.3);
                   
       pathOptions.push(path);
     }
     
     return pathOptions.sort((a, b) => b.score - a.score)[0];
   }
   ```

Would you like me to explain specific game mechanics or provide more gameplay improvement algorithms?`,
      
      `# Free Fire Character Optimization

## Character Ability Programming for Effectiveness

1. **Character Selection Algorithm**
   ```typescript
   interface CharacterAbility {
     name: string;
     cooldown: number;
     effectDuration: number;
     effectStrength: number;
     synergy: string[];
   }
   
   function optimizeCharacterCombination(playstyle: string): Character[] {
     const bestTeam = [];
     
     // Base character selection based on playstyle
     const mainCharacter = characters.find(c => 
       c.playstyleMatch(playstyle) > 0.8
     );
     
     bestTeam.push(mainCharacter);
     
     // Find synergistic characters
     for (const synergy of mainCharacter.synergy) {
       const synergisticChar = characters
         .filter(c => !bestTeam.includes(c))
         .sort((a, b) => {
           return (b.abilities.filter(ability => 
             ability.synergy.includes(synergy)
           ).length) - 
           (a.abilities.filter(ability => 
             ability.synergy.includes(synergy)
           ).length);
         })[0];
       
       bestTeam.push(synergisticChar);
     }
     
     return bestTeam.slice(0, 4); // Maximum team size
   }
   ```

2. **Ability Timing Optimization**
   ```java
   public class AbilityOptimizer {
     public static void calculateOptimalAbilityUse(CombatScenario scenario) {
       // Priority calculations
       double healingPriority = (100 - scenario.currentHealth) * 0.8;
       double offensivePriority = scenario.enemiesVisible ? 60 : 20;
       double defensivePriority = scenario.underFire ? 90 : 30;
       
       // Decision making
       if (healingPriority > offensivePriority && healingPriority > defensivePriority) {
         if (scenario.abilities.hasHealingAbility() && !scenario.abilities.isOnCooldown("heal")) {
           return scenario.abilities.activate("heal");
         }
       } else if (offensivePriority > defensivePriority) {
         if (scenario.abilities.hasOffensiveAbility() && !scenario.abilities.isOnCooldown("offensive")) {
           return scenario.abilities.activate("offensive");
         }
       } else {
         if (scenario.abilities.hasDefensiveAbility() && !scenario.abilities.isOnCooldown("defensive")) {
           return scenario.abilities.activate("defensive");
         }
       }
     }
   }
   ```

Is there a specific character ability or game mechanic you'd like me to analyze?`
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
      `# Cybersecurity Educational Framework

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

Remember that scanning networks requires explicit permission from network owners.`,
      
      `# Web Application Security (Educational Content)

## Security Testing Concepts

\`\`\`javascript
// Educational example of XSS vulnerability testing
function demonstrateXssVulnerability() {
  // This demonstrates how vulnerable code might look
  const vulnerableCode = `
    function displayUserInput() {
      // VULNERABLE: Direct insertion of user input
      const userInput = document.getElementById('userInput').value;
      document.getElementById('output').innerHTML = userInput;
    }
  `;
  
  // This demonstrates the secure approach
  const secureCode = `
    function displayUserInput() {
      // SECURE: Sanitizing user input
      const userInput = document.getElementById('userInput').value;
      const sanitizedInput = DOMPurify.sanitize(userInput);
      document.getElementById('output').innerHTML = sanitizedInput;
    }
  `;
  
  return {
    vulnerability: vulnerableCode,
    secureSolution: secureCode,
    securityPrinciple: "Input Validation and Sanitization"
  };
}

// Educational SQL injection example
function demonstrateSqlInjection() {
  // Vulnerable code example
  const vulnerableQuery = `
    // VULNERABLE: Direct string concatenation
    function getUserData(username) {
      const query = "SELECT * FROM users WHERE username = '" + username + "'";
      return database.execute(query);
    }
  `;
  
  // Secure code example
  const secureQuery = `
    // SECURE: Using parameterized queries
    function getUserData(username) {
      const query = "SELECT * FROM users WHERE username = ?";
      return database.execute(query, [username]);
    }
  `;
  
  return {
    vulnerability: vulnerableQuery,
    secureSolution: secureQuery,
    securityPrinciple: "Parameterized Queries and Input Validation"
  };
}
\`\`\`

These examples illustrate common web security vulnerabilities and their mitigations. Understanding these concepts helps developers:

1. Build secure web applications
2. Identify potential vulnerabilities during code reviews
3. Implement proper security controls
4. Understand the importance of input validation

This knowledge is crucial for both defensive security and authorized security testing.`,
      
      `# Cryptography Fundamentals (Educational)

## Encryption Implementation Examples

\`\`\`python
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

# Educational example of implementing AES encryption
def encrypt_data(plaintext, password):
    """Educational demonstration of proper encryption practices"""
    # Generate a random salt
    salt = os.urandom(16)
    
    # Key derivation function to get encryption key from password
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,  # 256 bit key for AES-256
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode())
    
    # Generate initialization vector
    iv = os.urandom(16)
    
    # Create cipher and encrypt
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    
    # Pad plaintext to be multiple of 16 bytes (AES block size)
    padded_data = plaintext.encode()
    pad_length = 16 - (len(padded_data) % 16)
    padded_data += bytes([pad_length]) * pad_length
    
    # Encrypt the data
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    
    # Combine salt, iv, and ciphertext for storage/transmission
    encrypted_data = salt + iv + ciphertext
    
    # Return base64 encoded data for easy storage
    return base64.b64encode(encrypted_data).decode('utf-8')

# Educational example of implementing AES decryption
def decrypt_data(encrypted_data, password):
    """Educational demonstration of proper decryption practices"""
    # Decode from base64
    raw_data = base64.b64decode(encrypted_data.encode())
    
    # Extract salt, iv, and ciphertext
    salt = raw_data[:16]
    iv = raw_data[16:32]
    ciphertext = raw_data[32:]
    
    # Derive the same key using the extracted salt
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = kdf.derive(password.encode())
    
    # Create cipher for decryption
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()
    
    # Decrypt the data
    padded_data = decryptor.update(ciphertext) + decryptor.finalize()
    
    # Remove padding
    pad_length = padded_data[-1]
    data = padded_data[:-pad_length]
    
    # Return the decrypted data
    return data.decode('utf-8')
\`\`\`

This code demonstrates proper cryptographic implementation practices including:

1. Random salt generation
2. Strong key derivation (PBKDF2)
3. Secure AES-256 encryption
4. Proper IV (Initialization Vector) handling
5. Padding to meet block size requirements

Understanding these concepts is essential for:
- Building secure communication systems
- Protecting sensitive data
- Implementing secure data storage
- Following security best practices

These examples are for educational purposes to understand cryptographic principles.`,
      
      `# Security Tool Development (Educational)

## Password Security Assessment

\`\`\`python
import re
from passlib.hash import pbkdf2_sha256
import random
import string

# Educational password strength analyzer
def analyze_password_strength(password):
    """Educational example of password strength assessment"""
    score = 0
    feedback = []
    
    # Length check
    if len(password) >= 12:
        score += 30
    elif len(password) >= 8:
        score += 15
        feedback.append("Consider using a longer password (12+ characters)")
    else:
        feedback.append("Password is too short, use at least 8 characters")
    
    # Complexity checks
    if re.search(r'[A-Z]', password):
        score += 10
    else:
        feedback.append("Add uppercase letters")
        
    if re.search(r'[a-z]', password):
        score += 10
    else:
        feedback.append("Add lowercase letters")
        
    if re.search(r'[0-9]', password):
        score += 10
    else:
        feedback.append("Add numbers")
        
    if re.search(r'[^A-Za-z0-9]', password):
        score += 15
        feedback.append("Add special characters")
    
    # Check for common patterns
    if re.search(r'(123|abc|qwerty|password|admin)', password.lower()):
        score -= 20
        feedback.append("Avoid common patterns in passwords")
    
    # Sequential characters
    for i in range(len(password) - 2):
        if ord(password[i]) + 1 == ord(password[i+1]) and ord(password[i+1]) + 1 == ord(password[i+2]):
            score -= 10
            feedback.append("Avoid sequential characters")
            break
    
    # Calculate strength category
    strength = ""
    if score >= 70:
        strength = "Strong"
    elif score >= 40:
        strength = "Moderate"
    else:
        strength = "Weak"
    
    return {
        "score": score,
        "strength": strength,
        "feedback": feedback
    }

# Educational secure password generator
def generate_secure_password(length=16):
    """Educational example of secure password generation"""
    if length < 12:
        length = 12  # Minimum recommended length
    
    # Character sets
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*()-_=+[]{}|;:,.<>?"
    
    # Ensure at least one character from each set
    password = [
        random.choice(lowercase),
        random.choice(uppercase),
        random.choice(digits),
        random.choice(special)
    ]
    
    # Fill the rest with random characters from all sets
    all_chars = lowercase + uppercase + digits + special
    password.extend(random.choice(all_chars) for _ in range(length - 4))
    
    # Shuffle the password characters
    random.shuffle(password)
    
    return ''.join(password)

# Educational password hashing example
def hash_password(password):
    """Educational example of secure password hashing"""
    # Using passlib's pbkdf2_sha256 with 29000 iterations (adjustable)
    return pbkdf2_sha256.hash(password)

def verify_password(password, hash):
    """Educational example of password verification"""
    return pbkdf2_sha256.verify(password, hash)
\`\`\`

This educational code demonstrates key password security concepts:

1. Password strength assessment
2. Secure random password generation
3. Proper password hashing using PBKDF2
4. Password verification

Understanding these concepts is important for:
- Implementing secure authentication systems
- Educating users on password security
- Protecting against brute force attacks
- Following security best practices in application development

These examples are provided for educational purposes to understand security principles.`
    ];
    
    // Return a random response from the array
    return hackingResponses[Math.floor(Math.random() * hackingResponses.length)];
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
};
