import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getLessonContent, QuizQuestion } from '@/app/data/lessonContent';

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | boolean | null;
  answers: Map<string, string | boolean>;
  incorrectQuestionIds: Set<string>;
  isRemediationMode: boolean;
  showFeedback: boolean;
  isCorrect: boolean | null;
}

export function LessonQuiz() {
  const navigate = useNavigate();
  const { categoryId, lessonId } = useParams<{ categoryId: string; lessonId: string }>();
  
  const lessonContent = getLessonContent(categoryId || '', lessonId || '');
  const allQuestions = lessonContent?.quiz || [];

  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: new Map(),
    incorrectQuestionIds: new Set(),
    isRemediationMode: false,
    showFeedback: false,
    isCorrect: null,
  });

  const [questionsToShow, setQuestionsToShow] = useState<QuizQuestion[]>(allQuestions);
  const [hasCompletedFirstPass, setHasCompletedFirstPass] = useState(false);

  useEffect(() => {
    if (state.isRemediationMode) {
      // Filter to only incorrect questions
      const incorrectQuestions = allQuestions.filter(q => 
        state.incorrectQuestionIds.has(q.id)
      );
      setQuestionsToShow(incorrectQuestions);
    }
  }, [state.isRemediationMode, state.incorrectQuestionIds, allQuestions]);

  if (!lessonContent || allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Available</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questionsToShow[state.currentQuestionIndex];
  const totalQuestions = questionsToShow.length;
  const progressPercentage = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;
  const isLastQuestion = state.currentQuestionIndex === totalQuestions - 1;

  const handleAnswerSelect = (answer: string | boolean) => {
    if (!state.showFeedback) {
      setState(prev => ({ ...prev, selectedAnswer: answer }));
    }
  };

  const handleSubmitAnswer = () => {
    if (state.selectedAnswer === null) return;

    const isCorrect = state.selectedAnswer === currentQuestion.correctAnswer;
    
    // Store the answer
    const newAnswers = new Map(state.answers);
    newAnswers.set(currentQuestion.id, state.selectedAnswer);

    // Track incorrect answers
    const newIncorrectIds = new Set(state.incorrectQuestionIds);
    if (!isCorrect) {
      newIncorrectIds.add(currentQuestion.id);
    } else if (state.isRemediationMode) {
      // If they got it right in remediation, remove from incorrect set
      newIncorrectIds.delete(currentQuestion.id);
    }

    setState(prev => ({
      ...prev,
      answers: newAnswers,
      incorrectQuestionIds: newIncorrectIds,
      showFeedback: true,
      isCorrect,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Check if we need remediation
      if (!state.isRemediationMode && state.incorrectQuestionIds.size > 0) {
        // Start remediation mode
        setHasCompletedFirstPass(true);
        setState(prev => ({
          ...prev,
          currentQuestionIndex: 0,
          selectedAnswer: null,
          showFeedback: false,
          isCorrect: null,
          isRemediationMode: true,
        }));
      } else if (state.isRemediationMode && state.incorrectQuestionIds.size > 0) {
        // Still have incorrect answers in remediation, loop again
        setState(prev => ({
          ...prev,
          currentQuestionIndex: 0,
          selectedAnswer: null,
          showFeedback: false,
          isCorrect: null,
        }));
      } else {
        // All questions correct, go to results
        navigate(`/learning/${categoryId}/${lessonId}/results`, {
          state: {
            totalQuestions: allQuestions.length,
            answers: Object.fromEntries(state.answers),
            incorrectQuestionIds: Array.from(state.incorrectQuestionIds),
          },
        });
      }
    } else {
      // Move to next question
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedAnswer: null,
        showFeedback: false,
        isCorrect: null,
      }));
    }
  };

  const getButtonVariant = (option: string | boolean) => {
    if (!state.showFeedback) {
      return state.selectedAnswer === option ? 'default' : 'outline';
    }
    
    if (option === currentQuestion.correctAnswer) {
      return 'default';
    }
    
    if (state.selectedAnswer === option && !state.isCorrect) {
      return 'destructive';
    }
    
    return 'outline';
  };

  const getButtonClasses = (option: string | boolean) => {
    if (!state.showFeedback) {
      return state.selectedAnswer === option 
        ? 'border-primary ring-2 ring-primary/20' 
        : 'hover:border-slate-400 dark:hover:border-slate-600';
    }
    
    if (option === currentQuestion.correctAnswer) {
      return 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 ring-2 ring-green-500/20';
    }
    
    if (state.selectedAnswer === option && !state.isCorrect) {
      return 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300';
    }
    
    return 'opacity-50';
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
              onClick={() => navigate(`/learning/${categoryId}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {state.isRemediationMode ? 'Review: ' : ''}
              Question {state.currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          {state.isRemediationMode && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Reviewing incorrect answers - get them all right to continue!</span>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">
                  {state.currentQuestionIndex + 1}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white pt-1">
                {currentQuestion.question}
              </h3>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
              currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={state.showFeedback}
                  className={`
                    w-full p-4 text-left rounded-xl border-2 transition-all
                    ${getButtonClasses(option)}
                    ${!state.showFeedback ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {state.showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    {state.showFeedback && state.selectedAnswer === option && !state.isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => handleAnswerSelect(true)}
                  disabled={state.showFeedback}
                  className={`
                    w-full p-4 text-left rounded-xl border-2 transition-all
                    ${getButtonClasses(true)}
                    ${!state.showFeedback ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">True</span>
                    {state.showFeedback && currentQuestion.correctAnswer === true && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    {state.showFeedback && state.selectedAnswer === true && !state.isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleAnswerSelect(false)}
                  disabled={state.showFeedback}
                  className={`
                    w-full p-4 text-left rounded-xl border-2 transition-all
                    ${getButtonClasses(false)}
                    ${!state.showFeedback ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">False</span>
                    {state.showFeedback && currentQuestion.correctAnswer === false && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                    {state.showFeedback && state.selectedAnswer === false && !state.isCorrect && (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Feedback */}
          {state.showFeedback && (
            <div className={`p-4 rounded-xl border-2 mb-6 ${
              state.isCorrect 
                ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900' 
                : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
            }`}>
              <div className="flex items-start gap-3">
                {state.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold mb-2 ${
                    state.isCorrect 
                      ? 'text-green-900 dark:text-green-100' 
                      : 'text-red-900 dark:text-red-100'
                  }`}>
                    {state.isCorrect ? 'Correct! 🎉' : 'Not quite right'}
                  </p>
                  <p className={`text-sm ${
                    state.isCorrect 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
            {state.showFeedback ? (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                {isLastQuestion ? 'Continue' : 'Next Question'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmitAnswer}
                disabled={state.selectedAnswer === null}
                className="gap-2"
              >
                Submit Answer
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}