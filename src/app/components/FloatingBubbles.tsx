import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { useBubbles } from '@/app/contexts/BubblesContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bubbles';
}

export function FloatingBubbles() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFloatingBubbleEnabled, isModalOpen, customMessage, clearCustomPopup } = useBubbles();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showCustomAction, setShowCustomAction] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Don't show on landing page, auth pages, or Home page
  const shouldShow = isFloatingBubbleEnabled &&
                     !isDismissed &&
                     !isExiting &&
                     !isModalOpen &&
                     location.pathname !== '/' && 
                     location.pathname !== '/signin' && 
                     location.pathname !== '/signup' &&
                     location.pathname !== '/home' &&
                     location.pathname !== '/settings' &&
                     location.pathname !== '/profile';

  // Show the "Blow up Bubbles" tab when dismissed
  const shouldShowTab = isFloatingBubbleEnabled &&
                        isDismissed &&
                        location.pathname !== '/' && 
                        location.pathname !== '/signin' && 
                        location.pathname !== '/signup' &&
                        location.pathname !== '/home' &&
                        location.pathname !== '/settings' &&
                        location.pathname !== '/profile';

  // Get contextual greeting based on current page
  const getContextualGreeting = () => {
    switch (location.pathname) {
      case '/learning':
        return "Need help deciding what to learn next?";
      case '/finances':
        return "Want help understanding your spending this month?";
      case '/rewards':
        return "Want to see how you can use your points?";
      case '/investments':
        return "Want to learn more about these investment options?";
      default:
        return "How can I help you today?";
    }
  };

  // Initialize popup with contextual greeting
  useEffect(() => {
    if (isPopupOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: getContextualGreeting(),
        sender: 'bubbles'
      }]);
    }
  }, [isPopupOpen]);

  // Handle outside click to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isPopupOpen && 
          popupRef.current && 
          bubbleRef.current &&
          !popupRef.current.contains(event.target as Node) &&
          !bubbleRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopupOpen]);

  // Handle custom message trigger
  useEffect(() => {
    if (customMessage) {
      // Clear existing messages and open popup
      setMessages([]);
      setIsPopupOpen(true);
      setShowCustomAction(false);
      
      // Show messages one by one with delay
      customMessage.messages.forEach((text, index) => {
        setTimeout(() => {
          const message: Message = {
            id: `custom-${Date.now()}-${index}`,
            text,
            sender: 'bubbles'
          };
          setMessages(prev => [...prev, message]);
          
          // Show action button after last message
          if (index === customMessage.messages.length - 1 && customMessage.actionButton) {
            setTimeout(() => {
              setShowCustomAction(true);
            }, 300);
          }
        }, index * 800); // Stagger messages by 800ms
      });
    }
  }, [customMessage]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! I can definitely help you with that.",
        "Let me break that down for you in a simple way.",
        "I'd love to help! Here's what I think...",
        "Good thinking! Here's my take on that.",
      ];
      
      const bubblesMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bubbles'
      };
      
      setMessages(prev => [...prev, bubblesMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Toggle popup
  const handleBubbleClick = (e: React.MouseEvent) => {
    // Don't open popup if clicking the close button
    if ((e.target as HTMLElement).closest('.close-button')) {
      return;
    }
    setIsPopupOpen(!isPopupOpen);
  };

  // Open full Bubbles page
  const openFullChat = () => {
    setIsPopupOpen(false);
    navigate('/bubbles');
  };

  // Handle dismiss - trigger exit animation then hide
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubble click
    setIsPopupOpen(false); // Close popup if open
    setIsExiting(true);
    
    // Wait for exit animation to complete
    setTimeout(() => {
      setIsDismissed(true);
      setIsExiting(false);
    }, 300); // Match exit animation duration
  };

  // Handle restore bubble
  const handleRestore = () => {
    setIsDismissed(false);
    setMessages([]); // Reset chat messages
    setInputValue(''); // Clear input
    setIsTyping(false); // Clear typing indicator
  };

  // Generate random pop particles
  const popParticles = Array.from({ length: 8 }, (_, i) => ({
    angle: (i * 45) * (Math.PI / 180),
    distance: 30 + Math.random() * 20,
    size: 4 + Math.random() * 6,
  }));

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShow && (
          <motion.div
            ref={bubbleRef}
            key="floating-bubbles"
            onClick={handleBubbleClick}
            className="fixed bottom-24 md:bottom-8 right-6 z-50 cursor-pointer"
            
            // Entry animation - bubble forming/condensing
            initial={{ 
              scale: 0.3,
              opacity: 0,
              scaleX: 0.4,
              scaleY: 0.6,
              rotate: -8,
            }}
            animate={{ 
              scale: 1,
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              rotate: 0,
              y: [0, -8, 0, -5, 0],
              x: [0, 2, -2, 1, 0],
            }}
            transition={{
              // Entry transition - organic inflation
              scale: {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              },
              opacity: {
                duration: 0.4,
                ease: "easeOut",
              },
              scaleX: {
                duration: 0.55,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              scaleY: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              rotate: {
                duration: 0.45,
                ease: "easeOut",
              },
              // Continuous floating after entry
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
              x: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            
            whileTap={{ scale: 0.9 }}
            whileHover={{ 
              scale: 1.15,
              y: -4,
            }}
          >
            {/* Main Glossy Bubble */}
            <motion.div 
              className="relative w-16 h-16 md:w-20 md:h-20"
              exit={{
                scaleX: [1, 1.15, 0.1],
                scaleY: [1, 1.15, 0.1],
                opacity: [1, 1, 0],
              }}
              transition={{
                exit: {
                  duration: 0.2,
                  times: [0, 0.4, 1],
                  ease: "easeIn",
                }
              }}
            >
              {/* Animated bubble distortion on normal state */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  scaleX: [1, 1.04, 0.98, 1.01, 1],
                  scaleY: [1, 0.98, 1.04, 0.99, 1],
                  skewX: [0, 1.5, -1.5, 0.8, 0],
                  skewY: [0, -0.8, 1.5, -0.8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Base Circle - Translucent with soapy iridescent colors */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.4) 0%, rgba(200, 180, 255, 0.35) 25%, rgba(135, 206, 235, 0.3) 50%, rgba(255, 200, 150, 0.25) 75%, rgba(150, 220, 180, 0.3) 100%)'
                  }}
                />
                
                {/* Soapy color overlay - creates natural iridescence */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(180, 120, 255, 0.15) 0%, rgba(100, 200, 255, 0.2) 30%, rgba(255, 180, 120, 0.15) 60%, rgba(120, 220, 180, 0.18) 100%)'
                  }}
                />

                {/* Large highlight */}
                <div 
                  className="absolute top-2 left-2 w-6 h-6 md:w-8 md:h-8 rounded-full" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}
                />
                
                {/* Small highlight */}
                <div 
                  className="absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)'
                  }}
                />
                
                {/* Close button X on the white highlight */}
                <motion.button
                  onClick={handleDismiss}
                  className="close-button absolute top-0.5 left-0.5 md:top-1 md:left-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm z-10"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-700" strokeWidth={3} />
                </motion.button>
                
                {/* Bottom reflection */}
                <div className="absolute bottom-2 right-2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/30 blur-[2px]" />

                {/* Border */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40" />
              </motion.div>
            </motion.div>

            {/* Pop Particles - only visible during exit */}
            {popParticles.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 rounded-full bg-primary/60"
                style={{
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  times: [0, 0.3, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Popup */}
      <AnimatePresence>
        {isPopupOpen && shouldShow && (
          <motion.div
            ref={popupRef}
            initial={{ 
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ 
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="fixed bottom-44 md:bottom-28 right-6 w-[calc(100vw-3rem)] md:w-96 z-40"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Messages Area */}
              <div className="p-4 max-h-80 overflow-y-auto space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1.5">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                {/* Custom Action Button */}
                {showCustomAction && customMessage?.actionButton && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      customMessage.actionButton?.onClick();
                      setIsPopupOpen(false);
                      clearCustomPopup();
                    }}
                    className="w-full mb-3 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    {customMessage.actionButton.label}
                  </motion.button>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask Bubbles a question…"
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 flex items-center justify-center bg-primary hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Open Full Chat Link */}
                {messages.length > 2 && !showCustomAction && (
                  <motion.button
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={openFullChat}
                    className="w-full mt-3 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Open full Bubbles chat →
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blow up Bubbles Tab */}
      <AnimatePresence>
        {shouldShowTab && (
          <motion.button
            onClick={handleRestore}
            initial={{ 
              opacity: 0,
              x: 100,
            }}
            animate={{ 
              opacity: 1,
              x: 0,
            }}
            exit={{ 
              opacity: 0,
              x: 100,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="fixed bottom-1/2 right-0 z-40 bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-l-lg shadow-lg text-xs font-medium transition-colors"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            Blow up Bubbles
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}