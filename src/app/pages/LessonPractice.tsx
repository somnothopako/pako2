import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { getLessonContent } from '@/app/data/lessonContent';

const ItemType = 'WORD';

interface WordChipProps {
  word: string;
  id: string;
  isPlaced?: boolean;
}

function WordChip({ word, id, isPlaced }: WordChipProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { word, id },
    canDrag: !isPlaced, // Prevent dragging if already placed
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [isPlaced]); // Re-run when isPlaced changes

  return (
    <div
      ref={!isPlaced ? drag : null} // Only attach drag ref if not placed
      className={`
        px-4 py-2 rounded-xl font-medium select-none
        transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        ${isPlaced 
          ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md hover:shadow-lg hover:scale-105 cursor-move'
        }
        border-2 border-slate-200 dark:border-slate-700
      `}
      style={{ touchAction: 'none' }}
    >
      {word}
    </div>
  );
}

interface DropSlotProps {
  onDrop: (word: string, id: string) => void;
  word: string | null;
  index: number;
  isCorrect?: boolean;
  isIncorrect?: boolean;
}

function DropSlot({ onDrop, word, index, isCorrect, isIncorrect }: DropSlotProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { word: string; id: string }) => {
      onDrop(item.word, item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`
        inline-flex items-center justify-center
        min-w-[120px] h-12 px-4 mx-1 my-1
        rounded-xl border-2 border-dashed
        transition-all duration-200
        ${isOver ? 'scale-105 border-primary bg-primary/10' : ''}
        ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}
        ${isIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-950/30' : ''}
        ${!word && !isOver && !isCorrect && !isIncorrect ? 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900' : ''}
      `}
    >
      {word ? (
        <span className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-400' : isIncorrect ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
          {word}
        </span>
      ) : (
        <span className="text-slate-400 dark:text-slate-600 text-sm">
          {index + 1}
        </span>
      )}
    </div>
  );
}

function PracticeContent() {
  const navigate = useNavigate();
  const { categoryId, lessonId } = useParams<{ categoryId: string; lessonId: string }>();
  
  const lessonContent = getLessonContent(categoryId || '', lessonId || '');
  const practice = lessonContent?.practice;

  const [placedWords, setPlacedWords] = useState<(string | null)[]>(
    new Array(practice?.blanks.length || 0).fill(null)
  );
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [checkedSlots, setCheckedSlots] = useState<boolean[]>(
    new Array(practice?.blanks.length || 0).fill(false)
  );

  if (!practice) {
    return null;
  }

  const handleDrop = (index: number) => (word: string, id: string) => {
    // Remove word from previous position if it was placed
    const newPlacedWords = [...placedWords];
    const previousIndex = newPlacedWords.indexOf(word);
    if (previousIndex !== -1) {
      newPlacedWords[previousIndex] = null;
    }

    // Place word in new position
    newPlacedWords[index] = word;
    setPlacedWords(newPlacedWords);
    setUsedWordIds(prev => new Set(prev).add(id));
    
    // Reset feedback when user makes a change
    setFeedback(null);
    setCheckedSlots(new Array(practice.blanks.length).fill(false));
  };

  const handleCheck = () => {
    const isCorrect = placedWords.every((word, idx) => word === practice.blanks[idx]);
    
    if (isCorrect) {
      setFeedback('correct');
      setCheckedSlots(new Array(practice.blanks.length).fill(true));
    } else {
      setFeedback('incorrect');
      // Mark which slots are correct/incorrect
      const newCheckedSlots = placedWords.map((word, idx) => word === practice.blanks[idx]);
      setCheckedSlots(newCheckedSlots);
    }
  };

  const handleReset = () => {
    setPlacedWords(new Array(practice.blanks.length).fill(null));
    setUsedWordIds(new Set());
    setFeedback(null);
    setShowHint(false);
    setCheckedSlots(new Array(practice.blanks.length).fill(false));
  };

  const handleContinue = () => {
    navigate(`/learning/${categoryId}/${lessonId}/quiz`);
  };

  const isComplete = placedWords.every(word => word !== null);

  // Build the sentence with drop slots
  const sentenceParts = practice.sentence.split('{blank}');
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/learning/${categoryId}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Exit
            </Button>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Practice Time!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {lessonContent?.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {practice.instruction}
          </p>

          {/* Sentence with Drop Slots */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-6 md:p-8 mb-8 border-2 border-slate-200 dark:border-slate-800">
            <div className="text-lg md:text-xl leading-relaxed flex flex-wrap items-center">
              {sentenceParts.map((part, idx) => (
                <span key={idx} className="contents">
                  <span className="text-slate-900 dark:text-white">{part}</span>
                  {idx < practice.blanks.length && (
                    <DropSlot
                      onDrop={handleDrop(idx)}
                      word={placedWords[idx]}
                      index={idx}
                      isCorrect={feedback === 'correct' || (feedback === 'incorrect' && checkedSlots[idx])}
                      isIncorrect={feedback === 'incorrect' && !checkedSlots[idx] && placedWords[idx] !== null}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              feedback === 'correct' 
                ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-900' 
                : 'bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900'
            }`}>
              {feedback === 'correct' ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Perfect! You got it right! 🎉
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Great job understanding the key concepts!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-100">
                      Not quite right. Try again!
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Green boxes are correct. Review the incorrect ones and try different words.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hint */}
          {showHint && practice.hint && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-200 dark:border-yellow-900">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Hint:
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {practice.hint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Word Bank */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Word Bank
            </h3>
            <div className="flex flex-wrap gap-3 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 min-h-[100px]">
              {practice.wordBank.map((word, idx) => {
                const wordId = `word-${idx}`;
                const isPlaced = placedWords.includes(word);
                return (
                  <WordChip
                    key={wordId}
                    word={word}
                    id={wordId}
                    isPlaced={isPlaced}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              {practice.hint && !showHint && (
                <Button
                  variant="ghost"
                  onClick={() => setShowHint(true)}
                  className="gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </Button>
              )}
            </div>

            {feedback === 'correct' ? (
              <Button
                onClick={handleContinue}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                Continue to Quiz
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCheck}
                disabled={!isComplete}
                className="gap-2"
              >
                Check Answer
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function LessonPractice() {
  return (
    <DndProvider backend={HTML5Backend}>
      <PracticeContent />
    </DndProvider>
  );
}