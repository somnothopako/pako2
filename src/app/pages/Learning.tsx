import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { BubblesIcon } from '@/app/components/BubblesIcon';
import { 
  BookOpen, 
  Library, 
  Play, 
  CheckCircle2,
  Lock,
  Flame,
  TrendingUp,
  Trophy,
  Wallet,
  PiggyBank,
  TrendingUpIcon,
  AlertCircle,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { mockCourses, learningProgress } from '@/app/data/mockData';
import { useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useBubbles } from '@/app/contexts/BubblesContext';

// Custom hook for count-up animation
function useCountUp(end: number, duration: number = 1200, decimals: number = 0) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quad for subtle settling at the end
      const easeOutQuad = 1 - (1 - percentage) * (1 - percentage);
      
      const currentCount = easeOutQuad * end;
      setCount(currentCount);

      if (percentage < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at exactly the target value
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, duration]);

  return decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
}

// Helper function to get icon for each category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Budgeting':
      return Wallet;
    case 'Saving':
      return PiggyBank;
    case 'Investing':
      return TrendingUpIcon;
    case 'Debt Management':
      return AlertCircle;
    default:
      return BookOpen;
  }
};

// Helper function to get category heading
const getCategoryHeading = (category: string) => {
  return `Learning about ${category}`;
};

// Animated Icon Component for smooth icon transitions
const AnimatedButtonIcon = ({ 
  defaultIcon: DefaultIcon, 
  hoverIcon: HoverIcon 
}: { 
  defaultIcon: React.ElementType; 
  hoverIcon: React.ElementType;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <span 
      className="relative inline-flex mr-2 h-4 w-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <DefaultIcon 
        className={`absolute h-4 w-4 transition-all duration-200 ${
          isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`} 
      />
      <HoverIcon 
        className={`absolute h-4 w-4 transition-all duration-200 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`} 
      />
    </span>
  );
};

