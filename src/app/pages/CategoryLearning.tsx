import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { 
  CheckCircle2,
  Lock,
  Play,
  ArrowLeft,
  Wallet,
  PiggyBank,
  TrendingUpIcon,
  AlertCircle,
  Circle,
  Star
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { budgetingLessons, savingLessons, debtLessons, investingLessons } from '@/app/data/mockData';

// Helper function to get icon for each category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'budgeting':
      return Wallet;
    case 'saving':
      return PiggyBank;
    case 'investing':
      return TrendingUpIcon;
    case 'debt-management':
      return AlertCircle;
    default:
      return Circle;
  }
};

// Helper function to get lessons for each category
const getCategoryLessons = (category: string) => {
  switch (category) {
    case 'budgeting':
      return budgetingLessons;
    case 'saving':
      return savingLessons;
    case 'debt-management':
      return debtLessons;
    case 'investing':
      return investingLessons;
    default:
      return [];
  }
};

// Helper function to get category display name
const getCategoryName = (category: string) => {
  switch (category) {
    case 'budgeting':
      return 'Budgeting';
    case 'saving':
      return 'Saving';
    case 'debt-management':
      return 'Debt Management';
    case 'investing':
      return 'Investing';
    default:
      return category;
  }
};

export function CategoryLearning() {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
  
  const lessons = getCategoryLessons(category || '');
  const CategoryIcon = getCategoryIcon(category || '');
  const categoryName = getCategoryName(category || '');
  
  const completedCount = lessons.filter(l => l.status === 'completed').length;
  const progressPercentage = (completedCount / lessons.length) * 100;

  return (
    <div className="px-4 py-6 space-y-8 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/learning')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Hub
        </Button>

        {/* Category Header */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CategoryIcon className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Learning about {categoryName}</h1>
            <p className="text-muted-foreground mt-1">
              {completedCount} of {lessons.length} lessons completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your Progress</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2.5" />
          </div>
        </Card>
      </div>

      {/* Learning Path Roadmap */}
      <div className="relative py-8">
        <div className="space-y-12">
          {lessons.map((lesson, index) => {
            const isCompleted = lesson.status === 'completed';
            const isInProgress = lesson.status === 'in-progress';
            const isLocked = lesson.status === 'locked';
            const isSpecial = (lesson as any).isSpecial || false;
            
            // Alternate between left and right alignment
            const isLeft = index % 2 === 0;
            const nextIsLeft = (index + 1) % 2 === 0;

            return (
              <div key={lesson.id} className="relative">
                {/* Connector Path to Next Node */}
                {index < lessons.length - 1 && (
                  <svg
                    className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none"
                    width="200"
                    height="80"
                    viewBox="0 0 200 80"
                    style={{
                      zIndex: 0,
                    }}
                  >
                    <path
                      d={isLeft 
                        ? "M 100 0 Q 120 20, 120 40 T 100 80" 
                        : "M 100 0 Q 80 20, 80 40 T 100 80"
                      }
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      className={
                        lessons[index + 1]?.status === 'completed' || lessons[index + 1]?.status === 'in-progress'
                          ? 'text-primary/30'
                          : 'text-border'
                      }
                      strokeDasharray={isLocked && lessons[index + 1]?.status === 'locked' ? '6 6' : '0'}
                    />
                  </svg>
                )}

                {/* Lesson Node Container */}
                <div className={`flex items-center gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'} relative z-10`}>
                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Circular Node */}
                  <div 
                    className={`relative flex-shrink-0 ${!isLocked ? 'cursor-pointer' : ''} group/node`}
                    onClick={() => {
                      if (!isLocked) {
                        // Navigate to lesson content page
                        navigate(`/learning/${category}/${lesson.id}/content`);
                      }
                    }}
                  >
                    {/* Points Label (Yellow Pill) */}
                    {!isLocked && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <div className="px-2.5 py-1 rounded-full bg-secondary text-xs font-semibold text-white whitespace-nowrap shadow-sm">
                          {lesson.points} pts
                        </div>
                      </div>
                    )}

                    {/* Progress Ring for Current Lesson */}
                    {isInProgress && (
                      <>
                        {/* Default Progress Ring (visible when not hovering) */}
                        <svg 
                          className="absolute inset-0 -m-2 w-24 h-24 -rotate-90 group-hover/node:opacity-0 transition-opacity duration-500"
                          viewBox="0 0 100 100"
                        >
                          {/* Background Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-border"
                          />
                          {/* Progress Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className={`transition-all duration-500 ${isSpecial ? 'text-purple-500' : 'text-primary'}`}
                            strokeDasharray={`${2 * Math.PI * 46}`}
                            strokeDashoffset={`${2 * Math.PI * 46 * (1 - 0.4)}`}
                          />
                        </svg>

                        {/* Animated Progress Ring (visible on hover) */}
                        <svg 
                          className="absolute inset-0 -m-2 w-24 h-24 -rotate-90 opacity-0 group-hover/node:opacity-100 transition-opacity duration-500"
                          viewBox="0 0 100 100"
                        >
                          {/* Background Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-border"
                          />
                          {/* Animated Progress Ring */}
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            className={isSpecial ? 'text-purple-500' : 'text-primary'}
                            strokeDasharray={`${2 * Math.PI * 46}`}
                            strokeDashoffset={`${2 * Math.PI * 46}`}
                            style={{
                              animation: 'progressRingFill 1s ease-out forwards'
                            }}
                          />
                        </svg>
                      </>
                    )}

                    {/* Node Circle */}
                    <div 
                      className={`
                        relative rounded-full transition-all duration-300
                        ${isCompleted 
                          ? isSpecial 
                            ? 'h-16 w-16 bg-purple-500 dark:bg-purple-600' 
                            : 'h-16 w-16 bg-green-500 dark:bg-green-600'
                          : isInProgress 
                          ? isSpecial
                            ? 'h-20 w-20 bg-purple-500 dark:bg-purple-600 group-hover/node:scale-[1.02]'
                            : 'h-20 w-20 bg-primary group-hover/node:scale-[1.02]' 
                          : isSpecial
                          ? 'h-16 w-16 bg-purple-100 dark:bg-purple-900/30'
                          : 'h-16 w-16 bg-muted'
                        }
                        ${!isLocked && !isCompleted && !isInProgress && 'hover:scale-110'}
                        flex items-center justify-center
                      `}
                    >
                      {/* Node Icon */}
                      {isCompleted ? (
                        <Star className="h-8 w-8 text-white fill-white group-hover/node:text-[#FFD700] group-hover/node:fill-[#FFD700] group-hover/node:scale-110 transition-all duration-200" />
                      ) : isInProgress ? (
                        <Play className="h-8 w-8 text-white fill-white" />
                      ) : (
                        <Lock className={`h-7 w-7 ${isSpecial ? 'text-purple-400 dark:text-purple-300' : 'text-muted-foreground'}`} />
                      )}
                    </div>

                    {/* Glow effect for current lesson */}
                    {isInProgress && (
                      <div className={`absolute inset-0 rounded-full blur-xl -z-10 scale-125 ${isSpecial ? 'bg-purple-500/20' : 'bg-primary/20'}`} />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className={`flex-1 ${isLeft ? 'text-left' : 'text-right'}`}>
                    <div className="space-y-2">
                      <div>
                        <h3 className={`font-bold text-lg ${isLocked ? 'text-muted-foreground' : ''}`}>
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Continue Button for Active Lesson */}
                      {isInProgress && (
                        <Button 
                          size="sm" 
                          className="gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learning/${category}/${lesson.id}/content`);
                          }}
                        >
                          <Play className="h-3.5 w-3.5" />
                          Continue
                        </Button>
                      )}

                      {/* Review option for completed */}
                      {isCompleted && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1.5 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/learning/${category}/${lesson.id}/content`);
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Star */}
        {progressPercentage === 100 && (
          <div className="flex flex-col items-center pt-12 space-y-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center shadow-xl">
                <Star className="h-12 w-12 text-white fill-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-secondary/30 blur-2xl -z-10" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">Course Complete!</h3>
              <p className="text-sm text-muted-foreground">You've mastered {categoryName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}