import { useNavigate, useParams, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Trophy, Star, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { getLessonContent } from '@/app/data/lessonContent';
import { motion } from 'motion/react';

export function LessonResults() {
  const navigate = useNavigate();
  const { categoryId, lessonId } = useParams<{ categoryId: string; lessonId: string }>();
  const location = useLocation();
  
  const lessonContent = getLessonContent(categoryId || '', lessonId || '');
  
  // Get data passed from quiz
  const { totalQuestions = 0, answers = {}, incorrectQuestionIds = [] } = location.state || {};
  
  const correctCount = totalQuestions - incorrectQuestionIds.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const pointsEarned = Math.round(scorePercentage / 10); // 10 points per 10%

  const handleReviewLesson = () => {
    navigate(`/learning/${categoryId}/${lessonId}/content`);
  };

  const handleContinue = () => {
    navigate(`/learning/${categoryId}`);
  };

  const handleRetakeQuiz = () => {
    navigate(`/learning/${categoryId}/${lessonId}/quiz`);
  };

  const getPerformanceMessage = () => {
    if (scorePercentage === 100) {
      return {
        title: 'Perfect Score! 🎉',
        message: "You've mastered this lesson! Keep up the amazing work!",
        color: 'from-green-500 to-emerald-600',
      };
    } else if (scorePercentage >= 80) {
      return {
        title: 'Great Job! 🌟',
        message: "You've got a strong understanding of this topic!",
        color: 'from-blue-500 to-cyan-600',
      };
    } else if (scorePercentage >= 60) {
      return {
        title: 'Good Effort! 👍',
        message: "You're on the right track. Review the lesson to improve further.",
        color: 'from-yellow-500 to-orange-600',
      };
    } else {
      return {
        title: 'Keep Learning! 💪',
        message: "Don't worry! Review the lesson and try again - you've got this!",
        color: 'from-orange-500 to-red-600',
      };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lesson Complete!
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-br ${performance.color} p-8 text-white`}>
              <div className="flex items-center justify-center mb-6">
                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy className="h-16 w-16" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
                {performance.title}
              </h2>
              <p className="text-center text-white/90 text-lg mb-6">
                {performance.message}
              </p>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{scorePercentage}%</div>
                  <div className="text-sm text-white/80">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{correctCount}/{totalQuestions}</div>
                  <div className="text-sm text-white/80">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">+{pointsEarned}</div>
                  <div className="text-sm text-white/80">Points</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                Lesson Summary: {lessonContent?.title}
              </h3>
              
              {/* Questions Review */}
              {lessonContent?.quiz && (
                <div className="space-y-3">
                  {lessonContent.quiz.map((question, idx) => {
                    const wasIncorrect = incorrectQuestionIds.includes(question.id);
                    const userAnswer = answers[question.id];
                    
                    return (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border-2 ${
                          wasIncorrect
                            ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30'
                            : 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            wasIncorrect
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}>
                            {wasIncorrect ? '✕' : '✓'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white mb-1">
                              Question {idx + 1}: {question.question}
                            </p>
                            {wasIncorrect && (
                              <div className="text-sm space-y-1">
                                <p className="text-red-700 dark:text-red-300">
                                  Your answer: {String(userAnswer)}
                                </p>
                                <p className="text-green-700 dark:text-green-300">
                                  Correct answer: {String(question.correctAnswer)}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleReviewLesson}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Review Lesson
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Go over the content again
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={handleRetakeQuiz}>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Retake Quiz
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Try to improve your score
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full gap-2 py-6 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          size="lg"
        >
          Continue Learning Journey
          <ArrowRight className="h-5 w-5" />
        </Button>

        {/* Motivational Message */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="flex items-start gap-4">
            <Star className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Keep Building Your Financial Future!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Every lesson completed brings you closer to financial wellness. You earned <strong>{pointsEarned} points</strong> for completing this lesson. Keep up the great work!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}