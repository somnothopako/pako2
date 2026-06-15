import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { getLessonContent } from '@/app/data/lessonContent';

export function LessonContent() {
  const navigate = useNavigate();
  const { categoryId, lessonId } = useParams<{ categoryId: string; lessonId: string }>();
  
  const lessonContent = getLessonContent(categoryId || '', lessonId || '');
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  if (!lessonContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This lesson content is not available yet.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const currentStep = lessonContent.steps[currentStepIndex];
  const totalSteps = lessonContent.steps.length;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
    
    if (isLastStep) {
      // Navigate to practice page
      navigate(`/learning/${categoryId}/${lessonId}/practice`);
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setIsVideoPlaying(false);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
      setIsVideoPlaying(false);
    }
  };

  const handleSaveForLater = () => {
    // In a real app, this would save progress to backend
    navigate(`/learning/${categoryId}`);
  };

  const handleExit = () => {
    navigate(`/learning/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Step {currentStepIndex + 1} of {totalSteps}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {lessonContent.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          {/* Step Content */}
          <div className="p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              {currentStep.title}
            </h3>

            {currentStep.type === 'video' ? (
              <div className="space-y-4">
                {/* Video Player Placeholder */}
                <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                  {currentStep.videoUrl ? (
                    <iframe
                      src={`${currentStep.videoUrl}${currentStep.videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {isVideoPlaying ? (
                          <Pause className="h-10 w-10 text-white" />
                        ) : (
                          <Play className="h-10 w-10 text-white ml-1" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {currentStep.videoDuration && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Duration: {currentStep.videoDuration}
                  </p>
                )}
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {currentStep.content?.split('\n').map((paragraph, idx) => {
                  // Handle bold markdown
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h4 key={idx} className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                        {paragraph.replace(/\*\*/g, '')}
                      </h4>
                    );
                  }
                  // Handle bullet points
                  if (paragraph.startsWith('•')) {
                    return (
                      <p key={idx} className="ml-4 my-2 text-slate-700 dark:text-slate-300">
                        {paragraph}
                      </p>
                    );
                  }
                  // Handle numbered lists
                  if (/^\d+\./.test(paragraph)) {
                    return (
                      <p key={idx} className="ml-4 my-2 text-slate-700 dark:text-slate-300">
                        {paragraph}
                      </p>
                    );
                  }
                  // Regular paragraphs
                  if (paragraph.trim()) {
                    return (
                      <p key={idx} className="my-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>

          {/* Navigation Footer */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSaveForLater}
                  className="gap-2"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Save for Later
                </Button>
              </div>

              <Button
                onClick={handleNext}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                {isLastStep ? (
                  <>
                    Continue to Practice
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {lessonContent.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-8 bg-primary'
                  : completedSteps.has(idx)
                  ? 'w-2 bg-green-500'
                  : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}