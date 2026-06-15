import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bubbles';
  timestamp: Date;
}

const suggestionChips = [
  "Help me stay on budget",
  "What should I learn next?",
  "Explain my finances",
  "How can I save more?",
];

const aiResponses = [
  "Great question! Let me help you with that. Based on your current spending patterns, I notice you could save about R500 per month by reducing dining out expenses. Would you like me to show you some specific recommendations?",
  "I'm here to support your financial wellness journey! Your spending looks healthy overall. Let's explore ways to optimize it together.",
  "That's a smart thing to think about! Financial wellness is all about small, consistent steps. Let me share some personalized tips based on your data.",
  "I've analyzed your transactions and I have some friendly suggestions that could help. Would you like to hear them?",
];

export function Bubbles() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm Bubbles. How can I help today?",
      sender: 'bubbles',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'bubbles',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        {/* Animated Bubble Avatar */}
        <motion.div
          className="flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative"
            animate={{
              y: [0, -8, 0, -5, 0],
              x: [0, 2, -2, 1, 0],
              rotate: [0, 5, -3, 4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Glossy Bubble */}
            <motion.div
              className="relative w-20 h-20"
              animate={{
                scaleX: [1, 1.04, 0.98, 1.02, 1],
                scaleY: [1, 0.98, 1.04, 0.99, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Outer glow */}
              <div className="absolute -inset-4 rounded-full bg-primary/10 blur-2xl" />

              {/* Main bubble body */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-blue-300/40 backdrop-blur-sm" />
                
                <motion.div
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,100,150,0.3) 15%, rgba(255,200,100,0.4) 25%, rgba(255,255,150,0.3) 35%, transparent 45%, rgba(150,200,255,0.3) 60%, rgba(200,150,255,0.4) 75%, rgba(255,100,200,0.3) 85%, transparent 100%)'
                  }}
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>

              {/* Highlights */}
              <div className="absolute top-2 left-4 w-8 h-8 rounded-full bg-white/70 blur-md" />
              <div className="absolute top-3 left-5 w-4 h-4 rounded-full bg-white/90" />
              <div className="absolute top-5 left-6 w-1.5 h-1.5 rounded-full bg-white" />
              <div className="absolute bottom-4 right-4 w-5 h-5 rounded-full bg-white/20 blur-sm" />
              
              {/* Borders */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <div className="absolute inset-0 rounded-full border border-blue-300/30" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Welcome Text */}
        <div>
          <h1 className="text-3xl font-bold">Hi, I'm Bubbles</h1>
          <p className="text-muted-foreground">How can I help today?</p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <Card className="p-6 min-h-[500px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-foreground/40"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips - Only show at start */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <p className="text-xs text-muted-foreground mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full text-sm"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Ask Bubbles anything..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              size="icon"
              className="rounded-full h-12 w-12 flex-shrink-0"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Supporting Info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              I'm here to help you understand your finances, learn new skills, and stay on track with your goals—without any pressure or judgment.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}