export function Learning() {
  const navigate = useNavigate();
  const { setIsModalOpen } = useBubbles();
  const [activeTab, setActiveTab] = useState<'all' | 'started' | 'completed' | 'not-started'>('all');
  const [expandedStat, setExpandedStat] = useState<'completion' | 'streak' | 'progress' | 'points'>('completion');
  const [openPopup, setOpenPopup] = useState<'completion' | 'streak' | 'progress' | 'points' | null>(null);
  const [closingPopup, setClosingPopup] = useState(false);

  // Animated count-up values
  const completionPercentage = useCountUp(Math.round((learningProgress.completedLessons / learningProgress.totalLessons) * 100));
  const streakDays = useCountUp(learningProgress.streak);
  const coursesInProgress = useCountUp(learningProgress.coursesInProgress);
  const pointsEarned = useCountUp(learningProgress.pointsEarned);

  // Update global modal state when popup opens/closes
  useEffect(() => {
    setIsModalOpen(!!openPopup);
  }, [openPopup, setIsModalOpen]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStatHover = (stat: 'completion' | 'streak' | 'progress' | 'points') => {
    if (expandedStat === stat) {
      // Reset to default if hovering over already expanded
      setExpandedStat('completion');
    } else {
      setExpandedStat(stat);
    }
  };

  const handleStatClick = (stat: 'completion' | 'streak' | 'progress' | 'points') => {
    setOpenPopup(stat);
    setClosingPopup(false);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleClosePopup = () => {
    // Trigger fade-out animation
    setClosingPopup(true);
    
    // Wait for animation to complete before removing popup
    setTimeout(() => {
      setOpenPopup(null);
      setClosingPopup(false);
      // Restore background scrolling
      document.body.style.overflow = '';
    }, 300); // Match fade-out duration
  };

  // Popup content configuration
  const getPopupConfig = (stat: 'completion' | 'streak' | 'progress' | 'points') => {
    switch (stat) {
      case 'completion':
        return {
          icon: TrendingUp,
          iconColor: 'text-green-600 dark:text-green-400',
          iconBg: 'bg-green-500/20',
          title: 'Completion Rate',
          mainValue: `${completionPercentage}%`,
          subtitle: `${learningProgress.completedLessons} of ${learningProgress.totalLessons} lessons completed`,
          insight: "You're in the top 25% of learners on PAKO!",
          details: "Keep up the great work! You're making excellent progress on your financial learning journey.",
          bgGradient: 'from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10',
          borderColor: 'border-green-300 dark:border-green-700',
          iconAnimation: '',
        };
      case 'streak':
        return {
          icon: Flame,
          iconColor: 'text-orange-600 dark:text-orange-400',
          iconBg: 'bg-orange-500/20',
          title: 'Learning Streak',
          mainValue: `${streakDays}`,
          subtitle: 'days in a row',
          insight: `Best streak: 12 days`,
          details: "Learning consistently helps build lasting financial habits. You're doing amazing!",
          bgGradient: 'from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10',
          borderColor: 'border-orange-300 dark:border-orange-700',
          iconAnimation: 'group-hover:rotate-12',
        };
      case 'progress':
        return {
          icon: BookOpen,
          iconColor: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-500/20',
          title: 'Courses In Progress',
          mainValue: `${coursesInProgress}`,
          subtitle: 'courses active',
          insight: 'Average completion: 40%',
          details: "You're actively learning across multiple topics. This balanced approach helps build comprehensive financial knowledge.",
          bgGradient: 'from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10',
          borderColor: 'border-blue-300 dark:border-blue-700',
          iconAnimation: '',
        };
      case 'points':
        return {
          icon: Trophy,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          title: 'Points Earned',
          mainValue: `${pointsEarned}`,
          subtitle: 'total points',
          insight: '150 points until your next reward',
          details: "Every lesson you complete brings you closer to exciting rewards. Keep learning to unlock more!",
          bgGradient: 'from-yellow-50 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-900/10',
          borderColor: 'border-yellow-300 dark:border-yellow-700',
          iconAnimation: 'group-hover:rotate-12',
        };
    }
  };

  // Sort courses for the Courses tab
  const sortedCoursesForTab = () => {
    // Separate courses into started and not started
    const startedCourses = mockCourses.filter(course => course.progress > 0 && course.progress < 100);
    const notStartedCourses = mockCourses.filter(course => course.progress === 0);

    // Sort started courses by progress descending (highest to lowest)
    const sortedStarted = startedCourses.sort((a, b) => b.progress - a.progress);

    // Sort not started courses alphabetically by title
    const sortedNotStarted = notStartedCourses.sort((a, b) => a.title.localeCompare(b.title));

    return { startedCourses: sortedStarted, notStartedCourses: sortedNotStarted };
  };

  // Sort completed courses by completion date (latest to oldest)
  const sortedCompletedCourses = mockCourses
    .filter(course => course.progress === 100)
    .sort((a, b) => {
      // Sort by completedDate descending (latest first)
      const dateA = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const dateB = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className={`px-4 py-6 space-y-6 max-w-6xl mx-auto ${openPopup ? 'pointer-events-none' : ''}`}>
      {/* Enhanced Animation Keyframes for Noticeable Bubble Motion */}
      <style>{`
        @keyframes bubbleFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -25px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }
        
        @keyframes bubbleFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-35px, 30px) scale(1.08);
          }
        }
        
        @keyframes bubbleFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          40% {
            transform: translate(25px, 30px) scale(0.93);
          }
          80% {
            transform: translate(-15px, -20px) scale(1.06);
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
      `}</style>
      
      {/* Learning Summary Container - Redesigned */}
      <Card className="relative overflow-hidden p-8 bg-white dark:bg-[linear-gradient(to_bottom_right,rgb(12,20,19),rgb(14,19,23),rgb(12,19,21))] shadow-lg border-primary/10">
        {/* Floating Bubbles - Fun and Dynamic Background */}
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
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
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
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
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
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
                ? 'bubblePopIn 0.3s ease-out forwards'
                : 'bubbleFloat3 22s ease-in-out infinite',
            }}
          />
        </div>
        
        <div className="relative space-y-6">
          {/* Header with visual anchor */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Abstract icon cluster */}
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Learning Hub</h1>
              <p className="text-sm md:text-base text-[#0F3D3E] dark:text-[rgb(240,243,245)]">Build your financial knowledge and earn points</p>
            </div>
          </div>

          {/* Floating stat pills with varying sizes */}
          <div className="hidden lg:flex gap-4 h-[180px] overflow-hidden">
            {/* Completion Rate */}
            <div 
              className="group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden"
              style={{ 
                width: expandedStat === 'completion' ? '40%' : '20%',
              }}
              onMouseEnter={() => handleStatHover('completion')}
              onClick={() => handleStatClick('completion')}
            >
              <div className="h-full px-5 py-4 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl border-2 border-green-300 dark:border-green-700 backdrop-blur-sm overflow-hidden">
                <div className={`flex gap-4 h-full ${expandedStat === 'completion' ? 'flex-row items-center' : 'flex-col'}`}>
                  {/* Left side - Original content */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center transition-transform duration-500 ease-out ${expandedStat === 'completion' ? 'scale-110' : 'scale-100'}`}>
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Completion Rate</p>
                      <p className="text-3xl font-bold text-foreground">
                        {completionPercentage}%
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{learningProgress.completedLessons} of {learningProgress.totalLessons} lessons</p>
                    </div>
                  </div>
                  
                  {/* Vertical divider and expanded insight */}
                  {expandedStat === 'completion' && (
                    <>
                      <div className="w-px bg-green-300/40 dark:bg-green-700/40 self-stretch flex-shrink-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.1s_forwards]" />
                      <div className="flex items-center flex-1 min-w-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.2s_forwards]">
                        <p className="text-xs text-muted-foreground">
                          You're in the top 25% of learners
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Learning Streak */}
            <div 
              className="group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden"
              style={{ 
                width: expandedStat === 'streak' ? '40%' : '20%',
              }}
              onMouseEnter={() => handleStatHover('streak')}
              onClick={() => handleStatClick('streak')}
            >
              <div className="h-full px-5 py-4 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 rounded-2xl border-2 border-orange-300 dark:border-orange-700 backdrop-blur-sm overflow-hidden">
                <div className={`flex gap-4 h-full ${expandedStat === 'streak' ? 'flex-row items-center' : 'flex-col'}`}>
                  {/* Left side - Original content */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center transition-transform duration-500 ease-out ${expandedStat === 'streak' ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                      <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Streak</p>
                      <p className="text-3xl font-bold text-foreground">{streakDays}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">days in a row</p>
                    </div>
                  </div>
                  
                  {/* Vertical divider and expanded insight */}
                  {expandedStat === 'streak' && (
                    <>
                      <div className="w-px bg-orange-300/40 dark:bg-orange-700/40 self-stretch flex-shrink-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.1s_forwards]" />
                      <div className="flex items-center flex-1 min-w-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.2s_forwards]">
                        <p className="text-xs text-muted-foreground">
                          Best streak: 12 days
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div 
              className="group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden"
              style={{ 
                width: expandedStat === 'progress' ? '40%' : '20%',
              }}
              onMouseEnter={() => handleStatHover('progress')}
              onClick={() => handleStatClick('progress')}
            >
              <div className="h-full px-5 py-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border-2 border-blue-300 dark:border-blue-700 backdrop-blur-sm overflow-hidden">
                <div className={`flex gap-4 h-full ${expandedStat === 'progress' ? 'flex-row items-center' : 'flex-col'}`}>
                  {/* Left side - Original content */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center transition-transform duration-500 ease-out ${expandedStat === 'progress' ? 'scale-110' : 'scale-100'}`}>
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">In Progress</p>
                      <p className="text-3xl font-bold text-foreground">{coursesInProgress}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">courses active</p>
                    </div>
                  </div>
                  
                  {/* Vertical divider and expanded insight */}
                  {expandedStat === 'progress' && (
                    <>
                      <div className="w-px bg-blue-300/40 dark:bg-blue-700/40 self-stretch flex-shrink-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.1s_forwards]" />
                      <div className="flex items-center flex-1 min-w-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.2s_forwards]">
                        <p className="text-xs text-muted-foreground">
                          Avg. completion: 40%
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Points Earned */}
            <div 
              className="group relative cursor-pointer transition-all duration-500 ease-out overflow-hidden"
              style={{ 
                width: expandedStat === 'points' ? '40%' : '20%',
              }}
              onMouseEnter={() => handleStatHover('points')}
              onClick={() => handleStatClick('points')}
            >
              <div className="h-full px-5 py-4 bg-gradient-to-br from-yellow-50 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 backdrop-blur-sm overflow-hidden">
                <div className={`flex gap-4 h-full ${expandedStat === 'points' ? 'flex-row items-center' : 'flex-col'}`}>
                  {/* Left side - Original content */}
                  <div className="flex flex-col gap-3 flex-shrink-0">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center transition-transform duration-500 ease-out ${expandedStat === 'points' ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                      <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap">Points</p>
                      <p className="text-3xl font-bold text-foreground">{pointsEarned}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">total earned</p>
                    </div>
                  </div>
                  
                  {/* Vertical divider and expanded insight */}
                  {expandedStat === 'points' && (
                    <>
                      <div className="w-px bg-yellow-300/40 dark:bg-yellow-700/40 self-stretch flex-shrink-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.1s_forwards]" />
                      <div className="flex items-center flex-1 min-w-0 opacity-0 animate-[fadeIn_0.3s_ease-out_0.2s_forwards]">
                        <p className="text-xs text-muted-foreground">
                          150 pts until next reward
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet - Keep original grid layout */}
          <div className="grid grid-cols-2 lg:hidden gap-4">
            {/* Completion Rate */}
            <div className="group relative">
              <div className="h-full px-5 py-4 bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 rounded-2xl border-2 border-green-300 dark:border-green-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completion Rate</p>
                    <p className="text-3xl font-bold text-foreground">
                      {completionPercentage}%
                    </p>
                    <p className="text-xs text-muted-foreground">{learningProgress.completedLessons} of {learningProgress.totalLessons} lessons</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Streak */}
            <div className="group relative">
              <div className="h-full px-5 py-4 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 rounded-2xl border-2 border-orange-300 dark:border-orange-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Streak</p>
                    <p className="text-3xl font-bold text-foreground">{streakDays}</p>
                    <p className="text-xs text-muted-foreground">days in a row</p>
                  </div>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="group relative">
              <div className="h-full px-5 py-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border-2 border-blue-300 dark:border-blue-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">In Progress</p>
                    <p className="text-3xl font-bold text-foreground">{coursesInProgress}</p>
                    <p className="text-xs text-muted-foreground">courses active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Points Earned */}
            <div className="group relative">
              <div className="h-full px-5 py-4 bg-gradient-to-br from-yellow-50 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                <div className="flex flex-col gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Points</p>
                    <p className="text-3xl font-bold text-foreground">{pointsEarned}</p>
                    <p className="text-xs text-muted-foreground">total earned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Bubbles Insight */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
        <div className="flex items-start gap-3">
          {/* Bubbles Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <BubblesIcon />
          </div>
          
          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-primary">Bubbles Insight</h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're close to finishing <span 
                className="text-foreground font-medium hover:underline cursor-pointer"
                onClick={() => navigate('/learning/budgeting')}
              >
                Budgeting Basics
              </span>. Want to wrap it up? Just one more lesson to go!
            </p>
            
            {/* Optional: Recommended lessons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => navigate('/learning/budgeting')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-xs font-medium"
              >
                <BookOpen className="h-3 w-3" />
                <span>Emergency Fund Basics</span>
                <span className="text-muted-foreground">· 15 pts</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="group hover:text-primary transition-colors duration-200" onClick={() => setActiveTab('courses')}>
            <BookOpen className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="completed" className="group hover:text-primary transition-colors duration-200" onClick={() => setActiveTab('completed')}>
            <CheckCircle2 className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="resources" className="group hover:text-primary transition-colors duration-200" onClick={() => setActiveTab('resources')}>
            <Library className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedCoursesForTab().startedCourses.map((course) => {
              const CategoryIcon = getCategoryIcon(course.category);
              return (
                <Card 
                  key={course.id} 
                  className="p-6 flex flex-col min-h-[280px] hover:shadow-lg transition-shadow cursor-pointer [&_::selection]:bg-primary/20 [&_::selection]:text-primary"
                  onClick={() => navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`)}
                >
                  {/* Top Section - Flexible Text Content */}
                  <div className="flex-1 min-h-0">
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Icon + Heading */}
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CategoryIcon className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-bold text-sm md:text-base">{course.category}</h3>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      </div>
                      <Badge variant={course.progress === 100 ? 'default' : 'secondary'} className="flex-shrink-0 bg-primary text-primary-foreground">
                        {course.progress === 100 ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : null}
                        {course.progress}%
                      </Badge>
                    </div>
                  </div>

                  {/* Bottom Fixed Action Zone - Progression Bar + Button */}
                  <div className="space-y-4 pt-4">
                    {/* Progression Bar - Pinned above button */}
                    <div className="space-y-2 mt-[-5px] mr-[0px] mb-[60px] ml-[0px]">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{course.completedLessons} of {course.lessons} lessons</span>
                        <span>{course.pointsReward} points</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Button - Fixed anchor point */}
                    <Button 
                      className="w-full hover:bg-primary/90 dark:hover:bg-primary/90 group text-[11px]" 
                      variant={course.progress === 100 ? 'outline' : 'default'}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`);
                      }}
                    >
                      {course.progress === 0 ? (
                        <>
                          <span className="relative inline-flex mr-2 h-4 w-4">
                            <Play className="absolute h-4 w-4 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75" />
                            <ChevronRight className="absolute h-4 w-4 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                          </span>
                          Start Course
                        </>
                      ) : course.progress === 100 ? (
                        <>
                          <span className="relative inline-flex mr-2 h-4 w-4">
                            <CheckCircle2 className="absolute h-4 w-4 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75" />
                            <ChevronRight className="absolute h-4 w-4 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                          </span>
                          Review Course
                        </>
                      ) : (
                        <>
                          <span className="relative inline-flex mr-2 h-4 w-4">
                            <Play className="absolute h-4 w-4 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75" />
                            <ChevronRight className="absolute h-4 w-4 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                          </span>
                          Continue Learning
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Divider and Heading for Not Started Courses */}
          {sortedCoursesForTab().notStartedCourses.length > 0 && (
            <>
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border" />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
                  <span className="text-sm font-medium text-muted-foreground">Not Started Yet</span>
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {sortedCoursesForTab().notStartedCourses.map((course) => {
                  const CategoryIcon = getCategoryIcon(course.category);
                  return (
                    <Card 
                      key={course.id} 
                      className="p-6 flex flex-col min-h-[280px] hover:shadow-lg transition-shadow cursor-pointer [&_::selection]:bg-primary/20 [&_::selection]:text-primary"
                      onClick={() => navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`)}
                    >
                      {/* Top Section - Flexible Text Content */}
                      <div className="flex-1 min-h-0">
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-2 flex-1 min-w-0">
                            {/* Icon + Heading */}
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <CategoryIcon className="h-4 w-4 text-primary" />
                              </div>
                              <h3 className="font-bold text-sm md:text-base">{course.category}</h3>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          </div>
                          <Badge variant={course.progress === 100 ? 'default' : 'secondary'} className="flex-shrink-0 bg-primary text-primary-foreground">
                            {course.progress === 100 ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : null}
                            {course.progress}%
                          </Badge>
                        </div>
                      </div>

                      {/* Bottom Fixed Action Zone - Progression Bar + Button */}
                      <div className="space-y-4 pt-4">
                        {/* Progression Bar - Pinned above button */}
                        <div className="space-y-2 mt-[-5px] mr-[0px] mb-[60px] ml-[0px]">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.completedLessons} of {course.lessons} lessons</span>
                            <span>{course.pointsReward} points</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        {/* Button - Fixed anchor point */}
                        <Button 
                          className="w-full hover:bg-primary/90 dark:hover:bg-primary/90 group" 
                          variant={course.progress === 100 ? 'outline' : 'default'}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`);
                          }}
                        >
                          <span className="relative inline-flex mr-2 h-4 w-4">
                            <Play className="absolute h-4 w-4 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75" />
                            <ChevronRight className="absolute h-4 w-4 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                          </span>
                          Start Course
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        {/* Completed Courses Tab */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedCompletedCourses.length > 0 ? (
              sortedCompletedCourses.map((course) => {
                const CategoryIcon = getCategoryIcon(course.category);
                return (
                  <Card 
                    key={course.id} 
                    className="p-6 flex flex-col min-h-[280px] hover:shadow-lg transition-shadow cursor-pointer [&_::selection]:bg-primary/20 [&_::selection]:text-primary completed-course-card relative overflow-visible"
                    onClick={() => navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`)}
                  >
                    {/* Top Section - Flexible Text Content */}
                    <div className="flex-1 min-h-0">
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-2 flex-1 min-w-0">
                          {/* Icon + Heading */}
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <CategoryIcon className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="font-bold text-sm md:text-base">{course.category}</h3>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                        </div>
                        <Badge variant="default" className="flex-shrink-0 bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {course.progress}%
                        </Badge>
                      </div>
                    </div>

                    {/* Bottom Fixed Action Zone - Progression Bar + Button */}
                    <div className="space-y-4 pt-4">
                      {/* Progression Bar - Pinned above button */}
                      <div className="space-y-2 mt-[-5px] mr-[0px] mb-[60px] ml-[0px]">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{course.completedLessons} of {course.lessons} lessons</span>
                          <span>{course.pointsReward} points</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {/* Button - Fixed anchor point */}
                      <Button 
                        className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors group" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/learning/${course.category.toLowerCase().replace(' ', '-')}`);
                        }}
                      >
                        <span className="relative inline-flex mr-2 h-4 w-4">
                          <CheckCircle2 className="absolute h-4 w-4 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75" />
                          <ChevronRight className="absolute h-4 w-4 transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100" />
                        </span>
                        Review Course
                      </Button>
                    </div>

                    {/* Confetti Container */}
                    <div className="confetti-container">
                      <div className="confetti confetti-1"></div>
                      <div className="confetti confetti-2"></div>
                      <div className="confetti confetti-3"></div>
                      <div className="confetti confetti-4"></div>
                      <div className="confetti confetti-5"></div>
                      <div className="confetti confetti-6"></div>
                      <div className="confetti confetti-7"></div>
                      <div className="confetti confetti-8"></div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center space-y-4 col-span-full">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No Completed Courses Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Keep learning! Completed courses will appear here once you finish them.
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    const tabs = document.querySelector('[role="tablist"]');
                    const coursesTab = tabs?.querySelector('[value="courses"]') as HTMLButtonElement;
                    coursesTab?.click();
                  }}
                  className="mt-4"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Courses
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Library className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold">Your Learning Library</h3>
              <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto">
                Resources are automatically added here as you complete courses. 
                Access them anytime for quick reference!
              </p>
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              {[
                'Budgeting Templates',
                'Debt Payoff Calculator',
                'Emergency Fund Guide',
                'Savings Goal Tracker'
              ].map((resource, index) => (
                <Card key={index} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base font-medium">{resource}</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stat Popup */}
      {openPopup && (() => {
        const config = getPopupConfig(openPopup);
        const PopupIcon = config.icon;
        
        return (
          <div 
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto ${closingPopup ? 'animate-[fadeOut_0.3s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {/* Popup Card with scale + fade-in/out animation */}
            <div className={closingPopup ? 'animate-[scaleOut_0.3s_ease-out]' : 'animate-[scaleIn_0.3s_ease-out]'}>
              <style>{`
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
                @keyframes iconPulse {
                  0%, 100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.08);
                  }
                }
              `}</style>
              
              <Card className={`p-6 max-w-md w-full bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} shadow-2xl relative`}>
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Content */}
                <div className="space-y-5">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div 
                      className={`h-14 w-14 rounded-xl ${config.iconBg} flex items-center justify-center`}
                      style={{
                        animation: closingPopup ? 'none' : 'iconPulse 2s ease-in-out infinite'
                      }}
                    >
                      <PopupIcon className={`h-7 w-7 ${config.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{config.title}</h3>
                      <p className="text-sm text-muted-foreground">{config.subtitle}</p>
                    </div>
                  </div>

                  {/* Main Value */}
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold text-foreground mb-2">{config.mainValue}</p>
                  </div>

                  {/* Insight Badge */}
                  <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-border">
                    <p className="text-sm font-semibold text-foreground mb-1">✨ Insight</p>
                    <p className="text-sm text-muted-foreground">{config.insight}</p>
                  </div>

                  {/* Details */}
                  <div className="pt-2">
                    <p className="text-[rgb(100,125,122)] dark:text-[rgb(175,190,187)] text-sm leading-relaxed">{config.details}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      })()}
    </div>
  );
}