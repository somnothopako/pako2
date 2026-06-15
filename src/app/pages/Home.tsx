import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Upload, 
  Link as LinkIcon,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  PiggyBank,
  Wallet,
  Gift,
  BookOpen,
  TrendingUpIcon,
  MessageCircle,
  ChevronRight,
  Clock,
  X,
  Shield,
  Lock,
  Eye,
  Sparkles,
  CheckCircle2,
  Circle,
  UserCheck,
  Target,
  ListTodo,
  Bell,
  User,
  Lightbulb,
  Link2,
  ChevronLeft
} from 'lucide-react';
import { mockUser, mockTransactions, bubblesInsights, previousMonthData, mockCourses, rewardsData, mockInvestmentData, goalsData, todosData, bubblesSuggestions } from '@/app/data/mockData';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useUser } from '@/app/contexts/UserContext';
import { SimpleCarousel, SimpleCarouselRef } from '@/app/components/Carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import { useIsMobile } from '@/app/components/ui/use-mobile';
import { Separator } from '@/app/components/ui/separator';

export function Home() {
  const navigate = useNavigate();
  const { user, clearNewUserFlag, getTotalAccountCount } = useUser();
  const isMobile = useIsMobile();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Hi, I'm Bubbles!");
  const [bubbleTapped, setBubbleTapped] = useState(false);
  const [greetingComplete, setGreetingComplete] = useState(false);
  const { financialHealth, hasConnectedFinances } = mockUser;
  
  // Bank connection dialog state
  const [showBankDialog, setShowBankDialog] = useState(false);
  
  // Setup banner state
  const [showSetupBanner, setShowSetupBanner] = useState(true);
  const [hasBankAccount, setHasBankAccount] = useState(false); // Mock: user hasn't connected bank yet

  // Animation state
  const [animatedHealthScore, setAnimatedHealthScore] = useState(0);
  const [animatedCreditScore, setAnimatedCreditScore] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedRemaining, setAnimatedRemaining] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [healthScoreProgress, setHealthScoreProgress] = useState(0);
  const [creditScoreProgress, setCreditScoreProgress] = useState(0);

  // Rewards popup state
  const [openRewardPopup, setOpenRewardPopup] = useState<'balance' | 'progress' | null>(null);
  const [closingRewardPopup, setClosingRewardPopup] = useState(false);
  const [animatedRewardProgress, setAnimatedRewardProgress] = useState(0);
  const [isHoveringBalance, setIsHoveringBalance] = useState(false);

  // Toast rotation logic
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Show first toast after a short delay
    const initialDelay = setTimeout(() => {
      setShowToast(true);
    }, 500);

    return () => clearTimeout(initialDelay);
  }, []);

  // Auto-trigger animations on page load/visit
  useEffect(() => {
    // Small delay before starting animations
    const startDelay = setTimeout(() => {
      // Animate Health Score number
      animateValue(0, financialHealth.score, 1000, setAnimatedHealthScore);
      
      // Animate Credit Score number
      animateValue(0, mockUser.creditScore.score, 1000, setAnimatedCreditScore);
      
      // Animate financial metrics
      animateValue(0, financialHealth.income, 1200, setAnimatedIncome);
      animateValue(0, financialHealth.expenses, 1200, setAnimatedExpenses);
      animateValue(0, financialHealth.remaining, 1200, setAnimatedRemaining);
      animateValue(0, financialHealth.savings, 1200, setAnimatedSavings);
      
      // Animate progress bars
      animateValue(0, financialHealth.score, 800, setHealthScoreProgress);
      animateValue(0, mockUser.creditScore.score, 800, setCreditScoreProgress);
      
      // Animate Reward Balance
      animateValue(0, mockUser.points, 800, setAnimatedRewardProgress);
    }, 200);

    // Cleanup: Reset all animations when component unmounts
    return () => {
      clearTimeout(startDelay);
      setAnimatedHealthScore(0);
      setAnimatedCreditScore(0);
      setAnimatedIncome(0);
      setAnimatedExpenses(0);
      setAnimatedRemaining(0);
      setAnimatedSavings(0);
      setHealthScoreProgress(0);
      setCreditScoreProgress(0);
    };
  }, [financialHealth.score, financialHealth.income, financialHealth.expenses, financialHealth.remaining, financialHealth.savings, mockUser.creditScore.score]);

  // Generic animation helper function
  const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic easing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + (end - start) * easeOut;
      
      setter(Math.round(currentValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setter(end); // Ensure we end exactly at the target value
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!showToast) return;

    // Hide toast after 3 seconds
    const hideTimer = setTimeout(() => {
      setShowToast(false);
      // Set greeting complete when the first greeting disappears
      if (toastMessage === "Hi, I'm Bubbles!") {
        setGreetingComplete(true);
      }
    }, 3000);

    // Show next toast after 4 seconds (1 second gap)
    const nextTimer = setTimeout(() => {
      setCurrentInsight((prev) => {
        const nextIndex = (prev + 1) % bubblesInsights.length;
        const isFirstRotation = prev === bubblesInsights.length - 1 && nextIndex === 0;
        
        if (nextIndex === 0 && !isFirstRotation) {
          setToastMessage("Hi, I'm Bubbles!");
        } else if (nextIndex === 0 && isFirstRotation) {
          setToastMessage("Hi, I'm Bubbles!");
        } else {
          setToastMessage(bubblesInsights[nextIndex]);
        }
        
        setShowToast(true);
        return nextIndex;
      });
    }, 4000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [showToast, toastMessage]);

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % bubblesInsights.length);
  };

  const handleCloseRewardPopup = () => {
    // Trigger fade-out animation
    setClosingRewardPopup(true);
    
    // Wait for animation to complete before removing popup
    setTimeout(() => {
      setOpenRewardPopup(null);
      setClosingRewardPopup(false);
      // Restore background scrolling
      document.body.style.overflow = '';
    }, 300); // Match fade-out duration
  };
  
  // Check if user is new and show bank connection dialog
  useEffect(() => {
    if (user?.isNewUser) {
      // Show dialog after a short delay
      const timer = setTimeout(() => {
        setShowBankDialog(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  // Reset setup banner on component mount if no bank account connected
  useEffect(() => {
    if (!hasBankAccount) {
      setShowSetupBanner(true);
    }
  }, []);
  
  const handleConnectBank = () => {
    setShowBankDialog(false);
    clearNewUserFlag();
    navigate('/finances');
  };
  
  const handleMaybeLater = () => {
    setShowBankDialog(false);
    clearNewUserFlag();
  };

  return (
    <div className={`px-[16px] py-[20px] space-y-4 max-w-6xl mx-auto ${openRewardPopup ? 'pointer-events-none' : ''}`}>
      {/* Animation Keyframes */}
      <style>{`
        @keyframes bubbleFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(15px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-10px, 15px) scale(0.98);
          }
        }
        
        @keyframes bubbleFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-20px, 15px) scale(1.03);
          }
          66% {
            transform: translate(18px, -12px) scale(0.97);
          }
        }
        
        @keyframes bubbleFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(12px, 18px) scale(1.04);
          }
          66% {
            transform: translate(-15px, -10px) scale(0.96);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        @keyframes bubblePopOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.7);
          }
        }
        
        @keyframes bubblePopIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      
      {/* Profile Header */}
      {/* Moved to global header */}

      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold dark:text-[rgb(240,243,245)]">Welcome back, {mockUser.name}!</h1>
        <p className="text-[#0F3D3E] dark:text-[rgb(240,243,245)] text-base">Here's your financial overview</p>
      </div>

      {/* Bubbles AI Assistant */}
      <Card className="p-6 bg-transparent border-0 relative overflow-visible min-h-[200px] flex items-center justify-center -mt-2">
        {/* Small floating bubbles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              bottom: -20,
              left: `${5 + (i * 3.8)}%`,
              opacity: 0 
            }}
            animate={{
              bottom: ['0%', '100%'],
              left: [
                `${5 + (i * 3.8)}%`,
                `${5 + (i * 3.8) + (i % 2 === 0 ? 5 : -5)}%`,
                `${5 + (i * 3.8) + (i % 3 === 0 ? -3 : 3)}%`,
                `${5 + (i * 3.8)}%`
              ],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 5 + (i * 0.6),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="relative" 
              style={{ 
                width: `${8 + (i % 5) * 2.5}px`, 
                height: `${8 + (i % 5) * 2.5}px` 
              }}
              animate={{
                scaleX: [1, 1.08, 0.96, 1.04, 1],
                scaleY: [1, 0.94, 1.08, 0.98, 1],
                skewX: [0, 3, -3, 2, 0],
                skewY: [0, -2, 3, -1, 0],
                rotate: [0, 5, -5, 3, 0],
              }}
              transition={{
                duration: 7 + (i % 6) * 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 4) * 0.3,
              }}
            >
              {/* Small bubble structure */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-cyan-200/40 to-blue-300/50" />
                <motion.div
                  className="absolute inset-0 rounded-full opacity-40"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,200,100,0.3) 25%, rgba(150,200,255,0.3) 60%, rgba(200,150,255,0.3) 85%, transparent 100%)'
                  }}
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 10 + i * 1.2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              {/* Highlight */}
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/80 blur-[1px]" />
              {/* Border */}
              <div className="absolute inset-0 rounded-full border border-white/30" />
            </motion.div>
          </motion.div>
        ))}

        {/* Animated Bubble */}
        <motion.div
          onClick={() => {
            navigate('/bubbles-chat');
            setBubbleTapped(true);
          }}
          className="relative z-10 cursor-pointer"
          whileTap={{ scale: 0.95 }}
          whileHover={{ 
            scale: 1.08,
            y: 8,
          }}
          animate={{
            y: [0, -12, 0, -8, 0],
            x: [0, 3, -3, 2, 0],
            rotate: [0, 8, -5, 12, -8, 6, 0],
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
            x: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
        >
          {/* Clean Vector Bubble - No Effects */}
          <motion.div 
            className="relative w-32 h-32"
            animate={{
              scaleX: [1, 1.05, 0.98, 1.02, 1],
              scaleY: [1, 0.98, 1.05, 0.99, 1],
            }}
            transition={{
              duration: 10,
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
            
            {/* Internal Highlight - Small white circle, fully contained */}
            <div 
              className="absolute top-6 left-8 w-8 h-8 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.3)'
              }}
            />
            
            {/* Smaller Highlight Dot */}
            <div 
              className="absolute top-7 left-9 w-4 h-4 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.5)'
              }}
            />
          </motion.div>
        </motion.div>

        {/* Persistent Blinking CTA Text - Only after greeting disappears */}
        {greetingComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0.6, 0.6, 0, 0, 0.6],
            }}
            transition={{
              opacity: { 
                duration: 3.3,
                times: [0, 0.09, 0.85, 0.91, 1],
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 text-sm text-foreground/60 text-center pointer-events-none whitespace-nowrap z-20"
          >
            Tap me and let's chat.
          </motion.p>
        )}

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-20 max-w-[280px] w-full px-4 z-20"
            >
              {toastMessage === "Hi, I'm Bubbles!" ? (
                <p className="text-sm text-foreground text-center">{toastMessage}</p>
              ) : (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-center">
                  <p className="text-sm text-foreground">{toastMessage}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Financial Status */}
      {!hasConnectedFinances ? (
        <Card className="p-6 space-y-4">
          <div className="text-center space-y-3 py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-bold">Connect Your Finances</h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Upload your bank statements or connect via open banking to get personalized insights
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button>
                <LinkIcon className="mr-2 h-4 w-4" />
                Connect via Open Banking
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Statements
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Complete Setup Banner */}
          {showSetupBanner && !hasBankAccount && (
            <Card className="p-4 bg-gradient-to-br from-[#CE424B]/10 via-white dark:via-slate-800 to-[#B02D36]/10 border-2 border-[#CE424B]/40 dark:border-[#CE424B]/60 shadow-lg relative">
              <button
                onClick={() => setShowSetupBanner(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Dismiss setup banner"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="space-y-3 pr-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#CE424B] flex items-center justify-center flex-shrink-0 shadow-md">
                    <Link2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-black dark:text-[rgb(240,243,245)]">Complete Your Setup</h3>
                    <p className="text-xs text-gray-700 dark:text-[rgb(180,185,190)]">Get the most out of PAKO</p>
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-[#CE424B]/20 dark:border-[#CE424B]/40 hover:border-[#CE424B]/50 dark:hover:border-[#CE424B]/70 transition-colors cursor-pointer group"
                  onClick={() => navigate('/finances')}
                >
                  <div className="h-8 w-8 rounded-full border-2 border-[#CE424B]/30 dark:border-[#CE424B]/50 flex items-center justify-center flex-shrink-0">
                    <Circle className="h-4 w-4 text-[#CE424B]/50 dark:text-[#CE424B]/70" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-black dark:text-[rgb(240,243,245)]">Connect a bank account</p>
                    <p className="text-xs text-gray-600 dark:text-[rgb(180,185,190)]">Link your account to track finances</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-[#CE424B] transition-colors" />
                </div>
              </div>
            </Card>
          )}
          
          {/* Top Metrics Row - Four Equal Rectangular Cards */}
          {/* Mobile Carousel View */}
          {isMobile ? (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {/* Slide 1: Monthly Income | Monthly Expenses */}
                  <CarouselItem>
                    <Card className="p-4">
                      <div className="flex items-stretch gap-3">
                        {/* Monthly Income - Left Side */}
                        <div 
                          className="flex-1 space-y-3 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate('/income-details')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-bold text-xs dark:text-[rgb(240,243,245)]">Monthly Income</h3>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                              R{animatedIncome.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">
                              {financialHealth.income > previousMonthData.income ? '+' : ''}
                              R{Math.abs(financialHealth.income - previousMonthData.income).toLocaleString()} from last month
                            </p>
                          </div>
                          <div className="flex items-center justify-start gap-1 text-xs text-green-600 dark:text-[rgb(200,205,210)] cursor-pointer hover:underline">
                            <span>View details</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>

                        {/* Vertical Divider */}
                        <Separator orientation="vertical" className="h-auto" />

                        {/* Monthly Expenses - Right Side */}
                        <div 
                          className="flex-1 space-y-3 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate('/expense-details')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                              <TrendingDown className="h-4 w-4" style={{ color: '#EF1E0E' }} />
                            </div>
                            <h3 className="font-bold text-xs dark:text-[rgb(240,243,245)]">Monthly Expenses</h3>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#EF1E0E' }}>
                              R{animatedExpenses.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">
                              {financialHealth.expenses > previousMonthData.expenses ? '+' : '−'}
                              R{Math.abs(financialHealth.expenses - previousMonthData.expenses).toLocaleString()} from last month
                            </p>
                          </div>
                          <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#EF1E0E' }}>
                            <span>View details</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>

                  {/* Slide 2: Budget Remaining | Total Savings */}
                  <CarouselItem>
                    <Card className="p-4">
                      <div className="flex items-stretch gap-3">
                        {/* Budget Remaining - Left Side */}
                        <div 
                          className="flex-1 space-y-3 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate('/monthly-budget')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(220, 35, 135, 0.1)' }}>
                              <Wallet className="h-4 w-4" style={{ color: '#DC2387' }} />
                            </div>
                            <h3 className="font-bold text-xs dark:text-[rgb(240,243,245)]">Budget Remaining</h3>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#DC2387' }}>
                              R{animatedRemaining.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">
                              R{financialHealth.remaining.toLocaleString()} left to use this month
                            </p>
                          </div>
                          <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#DC2387' }}>
                            <span>View budget</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>

                        {/* Vertical Divider */}
                        <Separator orientation="vertical" className="h-auto" />

                        {/* Total Savings - Right Side */}
                        <div 
                          className="flex-1 space-y-3 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => navigate('/finances')}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 214, 0, 0.1)' }}>
                              <PiggyBank className="h-4 w-4" style={{ color: '#FFD600' }} />
                            </div>
                            <h3 className="font-bold text-xs dark:text-[rgb(240,243,245)]">Total Savings</h3>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#FFD600' }}>
                              R{animatedSavings.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">
                              Total saved so far
                            </p>
                          </div>
                          <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#FFD600' }}>
                            <span>View savings</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
                
                {/* Custom styled navigation buttons */}
                <CarouselPrevious className="left-2 h-7 w-7 border-gray-300 dark:border-gray-600" />
                <CarouselNext className="right-2 h-7 w-7 border-gray-300 dark:border-gray-600" />
              </Carousel>
            </div>
          ) : (
            /* Desktop Grid View */
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Monthly Income */}
            <Card 
              className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
              onClick={() => navigate('/income-details')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-xs md:text-base dark:text-[rgb(240,243,245)]">Monthly Income</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    R{animatedIncome.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">
                    {financialHealth.income > previousMonthData.income ? '+' : ''}
                    R{Math.abs(financialHealth.income - previousMonthData.income).toLocaleString()} from last month
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1 text-xs text-green-600 dark:text-[rgb(200,205,210)] cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); navigate('/income-details'); }}>
                  <span>View details</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Card>

            {/* Monthly Expenses */}
            <Card 
              className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
              onClick={() => navigate('/expense-details')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#EF1E0E' }} />
                  </div>
                  <h3 className="font-bold text-xs md:text-base dark:text-[rgb(240,243,245)]">Monthly Expenses</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-3xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#EF1E0E' }}>
                    R{animatedExpenses.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">
                    {financialHealth.expenses > previousMonthData.expenses ? '+' : '−'}
                    R{Math.abs(financialHealth.expenses - previousMonthData.expenses).toLocaleString()} from last month
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#EF1E0E' }} onClick={(e) => { e.stopPropagation(); navigate('/expense-details'); }}>
                  <span>View details</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Card>

            {/* Budget Remaining */}
            <Card 
              className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group"
              onClick={() => navigate('/monthly-budget')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(220, 35, 135, 0.1)' }}>
                    <Wallet className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#DC2387' }} />
                  </div>
                  <h3 className="font-bold text-xs md:text-base dark:text-[rgb(240,243,245)]">Budget Remaining</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-3xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#DC2387' }}>
                    R{animatedRemaining.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">
                    R{financialHealth.remaining.toLocaleString()} left to use this month
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#DC2387' }} onClick={(e) => { e.stopPropagation(); navigate('/monthly-budget'); }}>
                  <span>View budget</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Card>

            {/* Total Savings */}
            <Card 
              className="p-4 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              onClick={() => navigate('/finances')}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 214, 0, 0.1)' }}>
                    <PiggyBank className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#FFD600' }} />
                  </div>
                  <h3 className="font-bold text-xs md:text-base dark:text-[rgb(240,243,245)]">Total Savings</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-3xl font-bold dark:text-[rgb(240,243,245)]" style={{ color: '#FFD600' }}>
                    R{animatedSavings.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">
                    Total saved so far
                  </p>
                </div>
                <div className="flex items-center justify-start gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#FFD600' }} onClick={(e) => { e.stopPropagation(); navigate('/finances'); }}>
                  <span>View savings</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </Card>
            </div>
          )}

          {/* Secondary Row - Financial Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Financial Health Score - 2/3 */}
            <Card className="lg:col-span-2 p-3 md:p-5 space-y-2 md:space-y-3 hover:shadow-lg transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-base md:text-lg dark:text-[rgb(240,243,245)]">Financial Health Score</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-xs dark:text-[rgb(180,185,190)]">On track</p>
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary dark:text-[rgb(200,205,210)]">improving</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold text-primary dark:text-[rgb(240,243,245)]">{animatedHealthScore}</div>
                  <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">/100</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${healthScoreProgress}%` }}
                />
              </div>
              
              <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)] pt-0 md:pt-1">
                You're doing great! Your financial health has improved this month.
              </p>
            </Card>

            {/* Credit Score - 1/3 */}
            <Card 
              className="p-3 md:p-5 flex flex-col items-center justify-center space-y-1 md:space-y-2 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate('/finances')}
            >
              <h3 className="font-bold text-sm md:text-[15px] self-start w-full dark:text-[rgb(240,243,245)]">Credit Score</h3>
              
              {/* Circular Progress Indicator */}
              <div className="relative flex items-center justify-center flex-1 py-2 md:py-0">
                <svg className="w-20 h-20 md:w-28 md:h-28 -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  
                  {/* Progress circle - animated */}
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="text-primary transition-all duration-700 ease-out"
                    strokeDasharray="327"
                    strokeDashoffset={327 - (327 * (creditScoreProgress / mockUser.creditScore.maxScore))}
                  />
                </svg>
                
                {/* Score in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl md:text-3xl font-bold dark:text-[rgb(240,243,245)]">{animatedCreditScore}</div>
                  <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">/ {mockUser.creditScore.maxScore}</p>
                </div>
              </div>
              
              {/* Rating label */}
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <p className="text-xs font-medium text-primary dark:text-[rgb(200,205,210)]">{mockUser.creditScore.rating}</p>
              </div>
              
              <div className="flex items-center justify-start gap-1 text-xs text-primary dark:text-[rgb(200,205,210)] cursor-pointer hover:underline w-full" onClick={(e) => { e.stopPropagation(); navigate('/finances'); }}>
                <span>View details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Card>
          </div>

          {/* Rewards Section */}
          <div className="space-y-3 pt-2">
            <h2 className="font-bold text-lg dark:text-[rgb(240,243,245)]">Rewards</h2>
            
            {/* Compact Rewards Summary Container with Learning Hub Background */}
            <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:bg-[linear-gradient(to_bottom_right,rgb(18,16,10),rgb(16,15,12),rgb(17,16,11))] shadow-sm border-primary/10">
              {/* Floating Bubbles Background - Same as Learning Hub */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Bubble 1 - Dark Teal (#2F7F7A) - Top Right */}
                <div 
                  className="absolute rounded-full blur-[108px]"
                  style={{
                    width: '280px',
                    height: '280px',
                    top: '-10%',
                    right: '10%',
                    background: 'rgba(47, 127, 122, 0.30)',
                    animation: openRewardPopup && !closingRewardPopup
                      ? 'bubblePopOut 0.3s ease-out forwards'
                      : closingRewardPopup
                      ? 'bubblePopIn 0.3s ease-out forwards'
                      : 'bubbleFloat1 20s ease-in-out infinite',
                  }}
                />
                
                {/* Bubble 2 - Bright Blue (#0B6AC5) - Bottom Left */}
                <div 
                  className="absolute rounded-full blur-[118px]"
                  style={{
                    width: '320px',
                    height: '320px',
                    bottom: '-15%',
                    left: '5%',
                    background: 'rgba(11, 106, 197, 0.30)',
                    animation: openRewardPopup && !closingRewardPopup
                      ? 'bubblePopOut 0.3s ease-out forwards'
                      : closingRewardPopup
                      ? 'bubblePopIn 0.3s ease-out forwards'
                      : 'bubbleFloat2 25s ease-in-out infinite',
                  }}
                />
                
                {/* Bubble 3 - Dark Teal (#2F7F7A) - Center Right */}
                <div 
                  className="absolute rounded-full blur-[104px]"
                  style={{
                    width: '260px',
                    height: '260px',
                    top: '45%',
                    right: '-5%',
                    background: 'rgba(47, 127, 122, 0.30)',
                    animation: openRewardPopup && !closingRewardPopup
                      ? 'bubblePopOut 0.3s ease-out forwards'
                      : closingRewardPopup
                      ? 'bubblePopIn 0.3s ease-out forwards'
                      : 'bubbleFloat3 22s ease-in-out infinite',
                  }}
                />
              </div>
              
              {/* Two Horizontal Subcontainers */}
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left: Your Reward Balance with Circular Progress */}
                <div 
                  className="p-5 bg-background/70 dark:bg-slate-800/70 rounded-xl border border-primary/10 dark:border-primary/20 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    setOpenRewardPopup('balance');
                    setClosingRewardPopup(false);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700 dark:text-[rgb(180,185,190)] uppercase tracking-wide">Your Reward Balance</p>
                      <p className="text-3xl font-bold text-foreground dark:text-[rgb(240,243,245)]">{animatedRewardProgress}</p>
                      <p className="text-xs text-slate-600 dark:text-[rgb(180,185,190)]">total points</p>
                    </div>
                    
                    {/* Circular Progress Indicator */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-muted/20"
                        />
                        
                        {/* Progress circle - animated on page load */}
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeLinecap="round"
                          className="text-primary transition-all duration-800 ease-out"
                          strokeDasharray="264"
                          strokeDashoffset={264 - (264 * (animatedRewardProgress / 2000))}
                        />
                      </svg>
                      
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Rewards Progress (Next Reward) */}
                <div 
                  className="p-5 bg-background/70 dark:bg-slate-800/70 rounded-xl border border-primary/10 dark:border-primary/20 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    setOpenRewardPopup('progress');
                    setClosingRewardPopup(false);
                    document.body.style.overflow = 'hidden';
                  }}
                >
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-700 dark:text-[rgb(180,185,190)] uppercase tracking-wide">Next Reward</p>
                    
                    {(() => {
                      const nextReward = rewardsData
                        .filter(reward => mockUser.points < reward.points)
                        .sort((a, b) => a.points - b.points)[0];
                      
                      if (!nextReward) {
                        return <p className="text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">All rewards unlocked! 🎉</p>;
                      }
                      
                      const pointsNeeded = nextReward.points - mockUser.points;
                      const progress = (mockUser.points / nextReward.points) * 100;
                      
                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gift className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium dark:text-[rgb(240,243,245)]">{nextReward.name}</span>
                            </div>
                            <span className="text-xs text-slate-600 dark:text-[rgb(180,185,190)]">{nextReward.points} pts</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[rgb(180,185,190)]">
                              <span>{pointsNeeded} points to go</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              {/* View all rewards link */}
              <div className="relative flex items-center justify-start gap-1 text-xs text-primary dark:text-[rgb(200,205,210)] mt-4 cursor-pointer hover:underline" onClick={() => navigate('/rewards')}>
                <span>View all rewards</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Card>
          </div>

          {/* Quick Actions Section */}
          <div className="space-y-3 pt-2">
            <h2 className="font-bold text-lg dark:text-[rgb(240,243,245)]">Quick Actions</h2>
            
            {/* Row 1: Continue Learning (1/3) + Invest Now (2/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Continue Learning - 1/3 width */}
              <Card 
                className="p-5 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
                onClick={() => navigate('/learning')}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-[15px] dark:text-[rgb(240,243,245)]">Continue Learning</h3>
                  </div>
                  
                  {(() => {
                    const currentCourse = mockCourses.find(c => c.progress > 0 && c.progress < 100);
                    return currentCourse ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium line-clamp-2 dark:text-[rgb(240,243,245)]">{currentCourse.title}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">{currentCourse.progress}% complete</p>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${currentCourse.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground dark:text-[rgb(180,185,190)]">Start a course to begin learning</p>
                    );
                  })()}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-primary dark:text-[rgb(200,205,210)] pt-3 cursor-pointer hover:underline">
                  <span>Continue</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Card>

              {/* Invest Now - 2/3 width */}
              <Card 
                className="lg:col-span-2 p-5 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
                onClick={() => navigate('/investments')}>
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Half - ETF & Unit Trusts */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-[15px] mb-3 dark:text-[rgb(240,243,245)]">Your Investments</h3>
                    
                    {/* ETF */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <TrendingUpIcon className="h-3.5 w-3.5 text-secondary" />
                        <p className="text-xs font-semibold dark:text-[rgb(240,243,245)]">Your ETF</p>
                      </div>
                      <div className="pl-5">
                        <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">{mockInvestmentData.etf.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold dark:text-[rgb(240,243,245)]">R{mockInvestmentData.etf.value.toLocaleString()}</p>
                          <div className="flex items-center gap-0.5">
                            <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                            <span className="text-xs text-green-600 dark:text-[rgb(160,190,160)]">
                              +{mockInvestmentData.etf.change}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unit Trusts */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <TrendingUpIcon className="h-3.5 w-3.5 text-secondary" />
                        <p className="text-xs font-semibold dark:text-[rgb(240,243,245)]">Your Unit Trusts</p>
                      </div>
                      <div className="pl-5 space-y-1">
                        {mockInvestmentData.unitTrusts.map((trust) => (
                          <div key={trust.id} className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">{trust.name}</p>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-medium dark:text-[rgb(240,243,245)]">R{trust.value.toLocaleString()}</span>
                              {trust.change >= 0 ? (
                                <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                              ) : (
                                <TrendingDown className="h-2.5 w-2.5 text-orange-500" />
                              )}
                              <span className={`text-xs ${trust.change >= 0 ? 'text-green-600 dark:text-[rgb(160,190,160)]' : 'text-orange-600 dark:text-[rgb(200,150,130)]'}`}>
                                {trust.change >= 0 ? '+' : ''}{trust.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Half - Insurance Policies */}
                  <div className="space-y-3 border-l border-border pl-4">
                    <h3 className="font-bold text-[15px] mb-3 dark:text-[rgb(240,243,245)]">Insurance Policies</h3>
                    
                    <div className="space-y-2">
                      {mockInvestmentData.insurancePolicies.map((policy) => (
                        <div key={policy.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold dark:text-[rgb(240,243,245)]">{policy.name}</p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">{policy.provider}</p>
                          </div>
                          <span className="text-xs font-medium dark:text-[rgb(240,243,245)]">R{policy.premium}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-start gap-1 text-xs text-primary dark:text-[rgb(200,205,210)] mt-4 cursor-pointer hover:underline" onClick={() => navigate('/investments')}>
                  <span>Explore investments</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Card>
            </div>

            {/* Row 2: Goals & To-Dos (2/3) + Bubbles Insights (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Goals & To-Dos - 2/3 width */}
              <Card className="lg:col-span-2 p-5 hover:shadow-lg hover:scale-[1.01] transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Left Half - Goals */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-[15px] dark:text-[rgb(240,243,245)]">Goals</h3>
                    </div>
                    
                    <div className="space-y-2.5">
                      {goalsData.slice(0, 2).map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                          <div key={goal.id} className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium dark:text-[rgb(240,243,245)]">{goal.title}</p>
                              <span className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">
                              <span>R{goal.currentAmount.toLocaleString()}</span>
                              <span>R{goal.targetAmount.toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vertical Divider - hidden on mobile */}
                  <div className="hidden md:block border-l border-border" />

                  {/* Right Half - To-Dos */}
                  <div className="flex-1 space-y-3 md:pl-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ListTodo className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-bold text-[15px] dark:text-[rgb(240,243,245)]">To-Dos</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {todosData.slice(0, 3).map((todo) => (
                        <div 
                          key={todo.id} 
                          className="flex items-start gap-2 cursor-pointer hover:bg-muted/30 p-1.5 rounded-md transition-colors"
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {todo.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium dark:text-[rgb(240,243,245)] ${todo.completed ? 'line-through text-muted-foreground dark:text-[rgb(180,185,190)]' : ''}`}>
                              {todo.title}
                            </p>
                            {!todo.completed && (
                              <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)] mt-0.5">
                                Due: {new Date(todo.dueDate).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                </div>
                
                {/* View all link - at bottom left of entire container */}
                <div 
                  className="flex items-center gap-1 text-xs text-primary dark:text-[rgb(200,205,210)] mt-4 cursor-pointer hover:underline"
                  onClick={() => navigate('/goals-and-todos')}
                >
                  <span>View all</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </Card>

              {/* Bubbles Insights - 1/3 width */}
              <Card className="p-5 relative overflow-hidden transition-all">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-[15px] dark:text-[rgb(240,243,245)]">Bubbles Suggests</h3>
                  </div>
                  
                  {/* Show first uncompleted suggestion */}
                  {(() => {
                    const suggestion = bubblesSuggestions.find(s => !s.completed);
                    if (!suggestion) {
                      return (
                        <div className="text-center py-4">
                          <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)]">All set! You're doing great! 🎉</p>
                        </div>
                      );
                    }

                    const IconComponent = suggestion.icon === 'Target' ? Target : 
                                        suggestion.icon === 'Bell' ? Bell : 
                                        suggestion.icon === 'User' ? User : Target;

                    return (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <IconComponent className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold dark:text-[rgb(240,243,245)]">{suggestion.title}</p>
                            <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)] mt-1">{suggestion.description}</p>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full cursor-pointer"
                          onClick={() => navigate(suggestion.actionRoute)}
                        >
                          {suggestion.actionText}
                        </Button>
                        
                        {/* Progress indicator */}
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground dark:text-[rgb(180,185,190)] text-center">
                            {bubblesSuggestions.filter(s => s.completed).length} of {bubblesSuggestions.length} completed
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {/* Bank Connection Dialog for New Users */}
      <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
        <DialogContent className="sm:max-w-[462px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LinkIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground dark:text-[rgb(180,185,190)] font-medium mb-1">
              One more step
            </p>
            <DialogTitle className="text-center text-2xl dark:text-[rgb(240,243,245)]">
              Connect Your Bank Account
            </DialogTitle>
            <DialogDescription className="text-center pt-1 dark:text-[rgb(200,205,210)]">
              Link your bank account to unlock personalized insights, track your spending, and reach your financial goals faster.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-[rgb(240,243,245)]">Read-only Access</h4>
                <p className="text-sm text-muted-foreground dark:text-[rgb(200,205,210)]">We have read-only visibility of your financial data, we can't access or control your accounts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-[rgb(240,243,245)]">Bank-Level Security</h4>
                <p className="text-sm text-muted-foreground dark:text-[rgb(200,205,210)]">Your data is protected by bank-level encryption and advanced security.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-[rgb(240,243,245)]">AI-Powered Insights</h4>
                <p className="text-sm text-muted-foreground dark:text-[rgb(200,205,210)]">Powered by AI to provide smart, personalized insights.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255, 214, 0, 0.15)' }}>
                <PiggyBank className="h-5 w-5" style={{ color: '#FFD600' }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-[rgb(240,243,245)]">Goal Tracking</h4>
                <p className="text-sm text-muted-foreground dark:text-[rgb(200,205,210)]">Actionable insights and goal tracking to help you reach your financial goals.</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleConnectBank} className="w-full">
              <LinkIcon className="mr-2 h-4 w-4" />
              Connect Now
            </Button>
            <Button variant="ghost" onClick={handleMaybeLater} className="w-full">
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}