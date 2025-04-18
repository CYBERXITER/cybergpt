import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Educational content for the AI assistant
const educationalContent = {
  math: {
    equations: {
      quadratic: (a: number, b: number, c: number) => {
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return "This equation has no real solutions.";
        
        if (discriminant === 0) {
          const x = -b / (2 * a);
          return `This equation has one solution: x = ${x}`;
        }
        
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        return `This equation has two solutions: x₁ = ${x1.toFixed(2)} and x₂ = ${x2.toFixed(2)}`;
      },
      linear: (a: number, b: number) => {
        if (a === 0) return b === 0 ? "The equation is true for all values of x." : "This equation has no solution.";
        const x = -b / a;
        return `The solution is x = ${x}`;
      }
    },
    problems: {
      solve: (question: string) => {
        // Extract numbers from the question
        const numbers = question.match(/\d+(\.\d+)?/g)?.map(Number) || [];
        
        if (question.includes("quadratic") || question.includes("x²") || question.includes("x^2")) {
          if (numbers.length >= 3) {
            return `To solve this quadratic equation:\n\n1. I'll use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n2. With a=${numbers[0]}, b=${numbers[1]}, c=${numbers[2]}\n\n${educationalContent.math.equations.quadratic(numbers[0], numbers[1], numbers[2])}`;
          }
          return "To solve a quadratic equation (ax² + bx + c = 0), I need the values of a, b, and c. Could you provide those?";
        }
        
        if (question.includes("linear") || (question.includes("x") && !question.includes("x²") && !question.includes("x^2"))) {
          if (numbers.length >= 2) {
            return `To solve this linear equation:\n\n1. I'll rearrange it to the form ax + b = 0\n2. With a=${numbers[0]}, b=${numbers[1]}\n\n${educationalContent.math.equations.linear(numbers[0], numbers[1])}`;
          }
          return "To solve a linear equation (ax + b = 0), I need the values of a and b. Could you provide those?";
        }
        
        if (question.includes("add") || question.includes("sum") || question.includes("plus") || question.includes("+")) {
          if (numbers.length >= 2) {
            const sum = numbers.reduce((a, b) => a + b, 0);
            return `The sum of ${numbers.join(" + ")} = ${sum}`;
          }
        }
        
        if (question.includes("multiply") || question.includes("product") || question.includes("times") || question.includes("*") || question.includes("×")) {
          if (numbers.length >= 2) {
            const product = numbers.reduce((a, b) => a * b, 1);
            return `The product of ${numbers.join(" × ")} = ${product}`;
          }
        }
        
        if (question.includes("subtract") || question.includes("difference") || question.includes("minus") || question.includes("-")) {
          if (numbers.length >= 2) {
            const difference = numbers.reduce((a, b, i) => i === 0 ? a : a - b, numbers[0]);
            return `The difference of ${numbers[0]} - ${numbers.slice(1).join(" - ")} = ${difference}`;
          }
        }
        
        if (question.includes("divide") || question.includes("quotient") || question.includes("divided by") || question.includes("/") || question.includes("÷")) {
          if (numbers.length >= 2) {
            if (numbers.slice(1).some(n => n === 0)) {
              return "Division by zero is not defined. Please check your numbers.";
            }
            const quotient = numbers.reduce((a, b, i) => i === 0 ? a : a / b, numbers[0]);
            return `The quotient of ${numbers[0]} ÷ ${numbers.slice(1).join(" ÷ ")} = ${quotient.toFixed(2)}`;
          }
        }
        
        return "I need more specific information about the math problem. Please include the type of problem (e.g., quadratic equation, addition) and the numbers involved.";
      }
    }
  },
  essays: {
    generate: (topic: string) => {
      // Generate essays based on common topics
      if (topic.includes("environment") || topic.includes("climate") || topic.includes("global warming")) {
        return `# Environmental Challenges and Solutions

Climate change and environmental protection are among the most pressing challenges facing our world today. Rising global temperatures, extreme weather events, and loss of biodiversity threaten both natural ecosystems and human communities.

## Key Environmental Issues

The Earth's average temperature has increased by approximately 1°C since pre-industrial times, primarily due to human activities like burning fossil fuels, deforestation, and industrial processes. This warming has led to:

- Melting polar ice caps and rising sea levels
- Increased frequency and intensity of extreme weather events
- Disruption of ecosystems and loss of biodiversity
- Threats to food and water security

## Sustainable Solutions

Addressing these challenges requires a multi-faceted approach:

1. **Renewable Energy**: Transitioning from fossil fuels to clean energy sources like solar, wind, and hydroelectric power
2. **Conservation Efforts**: Protecting natural habitats and endangered species
3. **Sustainable Practices**: Implementing recycling programs, reducing single-use plastics, and promoting circular economies
4. **Policy Changes**: Enacting regulations that limit carbon emissions and incentivize green technologies
5. **Individual Actions**: Making environmentally conscious choices in daily life

## Conclusion

While the environmental challenges we face are significant, there is growing awareness and commitment to creating a more sustainable future. Through a combination of technological innovation, policy reform, and individual action, we can work together to protect our planet for future generations.`;
      }
      
      if (topic.includes("technology") || topic.includes("digital") || topic.includes("internet") || topic.includes("AI")) {
        return `# The Digital Revolution: Impact of Technology on Society

The rapid advancement of technology has transformed virtually every aspect of modern life, from how we communicate and work to how we learn and entertain ourselves.

## Technological Transformation

Over the past few decades, we've witnessed unprecedented technological progress:

- The internet has connected billions of people worldwide, creating a global village
- Smartphones have put computing power and information access in our pockets
- Artificial intelligence and automation are revolutionizing industries
- Social media has changed how we form communities and share information

## Benefits of the Digital Age

Technology has brought numerous advantages:

1. **Increased Access to Information**: The democratization of knowledge through digital platforms
2. **Improved Efficiency**: Automation of routine tasks and streamlined processes
3. **Enhanced Communication**: Instant global connectivity and collaboration
4. **Medical Advancements**: Improved diagnostics, treatments, and healthcare delivery
5. **Educational Opportunities**: Online learning and educational resources

## Challenges and Concerns

Despite its benefits, technology also presents challenges:

1. **Digital Divide**: Inequality in access to technology and digital literacy
2. **Privacy Concerns**: Data collection and surveillance issues
3. **Job Displacement**: Automation threatening traditional employment
4. **Mental Health Impacts**: Issues related to screen time and social media use
5. **Ethical Considerations**: Questions about AI development and responsible innovation

## Conclusion

As we continue to navigate the digital revolution, it's essential to maximize the benefits of technology while addressing its challenges. Through thoughtful policy, ethical innovation, and digital literacy, we can harness technology's potential to create a more equitable, efficient, and connected society.`;
      }
      
      if (topic.includes("education") || topic.includes("learning") || topic.includes("school") || topic.includes("student")) {
        return `# The Evolution of Education in the 21st Century

Education is undergoing significant transformation in response to changing social needs, technological advancements, and new understandings of how people learn.

## Traditional vs. Modern Education

The educational landscape has evolved considerably:

- From teacher-centered to student-centered approaches
- From standardized, one-size-fits-all models to personalized learning
- From memorization to critical thinking and problem-solving
- From confined classrooms to global, connected learning environments

## Educational Innovations

Several innovations are reshaping education:

1. **Digital Learning**: Online courses, educational apps, and virtual classrooms
2. **Project-Based Learning**: Hands-on, collaborative problem-solving experiences
3. **Competency-Based Education**: Advancing based on skills mastery rather than time spent
4. **Global Education**: International perspectives and cross-cultural learning opportunities
5. **Lifelong Learning**: Continuous education throughout one's career and life

## Challenges in Education

Despite progress, significant challenges remain:

1. **Educational Equity**: Disparities in access to quality education
2. **Adapting to Technology**: Balancing digital tools with human connection
3. **Teacher Training**: Preparing educators for new teaching methodologies
4. **Assessment Reform**: Developing meaningful evaluation methods
5. **Funding and Resources**: Ensuring adequate support for educational institutions

## The Future of Learning

As we look ahead, education will likely continue to evolve toward more personalized, flexible, and lifelong learning models. The integration of artificial intelligence, virtual reality, and other technologies promises to further transform how we teach and learn.

## Conclusion

Education remains the foundation of individual opportunity and societal progress. By embracing innovation while preserving the human elements of teaching and learning, we can create educational systems that prepare all students for success in a rapidly changing world.`;
      }
      
      if (topic.includes("health") || topic.includes("wellness") || topic.includes("fitness") || topic.includes("mental health")) {
        return `# Holistic Health and Wellness in Modern Life

In today's fast-paced world, maintaining good health requires a comprehensive approach that addresses physical, mental, and social well-being.

## The Components of Wellness

True wellness encompasses multiple dimensions:

- **Physical Health**: Nutrition, exercise, sleep, and preventive care
- **Mental Health**: Emotional well-being, stress management, and cognitive health
- **Social Health**: Quality relationships and community connections
- **Spiritual Health**: Finding meaning, purpose, and values

## Current Health Challenges

Modern societies face several health challenges:

1. **Chronic Diseases**: Heart disease, diabetes, and cancer related to lifestyle factors
2. **Mental Health Crisis**: Rising rates of anxiety, depression, and other mental health conditions
3. **Sedentary Lifestyles**: Increased screen time and decreased physical activity
4. **Nutrition Issues**: Processed foods, poor dietary habits, and food insecurity
5. **Healthcare Access**: Disparities in access to quality healthcare services

## Strategies for Better Health

Evidence-based approaches to improving health include:

1. **Balanced Nutrition**: Whole foods, plant-based options, and mindful eating
2. **Regular Physical Activity**: Both cardiovascular exercise and strength training
3. **Mental Health Practices**: Meditation, therapy, and stress reduction techniques
4. **Preventive Care**: Regular check-ups and health screenings
5. **Healthy Sleep Habits**: Consistent sleep schedules and quality rest

## The Role of Technology in Health

Technology is increasingly influencing health management:

- Health tracking devices and applications
- Telemedicine and virtual healthcare services
- Online health communities and resources
- AI-assisted diagnostics and personalized medicine

## Conclusion

Achieving and maintaining good health requires a proactive, holistic approach. By addressing all dimensions of wellness and making consistent healthy choices, individuals can improve their quality of life and resilience against health challenges.`;
      }
      
      return `# Essay on ${topic}

## Introduction
${topic} is a fascinating subject that has garnered significant attention in recent years. This topic encompasses various aspects and has important implications for our society and future.

## Background
The history of ${topic} dates back several decades, though recent developments have brought new perspectives and approaches. Understanding the context helps us appreciate its significance in today's world.

## Key Aspects
There are several important dimensions to consider when examining ${topic}:

1. **Social Impact**: How ${topic} affects communities and interpersonal relationships
2. **Economic Considerations**: The financial implications and economic factors related to ${topic}
3. **Technological Connections**: How technology has influenced and been influenced by developments in ${topic}
4. **Ethical Questions**: The moral and ethical considerations that arise when discussing ${topic}

## Current Challenges
Despite progress, several challenges remain in the field of ${topic}:
- Implementation difficulties in various contexts
- Resistance to change from traditional perspectives
- Resource limitations affecting advancement
- Balancing competing priorities and interests

## Future Directions
Looking ahead, we can anticipate several developments in ${topic}:
- Integration of new technologies and methodologies
- Increased collaboration across disciplines
- Greater public awareness and engagement
- Policy reforms reflecting new understandings

## Conclusion
${topic} represents an important area of study and practice with far-reaching implications. By addressing current challenges and embracing new opportunities, we can harness its potential for positive change in our world.`;
    }
  }
};

const StudyBuddyChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateResponse = (question: string) => {
    // Convert the question to lowercase for easier keyword matching
    const lowerQuestion = question.toLowerCase();
    
    // Check for essay requests
    if (lowerQuestion.includes("write an essay") || 
        lowerQuestion.includes("write a paragraph") || 
        lowerQuestion.includes("essay about") || 
        lowerQuestion.includes("essay on")) {
      
      // Extract the topic from the question
      let topic = question.replace(/write an essay (about|on)/i, '')
                         .replace(/write a paragraph (about|on)/i, '')
                         .replace(/essay (about|on)/i, '')
                         .replace(/i need an essay (about|on)/i, '')
                         .replace(/can you write an essay (about|on)/i, '')
                         .trim();
                         
      if (!topic || topic === question) {
        topic = question.split(' ').slice(3).join(' '); // Fallback extraction
      }
      
      return educationalContent.essays.generate(topic);
    }
    
    // Check for math problem solving requests
    if (lowerQuestion.includes("solve") || 
        lowerQuestion.includes("calculate") || 
        lowerQuestion.includes("find") || 
        lowerQuestion.includes("equation") ||
        lowerQuestion.includes("math problem")) {
      
      return educationalContent.math.problems.solve(question);
    }
    
    // Determine the subject based on keywords in the question
    let subject = 'general';
    
    if (lowerQuestion.includes('math') || lowerQuestion.includes('equation') || 
        lowerQuestion.includes('calculate') || lowerQuestion.includes('formula') ||
        lowerQuestion.includes('algebra') || lowerQuestion.includes('geometry')) {
      subject = 'math';
    } else if (lowerQuestion.includes('english') || lowerQuestion.includes('essay') || 
               lowerQuestion.includes('grammar') || lowerQuestion.includes('writing') ||
               lowerQuestion.includes('literature') || lowerQuestion.includes('poem')) {
      subject = 'english';
    } else if (lowerQuestion.includes('science') || lowerQuestion.includes('biology') || 
               lowerQuestion.includes('chemistry') || lowerQuestion.includes('physics') ||
               lowerQuestion.includes('experiment') || lowerQuestion.includes('lab')) {
      subject = 'science';
    } else if (lowerQuestion.includes('history') || lowerQuestion.includes('war') || 
               lowerQuestion.includes('century') || lowerQuestion.includes('civilization') ||
               lowerQuestion.includes('revolution') || lowerQuestion.includes('ancient')) {
      subject = 'history';
    }
    
    // Get responses for the detected subject
    const subjectResponses = educationalResponses[subject] || educationalResponses.general;
    
    // Generate a specific response based on the question
    if (lowerQuestion.includes('help') || lowerQuestion.includes('how are you')) {
      return "I'm your Study Buddy AI! I can help with homework in math, science, English, history, and more. I can write essays and solve math problems for you. What subject are you working on?";
    } else if (lowerQuestion.includes('thank')) {
      return "You're welcome! Feel free to ask if you have more questions. Good luck with your studies!";
    } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi ')) {
      return "Hello there! I'm your Study Buddy AI. I can help you with essays, math problems, and various homework questions. What can I help you with today?";
    } else if (lowerQuestion.includes('bye') || lowerQuestion.includes('goodbye')) {
      return "Goodbye! Good luck with your studies. Come back anytime you need help!";
    } else {
      // Return a random response from the appropriate subject
      return subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response generation with slight delay for realism
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">Study Buddy AI Assistant</h1>
          </div>
          <p className="text-center text-purple-100">Your 24/7 homework helper and study companion</p>
        </div>

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">👋 Hi there! Need help with your homework?</p>
              <p className="mt-2">Ask me anything about your studies!</p>
              <div className="mt-6 text-sm text-gray-400 max-w-md mx-auto">
                <p>Try asking questions like:</p>
                <ul className="mt-2 space-y-1 text-left px-8 list-disc">
                  <li>"Can you help me with this math problem?"</li>
                  <li>"How do I write a good thesis statement?"</li>
                  <li>"Explain the scientific method"</li>
                  <li>"What were the main causes of World War II?"</li>
                </ul>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question here..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudyBuddyChat;
