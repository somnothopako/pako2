import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageSquare, Plus, Home, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bubbles';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isStarred?: boolean;
}

const suggestionChips = [
  "How can I save more money?",
  "Help me understand my spending",
  "Tips for budgeting",
  "What's my financial health?",
];

const aiResponses = [
  "Great question! Let me help you with that. Based on your current spending patterns, I notice you could save about R500 per month by reducing dining out expenses. Would you like me to show you some specific recommendations?",
  "I'm here to support your financial wellness journey! Your spending looks healthy overall. Let's explore ways to optimize it together.",
  "That's a smart thing to think about! Financial wellness is all about small, consistent steps. Let me share some personalized tips based on your data.",
  "I've analyzed your transactions and I have some friendly suggestions that could help. Would you like to hear them?",
];

// Typing animation component
function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <p className="text-sm text-foreground">{displayText}</p>;
}

export function BubblesChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm Bubbles, your friendly financial wellness companion. How can I help you today?",
      sender: 'bubbles',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Budget Tips',
      lastMessage: 'How can I save more money?',
      timestamp: new Date(Date.now() - 86400000),
      isStarred: false,
    },
    {
      id: '2',
      title: 'Spending Analysis',
      lastMessage: 'Help me understand my spending',
      timestamp: new Date(Date.now() - 172800000),
      isStarred: true,
    },
    {
      id: '3',
      title: 'Financial Health',
      lastMessage: "What's my financial health?",
      timestamp: new Date(Date.now() - 259200000),
      isStarred: false,
    },
    {
      id: '4',
      title: 'Savings Goals',
      lastMessage: 'Help me set a savings goal',
      timestamp: new Date(Date.now() - 345600000),
      isStarred: true,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showImportMenu, setShowImportMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const responseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMessageId = (Date.now() + 1).toString();
      
      const aiMessage: Message = {
        id: aiMessageId,
        text: responseText,
        sender: 'bubbles',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setTypingMessageId(aiMessageId);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleImportOption = (option: 'metric' | 'statement' | 'account') => {
    console.log(`Importing ${option}`);
    setShowImportMenu(false);
  };

  const toggleStarChat = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, isStarred: !session.isStarred }
          : session
      )
    );
  };

  const starredChats = chatSessions.filter(session => session.isStarred);
  const recentChats = chatSessions.filter(session => !session.isStarred);

  const renderChatItem = (session: ChatSession) => (
    <div
      key={session.id}
      onClick={() => setCurrentSessionId(session.id)}
      className={`w-full text-left p-3 rounded-lg transition-all group hover:bg-muted relative cursor-pointer ${
        currentSessionId === session.id ? 'bg-muted' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <MessageSquare className="h-4 w-4 text-primary" />
        </div>
        {!isSidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground line-clamp-1">
              {session.title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {session.lastMessage}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {session.timestamp.toLocaleDateString('en-ZA', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
        {!isSidebarCollapsed && (
          <button
            onClick={(e) => toggleStarChat(session.id, e)}
            className="flex-shrink-0 p-1 hover:scale-110 transition-transform"
            title={session.isStarred ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                session.isStarred
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EFF5F1] dark:bg-[linear-gradient(to_bottom_right,rgb(8,12,11),rgb(10,11,13),rgb(9,12,12))] flex">
      {/* Left Sidebar - Chat History */}
      <motion.div 
        className="hidden lg:block flex-shrink-0 border-r border-border relative"
        animate={{ width: isSidebarCollapsed ? '64px' : '256px' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            {!isSidebarCollapsed && (
              <Button
                className="w-full gap-2 justify-start hover:bg-[#2C6B5F] hover:text-white hover:border-[#2C6B5F] transition-colors"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                New Chat
              </Button>
            )}
            {isSidebarCollapsed && (
              <Button
                size="icon"
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Favourited Section */}
            {starredChats.length > 0 && (
              <div className="space-y-2">
                {!isSidebarCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">
                    Favourited
                  </h3>
                )}
                {starredChats.map(renderChatItem)}
              </div>
            )}

            {/* Recent Chats Section */}
            <div className="space-y-2">
              {!isSidebarCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-2">
                  Recent Chats
                </h3>
              )}
              {recentChats.map(renderChatItem)}
            </div>
          </div>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-20 bg-white dark:bg-[rgb(18,22,21)] border border-border rounded-full p-1 hover:bg-muted transition-colors shadow-sm z-10"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[linear-gradient(to_bottom_right,rgb(13,17,16),rgb(15,18,20),rgb(14,18,17))]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[rgb(13,17,16)]/95 backdrop-blur-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Chat with Bubbles</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="rounded-full"
              title="Go to Home"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
          {/* Animated Bubble Avatar */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Main Bubble - Keep Normal Animation Throughout */}
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
                <motion.div
                  className="relative w-24 h-24"
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
                  {/* Base Circle */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.4) 0%, rgba(200, 180, 255, 0.35) 25%, rgba(135, 206, 235, 0.3) 50%, rgba(255, 200, 150, 0.25) 75%, rgba(150, 220, 180, 0.3) 100%)'
                    }}
                  />
                  
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(180, 120, 255, 0.15) 0%, rgba(100, 200, 255, 0.2) 30%, rgba(255, 180, 120, 0.15) 60%, rgba(120, 220, 180, 0.18) 100%)'
                    }}
                  />
                  
                  <div 
                    className="absolute top-4 left-5 w-10 h-10 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  
                  <div 
                    className="absolute top-5 left-6 w-5 h-5 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)'
                    }}
                  />
                  
                  <div 
                    className="absolute top-7 left-8 w-2 h-2 rounded-full"
                    style={{
                      background: 'rgba(255, 255, 255, 0.75)'
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Thought Bubbles - More bubbles when thinking, gradually slow down when answered */}
              <AnimatePresence>
                {isTyping && (
                  <>
                    {/* Bubble 1 */}
                    <motion.div
                      className="absolute -right-8 top-12"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.6, 0.6, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -5, -10, -15]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.3) 0%, rgba(135, 206, 235, 0.25) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 2 */}
                    <motion.div
                      className="absolute -right-4 top-8"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0.5, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -3, -6, -9]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.25) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 3 */}
                    <motion.div
                      className="absolute -left-6 top-10"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0.5, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -4, -8, -12]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.6
                      }}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(200, 180, 255, 0.3) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 4 */}
                    <motion.div
                      className="absolute right-2 top-14"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -6, -12, -18]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(150, 220, 180, 0.3) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 5 */}
                    <motion.div
                      className="absolute -left-3 top-16"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0.5, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -5, -10, -15]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.0
                      }}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(255, 200, 150, 0.25) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 6 */}
                    <motion.div
                      className="absolute -right-6 top-6"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.45, 0.45, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -4, -8, -12]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.3) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 7 */}
                    <motion.div
                      className="absolute left-0 top-6"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -3, -6, -9]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 2.1,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2
                      }}
                    >
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(200, 180, 255, 0.3) 0%, rgba(135, 206, 235, 0.2) 100%)'
                        }}
                      />
                    </motion.div>

                    {/* Bubble 8 */}
                    <motion.div
                      className="absolute right-6 top-2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0.5, 0],
                        scale: [0, 1, 1, 0],
                        y: [0, -5, -10, -15]
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, rgba(150, 220, 180, 0.3) 0%, rgba(135, 206, 235, 0.25) 100%)'
                        }}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3,
                    layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
                  }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'user' ? (
                    <motion.div 
                      layout
                      className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground"
                    >
                      <p className="text-sm">{message.text}</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      layout
                      className="max-w-[80%] px-4 py-3"
                    >
                      {typingMessageId === message.id ? (
                        <TypingText 
                          text={message.text} 
                          onComplete={() => setTypingMessageId(null)}
                        />
                      ) : (
                        <p className="text-sm text-foreground">{message.text}</p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator - Simple dots without background */}
            {isTyping && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3,
                  layout: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
                }}
                className="flex justify-start"
              >
                <div className="px-4 py-3">
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

          {/* Suggestion Chips */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {suggestionChips.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="rounded-full text-sm hover:bg-[#2C6B5F] hover:text-white hover:border-[#2C6B5F] transition-colors"
                >
                  {suggestion}
                </Button>
              ))}
            </motion.div>
          )}

          {/* Input Area */}
          <div className="sticky bottom-0 bg-white dark:bg-transparent pt-4 pb-6">
            <div className="flex gap-2 relative">
              {/* Import Menu Dropdown */}
              {showImportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 bg-white dark:bg-[rgb(18,22,21)] rounded-lg shadow-lg border border-border p-2 min-w-[220px] z-10"
                >
                  <button
                    onClick={() => handleImportOption('metric')}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <span>📈</span>
                    <span>Import In-App Metrics</span>
                  </button>
                  <button
                    onClick={() => handleImportOption('statement')}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <span>📄</span>
                    <span>Import Bank Statement</span>
                  </button>
                  <button
                    onClick={() => handleImportOption('account')}
                    className="w-full text-left px-3 py-2.5 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <span>🏦</span>
                    <span>Import Account</span>
                  </button>
                </motion.div>
              )}

              <Button
                onClick={() => setShowImportMenu(!showImportMenu)}
                size="icon"
                variant="outline"
                className="rounded-full h-12 w-12 flex-shrink-0 hover:bg-[#F4D03F] hover:border-[#F4D03F] transition-colors group"
                title="Import data"
              >
                <Plus className="h-4 w-4 group-hover:text-foreground transition-colors" />
              </Button>
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
        </div>
      </div>
    </div>
  );
}