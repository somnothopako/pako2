import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { BubblesIcon } from '@/app/components/BubblesIcon';
import { DatePicker } from '@/app/components/ui/date-picker';
import { 
  Target,
  ListTodo,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Gift,
  Calendar,
  TrendingUp,
  X,
  Trash2,
  Plus,
  AlertCircle,
  Save,
  Pencil
} from 'lucide-react';
import { goalsData, todosData, Goal } from '@/app/data/mockData';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

// Helper function to get category color
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Home': '#8A817C',
    'Learning': '#4361EE',
    'Goals': '#5F0F40',
    'Clinic': '#0F4C5C',
    'Settings': '#FB8B24',
    'Finance': '#A855F7',
    'Rewards': '#FFD60A',
  };
  return colorMap[category] || '#6B7280'; // Default to slate if category not found
};

export function GoalsAndTodos() {
  const [isRewardsExpanded, setIsRewardsExpanded] = useState(false);
  const [todos, setTodos] = useState(todosData);
  const [goals, setGoals] = useState(goalsData);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    description: '',
    goalType: 'Save money',
    customGoalType: '',
    trackingMethod: 'Amount-based',
    targetAmount: 0,
    currentAmount: 0,
    startDate: '',
    deadline: '',
    category: 'Savings',
  });
  const [originalFormData, setOriginalFormData] = useState<Partial<Goal>>({});
  const [customGoalTypeError, setCustomGoalTypeError] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnsavedChangesWarning, setShowUnsavedChangesWarning] = useState(false);
  
  // To-do editing state
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [hoveredTodoId, setHoveredTodoId] = useState<string | null>(null);
  const [completedSectionExpanded, setCompletedSectionExpanded] = useState(true);
  
  // Sorting state
  const [activeTodosSortBy, setActiveTodosSortBy] = useState<'date-asc' | 'date-desc' | 'group'>('date-asc');
  const [completedTodosSortBy, setCompletedTodosSortBy] = useState<'date-asc' | 'date-desc' | 'group'>('date-desc');
  
  // Track original values and unsaved changes for each todo
  const [originalTodoValues, setOriginalTodoValues] = useState<Record<string, { title: string; category: string; dueDate: string }>>({});
  const [todosWithUnsavedChanges, setTodosWithUnsavedChanges] = useState<Set<string>>(new Set());
  
  // Track todo order snapshot when editing starts (for paused sorting)
  const [editModeOrderSnapshot, setEditModeOrderSnapshot] = useState<string[]>([]);
  
  // Animation state for progress bars and percentages
  const [animatedProgress, setAnimatedProgress] = useState<Record<string, number>>({});
  const [animatedCompletionRate, setAnimatedCompletionRate] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Calculate summary statistics
  const activeGoals = goals.length;
  const pendingTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  
  // Helper function to sort todos
  const sortTodos = (todosList: typeof todos, sortBy: 'date-asc' | 'date-desc' | 'group') => {
    let sorted = [...todosList];
    
    if (sortBy === 'date-asc') {
      sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortBy === 'date-desc') {
      sorted.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    } else if (sortBy === 'group') {
      // Group by category, then sort by date ascending within each group
      sorted.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }
    
    return sorted;
  };
  
  // Filter completed todos from this week (last 7 days)
  const completedThisWeek = editingTodoId 
    ? todos.filter(todo => {
        if (!todo.completed || !todo.completedAt) return false;
        const completedDate = new Date(todo.completedAt);
        const now = new Date();
        const daysDiff = Math.ceil((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      }) // No sorting during edit
    : sortTodos(
        todos.filter(todo => {
          if (!todo.completed || !todo.completedAt) return false;
          const completedDate = new Date(todo.completedAt);
          const now = new Date();
          const daysDiff = Math.ceil((now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysDiff <= 7;
        }),
        completedTodosSortBy
      );
  
  // Filter active todos and apply sorting (disabled during editing)
  const activeTodos = editingTodoId 
    ? (() => {
        // State: Editing (Sorting Paused) or New To-Do (Pinned Top, Editing)
        const activeTodosList = todos.filter(todo => !todo.completed);
        
        // If there's an order snapshot, use it to maintain positions
        if (editModeOrderSnapshot.length > 0) {
          const snapshotMap = new Map(activeTodosList.map(todo => [todo.id, todo]));
          const orderedTodos = editModeOrderSnapshot
            .map(id => snapshotMap.get(id))
            .filter((todo): todo is typeof activeTodosList[0] => todo !== undefined);
          
          // Add any new todos at the top (New To-Do state)
          const newTodos = activeTodosList.filter(
            todo => !editModeOrderSnapshot.includes(todo.id)
          );
          
          return [...newTodos, ...orderedTodos];
        }
        
        return activeTodosList;
      })()
    : sortTodos(
        todos.filter(todo => !todo.completed),
        activeTodosSortBy
      );

  // Lock body scroll when editor or delete confirmation is open
  useEffect(() => {
    if (isEditorOpen || showDeleteConfirm || showUnsavedChangesWarning) {
      // Save original overflow style
      const originalOverflow = document.body.style.overflow;
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      
      // Cleanup: restore original overflow when component unmounts or modals close
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEditorOpen, showDeleteConfirm, showUnsavedChangesWarning]);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Set progress values (animation removed to prevent infinite loop)
  useEffect(() => {
    // Calculate progress for each goal
    const finalProgress: Record<string, number> = {};
    goals.forEach(goal => {
      finalProgress[goal.id] = (goal.currentAmount / goal.targetAmount) * 100;
    });
    
    // Calculate completion rate
    const currentCompletedTodos = todos.filter(todo => todo.completed).length;
    const currentTotalTodos = todos.length;
    const targetCompletionRate = currentTotalTodos > 0 ? (currentCompletedTodos / currentTotalTodos) * 100 : 0;
    
    setAnimatedProgress(finalProgress);
    setAnimatedCompletionRate(targetCompletionRate);
    setIsAnimating(false);
  }, [goals, todos]); // Re-run when goals or todos change

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, completedAt: new Date().toISOString() } : todo
    ));
  };

  // Calculate days until deadline
  const getDaysUntil = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Open editor for new goal
  const openNewGoalEditor = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      goalType: 'Save money',
      customGoalType: '',
      trackingMethod: 'Amount-based',
      targetAmount: 0,
      currentAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      category: 'Savings',
    });
    setOriginalFormData({});
    setIsEditorOpen(true);
  };

  // Open editor for existing goal
  const openEditGoalEditor = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData(goal);
    setOriginalFormData(goal);
    setIsEditorOpen(true);
  };

  // Close editor
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingGoal(null);
  };

  // Handle attempt to close editor (check for unsaved changes)
  const handleCloseEditor = () => {
    if (hasFormChanged() && isFormValid()) {
      setShowUnsavedChangesWarning(true);
    } else {
      closeEditor();
    }
  };

  // Force close without saving
  const forceCloseEditor = () => {
    setShowUnsavedChangesWarning(false);
    closeEditor();
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.title &&
      formData.title.trim() !== '' &&
      formData.goalType &&
      formData.trackingMethod &&
      formData.startDate &&
      formData.deadline &&
      formData.category &&
      (formData.trackingMethod !== 'Amount-based' || (formData.targetAmount && formData.targetAmount > 0))
    );
  };

  // Check if form has changed from original (for edit mode)
  const hasFormChanged = () => {
    if (!editingGoal) return true; // Always allow save for new goals
    
    return (
      formData.title !== originalFormData.title ||
      formData.description !== originalFormData.description ||
      formData.goalType !== originalFormData.goalType ||
      formData.customGoalType !== originalFormData.customGoalType ||
      formData.trackingMethod !== originalFormData.trackingMethod ||
      formData.targetAmount !== originalFormData.targetAmount ||
      formData.currentAmount !== originalFormData.currentAmount ||
      formData.startDate !== originalFormData.startDate ||
      formData.deadline !== originalFormData.deadline ||
      formData.category !== originalFormData.category
    );
  };

  // Check if goal can be edited (not within 1 day of deadline)
  const canEditGoal = (goal: Goal) => {
    const daysUntil = getDaysUntil(goal.deadline);
    return daysUntil > 1;
  };

  // Check if goal can be deleted
  const canDeleteGoal = (goal: Goal) => {
    const daysUntil = getDaysUntil(goal.deadline);
    const isCreatedToday = new Date(goal.createdDate).toDateString() === new Date().toDateString();
    return daysUntil > 1 || isCreatedToday;
  };

  // Save goal
  const saveGoal = () => {
    if (!isFormValid()) return;

    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(g => 
        g.id === editingGoal.id 
          ? { ...g, ...formData } as Goal
          : g
      ).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: String(Date.now()),
        title: formData.title!,
        description: formData.description,
        goalType: formData.goalType!,
        customGoalType: formData.customGoalType,
        trackingMethod: formData.trackingMethod!,
        targetAmount: formData.targetAmount!,
        currentAmount: formData.currentAmount || 0,
        startDate: formData.startDate!,
        deadline: formData.deadline!,
        category: formData.category!,
        status: 'on-track',
        createdDate: new Date().toISOString(),
      };
      setGoals([...goals, newGoal].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    }

    closeEditor();
  };

  // Delete goal
  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    closeEditor();
  };
  
  // Todo management functions
  const addNewTodo = () => {
    // Capture current sorted order before adding new to-do
    const currentActiveTodos = sortTodos(
      todos.filter(todo => !todo.completed),
      activeTodosSortBy
    );
    setEditModeOrderSnapshot(currentActiveTodos.map(todo => todo.id));
    
    const newTodo = {
      id: String(Date.now()),
      title: '',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Home' as const,
      suggestedByPako: false,
      completedAt: null,
    };
    setTodos([...todos, newTodo]);
    setEditingTodoId(newTodo.id);
  };
  
  const startEditingTodo = (id: string, title: string, category: string, dueDate: string) => {
    if (!originalTodoValues[id]) {
      setOriginalTodoValues(prev => ({
        ...prev,
        [id]: { title, category, dueDate }
      }));
    }
  };
  
  const updateTodoTitle = (id: string, title: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, title } : todo
    ));
    markTodoAsChanged(id);
  };
  
  const updateTodoCategory = (id: string, category: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, category } : todo
    ));
    markTodoAsChanged(id);
  };
  
  const updateTodoDueDate = (id: string, dueDate: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, dueDate } : todo
    ));
    markTodoAsChanged(id);
  };
  
  const markTodoAsChanged = (id: string) => {
    setTodosWithUnsavedChanges(prev => new Set(prev).add(id));
  };
  
  const saveTodoChanges = (id: string) => {
    // Remove from unsaved changes
    setTodosWithUnsavedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    // Update original values to current values
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setOriginalTodoValues(prev => ({
        ...prev,
        [id]: { title: todo.title, category: todo.category, dueDate: todo.dueDate }
      }));
    }
    
    // Exit editing mode and clear snapshot (return to sorted state)
    setEditingTodoId(null);
    setEditModeOrderSnapshot([]);
  };
  
  const cancelTodoEditing = (id: string) => {
    // Revert to original values
    const original = originalTodoValues[id];
    if (original) {
      setTodos(todos.map(todo =>
        todo.id === id 
          ? { ...todo, title: original.title, category: original.category, dueDate: original.dueDate }
          : todo
      ));
    }
    
    // Clear unsaved changes
    setTodosWithUnsavedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    // Exit editing mode and clear snapshot (return to sorted state)
    setEditingTodoId(null);
    setEditModeOrderSnapshot([]);
  };
  
  const hasUnsavedChanges = (id: string): boolean => {
    return todosWithUnsavedChanges.has(id);
  };
  
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    if (editingTodoId === id) {
      setEditingTodoId(null);
      setEditModeOrderSnapshot([]);
    }
    // Clean up tracking
    setOriginalTodoValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
    setTodosWithUnsavedChanges(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };
  
  const handleTodoCheckbox = (id: string, completed: boolean) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { 
        ...todo, 
        completed, 
        completedAt: completed ? new Date().toISOString() : null 
      } : todo
    ));
  };

  // Get status badge
  const getStatusBadge = (goal: Goal) => {
    const daysUntil = getDaysUntil(goal.deadline);
    
    if (goal.status === 'completed') {
      return (
        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
          Completed
        </Badge>
      );
    }
    
    if (daysUntil < 0) {
      return (
        <Badge className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400">
          Overdue
        </Badge>
      );
    }
    
    if (daysUntil <= 7) {
      return (
        <Badge className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
          Due soon
        </Badge>
      );
    }
    
    return (
      <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
        On track
      </Badge>
    );
  };

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Animation Keyframes */}
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
      `}</style>

      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Goals & To-Do</h1>
        <p className="text-xs sm:text-sm md:text-base text-[#0F3D3E] dark:text-[rgb(240,243,245)] mt-1">
          Track what you're working toward and what needs to be done
        </p>
      </div>

      {/* Summary Container */}
      <Card className="relative overflow-hidden p-4 sm:p-5 md:p-6 bg-white dark:bg-[linear-gradient(to_bottom_right,rgb(16,12,14),rgb(14,13,18),rgb(15,11,15))] shadow-lg border-primary/10">
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
              animation: 'bubbleFloat1 20s ease-in-out infinite',
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
              animation: 'bubbleFloat2 25s ease-in-out infinite',
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
              animation: 'bubbleFloat3 22s ease-in-out infinite',
            }}
          />
        </div>

        <div className="relative flex flex-col gap-4">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium text-[#0F3D3E] dark:text-[rgb(240,243,245)] text-[20px] font-bold">
                  Your Progress
                </p>
              </div>
            </div>
            <p className="text-base sm:text-lg font-semibold">
              You have <span className="text-primary dark:text-[rgb(200,205,210)]">{activeGoals} active {activeGoals === 1 ? 'goal' : 'goals'}</span> and <span className="text-primary dark:text-[rgb(200,205,210)]">{pendingTodos} pending {pendingTodos === 1 ? 'to-do' : 'to-dos'}</span>
            </p>
            
            {/* Overall Completion Indicator */}
            {totalTodos > 0 && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Task completion rate</span>
                  <span className="font-medium">{Math.round(animatedCompletionRate)}%</span>
                </div>
                <Progress 
                  value={animatedCompletionRate} 
                  className="h-2"
                />
              </div>
            )}

            {/* Earn Rewards Section */}
            <div className="w-full space-y-3 mt-4">
              <div className="border-t border-border" />
              <button
                onClick={() => setIsRewardsExpanded(!isRewardsExpanded)}
                className="w-full flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
              >
                <div className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">?</span>
                </div>
                <span className="text-[#0F3D3E] dark:text-[rgb(240,243,245)]">Earn points</span>
                {isRewardsExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Rewards Panel */}
        <AnimatePresence>
          {isRewardsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base">Earn points for completing goals and to dos</h4>
                    <ul className="text-xs sm:text-sm text-[#0F3D3E] dark:text-[rgb(200,205,210)] leading-relaxed space-y-1.5 list-disc list-inside">
                      <li>Points are based on consistency and completion speed</li>
                      <li>You won't lose points if you miss a deadline</li>
                      <li>Bubbles might set a goal for you every now and then</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Main Content - Goals Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Your Goals</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {activeGoals} active
            </Badge>
            <Button size="sm" onClick={openNewGoalEditor}>
              <Plus className="h-4 w-4 mr-1" />
              Add goal
            </Button>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const actualProgress = (goal.currentAmount / goal.targetAmount) * 100;
            const displayProgress = animatedProgress[goal.id] ?? 0;
            const daysUntil = getDaysUntil(goal.deadline);
            
            return (
              <Card 
                key={goal.id} 
                className="p-4 sm:p-5 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => openEditGoalEditor(goal)}
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-primary dark:group-hover:text-[rgb(200,205,210)] transition-colors">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {goal.category}
                      </Badge>
                      {getStatusBadge(goal)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-[rgb(240,243,245)]">
                      {Math.round(displayProgress)}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <Progress value={Math.min(displayProgress, 100)} className="h-2.5" />
                </div>

                {/* Amounts */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Current</p>
                    <p className="font-semibold">R{goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Target</p>
                    <p className="font-semibold">R{goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground pt-3 border-t">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Target: {formatDate(goal.deadline)}
                    {daysUntil > 0 && (
                      <span className="ml-1">
                        ({daysUntil} {daysUntil === 1 ? 'day' : 'days'} remaining)
                      </span>
                    )}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State for Goals */}
        {goals.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">No goals yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first goal to start tracking your progress
                </p>
              </div>
              <Button className="mt-2" onClick={openNewGoalEditor}>
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Main Content - To-Do Section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListTodo className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">To-Do</h2>
          </div>
          <Button size="sm" onClick={addNewTodo}>
            <Plus className="h-4 w-4 mr-1" />
            Add to-do
          </Button>
        </div>

        {/* Active To-Dos Section */}
        {activeTodos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active To-Dos</h3>
                <Badge variant="outline" className="text-xs">
                  {activeTodos.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {editingTodoId && (
                  <span className="text-xs text-muted-foreground italic">
                    Sorting paused while editing
                  </span>
                )}
                <select
                  value={activeTodosSortBy}
                  onChange={(e) => setActiveTodosSortBy(e.target.value as 'date-asc' | 'date-desc' | 'group')}
                  className="text-xs px-2 py-1 rounded-md border border-border bg-background hover:bg-muted/50 cursor-pointer"
                  disabled={!!editingTodoId}
                >
                  <option value="date-asc">Date (Earliest)</option>
                  <option value="date-desc">Date (Latest)</option>
                  <option value="group">Group by Category</option>
                </select>
              </div>
            </div>
            <Card className="divide-y pt-[25px] pr-[0px] pb-[0px] pl-[0px] overflow-hidden">
              {activeTodos.map((todo) => {
                const daysUntil = getDaysUntil(todo.dueDate);
                const isOverdue = daysUntil < 0;
                const isDueSoon = daysUntil >= 0 && daysUntil <= 3;
                const isEditing = editingTodoId === todo.id;
                const isHovered = hoveredTodoId === todo.id;
                const hasChanges = hasUnsavedChanges(todo.id);
                const isDisabled = todo.suggestedByPako; // PAKO-suggested todos cannot be edited
                const canSave = hasChanges && todo.title.trim() !== '';

                return (
                  <div
                    key={todo.id}
                    className="sm:p-4 pt-[calc(0.75rem+1px)] sm:pt-[calc(1rem+1px)] hover:bg-muted/20 transition-colors group pt-[20px] pr-[16px] pb-[12px] pl-[16px] mt-[-25px] mr-[0px] mb-[0px] ml-[0px] relative"
                    onMouseEnter={() => setHoveredTodoId(todo.id)}
                    onMouseLeave={() => setHoveredTodoId(null)}
                  >
                    {/* Category color bar */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: getCategoryColor(todo.category) }}
                    />
                    <div className="flex items-start gap-3 bg-transparent">
                      {/* Checkbox */}
                      <button
                        className="flex-shrink-0 mt-1 transition-transform hover:scale-110 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTodoCheckbox(todo.id, !todo.completed);
                        }}
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0 space-y-2 bg-transparent">
                        {/* Title Input */}
                        <div className="flex items-center gap-2 bg-transparent">
                          <input
                            type="text"
                            value={todo.title}
                            onChange={(e) => {
                              if (!isDisabled && isEditing) {
                                updateTodoTitle(todo.id, e.target.value);
                              }
                            }}
                            onFocus={() => {
                              if (!isDisabled && isEditing) {
                                startEditingTodo(todo.id, todo.title, todo.category, todo.dueDate);
                              }
                            }}
                            onBlur={() => {
                              if (!isDisabled && isEditing) {
                                // Delete if empty
                                if (!todo.title.trim()) {
                                  deleteTodo(todo.id);
                                }
                              }
                            }}
                            placeholder="To-do name"
                            disabled={isDisabled || !isEditing}
                            className={`flex-1 text-sm sm:text-base font-medium bg-transparent border-none outline-none focus:outline-none px-0 py-0 ${isDisabled || !isEditing ? 'cursor-default' : ''}`}
                            autoFocus={isEditing && !todo.title}
                          />
                          
                          {/* Unsaved changes indicator */}
                          {hasChanges && !isDisabled && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" title="Unsaved changes" />
                          )}
                          
                          {/* Editing indicator */}
                          {isEditing && !isDisabled && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                Editing...
                              </span>
                            </div>
                          )}
                          
                          {/* Suggested by PAKO indicator */}
                          {todo.suggestedByPako && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10">
                              <BubblesIcon size={14} />
                              <span className="text-[10px] font-medium text-foreground">
                                Suggested by PAKO
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Category, Due Date, Actions */}
                        <div className="flex items-center gap-2 flex-wrap bg-transparent">
                          {/* Category Select */}
                          <select
                            value={todo.category}
                            onChange={(e) => {
                              if (!isDisabled && isEditing) {
                                startEditingTodo(todo.id, todo.title, todo.category, todo.dueDate);
                                updateTodoCategory(todo.id, e.target.value);
                              }
                            }}
                            disabled={isDisabled || !isEditing}
                            className={`text-xs px-2 py-1 rounded-md border border-border bg-transparent hover:bg-muted/50 ${isDisabled || !isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <option value="Goals">Goals</option>
                            <option value="Home">Home</option>
                            <option value="Finance">Finance</option>
                            <option value="Learning">Learning</option>
                            <option value="Settings">Settings</option>
                            <option value="Clinic">Clinic</option>
                            <option value="Rewards">Rewards</option>
                          </select>

                          {/* Due Date Picker - Only editable when in editing mode */}
                          {!isDisabled && isEditing ? (
                            <DatePicker
                              variant="todo"
                              value={new Date(todo.dueDate)}
                              onChange={(date) => {
                                if (date) {
                                  startEditingTodo(todo.id, todo.title, todo.category, todo.dueDate);
                                  updateTodoDueDate(todo.id, format(date, 'yyyy-MM-dd'));
                                }
                              }}
                              placeholder="Select due date"
                              className="h-auto py-0.5 px-2 text-xs border-0 hover:bg-muted/50 bg-transparent"
                            />
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-transparent px-2 py-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(todo.dueDate), 'PPP')}</span>
                            </div>
                          )}

                          {/* Status Badge */}
                          {isOverdue && (
                            <Badge variant="destructive" className="text-[10px] sm:text-xs h-5">
                              Overdue
                            </Badge>
                          )}
                          {isDueSoon && !isOverdue && (
                            <Badge className="text-[10px] sm:text-xs h-5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                              Due soon
                            </Badge>
                          )}

                          {/* Action Buttons */}
                          <div className="ml-auto flex items-center gap-2">
                            {/* Edit Mode: Save + Cancel */}
                            {isEditing && !isDisabled && (
                              <>
                                <button
                                  onClick={() => saveTodoChanges(todo.id)}
                                  disabled={!canSave}
                                  className={`flex items-center gap-1 text-xs transition-colors bg-transparent ${
                                    canSave 
                                      ? 'text-primary hover:text-primary/80' 
                                      : 'text-muted-foreground cursor-not-allowed opacity-50'
                                  }`}
                                >
                                  <Save className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Save</span>
                                </button>
                                <button
                                  onClick={() => cancelTodoEditing(todo.id)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Cancel</span>
                                </button>
                              </>
                            )}

                            {/* Hover Actions: Edit + Delete */}
                            {isHovered && !isEditing && (
                              <>
                                {!isDisabled && (
                                  <button
                                    onClick={() => {
                                      // Capture current sorted order before editing
                                      const currentActiveTodos = sortTodos(
                                        todos.filter(todo => !todo.completed),
                                        activeTodosSortBy
                                      );
                                      setEditModeOrderSnapshot(currentActiveTodos.map(t => t.id));
                                      
                                      setEditingTodoId(todo.id);
                                      startEditingTodo(todo.id, todo.title, todo.category, todo.dueDate);
                                    }}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-transparent"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteTodo(todo.id)}
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors bg-transparent"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* Completed (This Week) Section */}
        {completedThisWeek.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setCompletedSectionExpanded(!completedSectionExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {completedSectionExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
                <span>Completed (This Week)</span>
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                  {completedThisWeek.length}
                </Badge>
              </button>
              <select
                value={completedTodosSortBy}
                onChange={(e) => setCompletedTodosSortBy(e.target.value as 'date-asc' | 'date-desc' | 'group')}
                className="text-xs px-2 py-1 rounded-md border border-border bg-background hover:bg-muted/50 cursor-pointer"
              >
                <option value="date-asc">Date (Earliest)</option>
                <option value="date-desc">Date (Latest)</option>
                <option value="group">Group by Category</option>
              </select>
            </div>

            <AnimatePresence>
              {completedSectionExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Card className="divide-y opacity-70">
                    {completedThisWeek.map((todo) => {
                      const isHovered = hoveredTodoId === todo.id;

                      return (
                        <div
                          key={todo.id}
                          className="p-3 sm:p-4 hover:bg-muted/20 transition-colors group relative"
                          onMouseEnter={() => setHoveredTodoId(todo.id)}
                          onMouseLeave={() => setHoveredTodoId(null)}
                        >
                          {/* Category color bar */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1"
                            style={{ backgroundColor: getCategoryColor(todo.category) }}
                          />
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <button
                              className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTodoCheckbox(todo.id, false);
                              }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm sm:text-base font-medium line-through text-muted-foreground">
                                  {todo.title}
                                </h4>
                                
                                {/* Delete Button - Hover Only */}
                                {isHovered && (
                                  <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs opacity-60">
                                  {todo.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">
                                  Done
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State for To-Dos */}
        {todos.length === 0 && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <ListTodo className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first to-do to start organizing your financial tasks
                </p>
              </div>
              <Button className="mt-2" onClick={addNewTodo}>
                <Plus className="h-4 w-4 mr-2" />
                Add to-do
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Slide-Out Goal Editor Panel */}
      <AnimatePresence>
        {isEditorOpen && (
          <>
            {/* Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 w-full h-screen bg-black/40 backdrop-blur-sm z-40"
              onClick={handleCloseEditor}
            />

            {/* Slide-Out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full md:w-[75%] bg-white dark:bg-[#1f1f1f] z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 sm:p-8 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                      {editingGoal ? 'Edit Goal' : 'New Goal'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {editingGoal ? 'Update your goal details' : 'Create a new financial goal'}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleCloseEditor}>
                    <X className="h-5 w-5 text-black dark:text-white" />
                  </Button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {/* Goal Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black dark:text-white">
                      Goal name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Emergency Fund, New Car"
                      className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      disabled={editingGoal && !canEditGoal(editingGoal)}
                    />
                  </div>

                  {/* Goal Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black dark:text-white">Description (optional)</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of your goal"
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none hover:border-[#2F7F7A] transition-colors text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      disabled={editingGoal && !canEditGoal(editingGoal)}
                    />
                  </div>

                  {/* Goal Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black dark:text-white">
                      Goal type <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.goalType || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, goalType: e.target.value as Goal['goalType'], customGoalType: '' });
                        setCustomGoalTypeError('');
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white"
                      disabled={editingGoal && !canEditGoal(editingGoal)}
                    >
                      <option value="Save money">Save money</option>
                      <option value="Build emergency fund">Build emergency fund</option>
                      <option value="Grow wealth">Grow wealth</option>
                      <option value="Pay off debt">Pay off debt</option>
                      <option value="Reduce spending">Reduce spending</option>
                      <option value="Stay within budget">Stay within budget</option>
                      <option value="Increase income">Increase income</option>
                      <option value="Stabilise cash flow">Stabilise cash flow</option>
                      <option value="Prepare for an expense">Prepare for an expense</option>
                      <option value="Improve financial habits">Improve financial habits</option>
                      <option value="Complete financial setup">Complete financial setup</option>
                      <option value="Custom goal type">Custom goal type</option>
                    </select>
                  </div>

                  {/* Custom Goal Type Input */}
                  {formData.goalType === 'Custom goal type' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">
                        Custom goal type <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customGoalType || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
                          const charCount = value.length;

                          // Check limits
                          if (wordCount > 5) {
                            setCustomGoalTypeError('Please keep it to 5 words or less');
                          } else if (charCount > 25) {
                            setCustomGoalTypeError('Please keep it to 25 characters or less');
                          } else {
                            setCustomGoalTypeError('');
                          }

                          setFormData({ ...formData, customGoalType: value });
                        }}
                        placeholder="e.g., Invest in stocks"
                        className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        disabled={editingGoal && !canEditGoal(editingGoal)}
                      />
                      {customGoalTypeError && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {customGoalTypeError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black dark:text-white">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Goal['category'] })}
                      className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white"
                      disabled={editingGoal && !canEditGoal(editingGoal)}
                    >
                      <option value="Savings">Savings</option>
                      <option value="Emergency Fund">Emergency Fund</option>
                      <option value="Investment">Investment</option>
                      <option value="Debt">Debt</option>
                      <option value="Expenses">Expenses</option>
                      <option value="Housing">Housing</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Travel">Travel</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  {/* Tracking Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black dark:text-white">
                      Tracking method <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.trackingMethod || ''}
                      onChange={(e) => setFormData({ ...formData, trackingMethod: e.target.value as Goal['trackingMethod'] })}
                      className="w-full px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white"
                      disabled={editingGoal && !canEditGoal(editingGoal)}
                    >
                      <option value="Amount-based">Amount-based</option>
                      <option value="Time-based">Time-based</option>
                      <option value="Completion-based">Completion-based</option>
                    </select>
                  </div>

                  {/* Target Amount (only for Amount-based) */}
                  {formData.trackingMethod === 'Amount-based' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">
                        Target amount <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400">R</span>
                        <input
                          type="number"
                          value={formData.targetAmount || ''}
                          onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          min="0"
                          disabled={editingGoal && !canEditGoal(editingGoal)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Current Amount */}
                  {formData.trackingMethod === 'Amount-based' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">Current amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-600 dark:text-gray-400">R</span>
                        <input
                          type="number"
                          value={formData.currentAmount || ''}
                          onChange={(e) => setFormData({ ...formData, currentAmount: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full pl-8 pr-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary hover:border-[#2F7F7A] transition-colors text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                          min="0"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">
                        Start date <span className="text-destructive">*</span>
                      </label>
                      <DatePicker
                        variant="todo"
                        value={formData.startDate ? new Date(formData.startDate) : undefined}
                        onChange={(date) => {
                          if (date) {
                            setFormData({ ...formData, startDate: format(date, 'yyyy-MM-dd') });
                          }
                        }}
                        placeholder="Select start date"
                        className="h-auto py-2 px-3"
                        disabled={editingGoal && !canEditGoal(editingGoal)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black dark:text-white">
                        Due date <span className="text-destructive">*</span>
                      </label>
                      <DatePicker
                        variant="todo"
                        value={formData.deadline ? new Date(formData.deadline) : undefined}
                        onChange={(date) => {
                          if (date) {
                            setFormData({ ...formData, deadline: format(date, 'yyyy-MM-dd') });
                          }
                        }}
                        placeholder="Select due date"
                        className="h-auto py-2 px-3"
                        disabled={editingGoal && !canEditGoal(editingGoal)}
                      />
                    </div>
                  </div>

                  {/* Edit Warning */}
                  {editingGoal && !canEditGoal(editingGoal) && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        This goal cannot be edited as it's due within 1 day. You can still update the current amount.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
                    {/* Delete Button (if editing and deletable) */}
                    {editingGoal && (
                      <div>
                        {canDeleteGoal(editingGoal) ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        ) : (
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[200px]">
                              Cannot delete: goal is due within 1 day
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save/Cancel Buttons */}
                    <div className="flex items-center gap-2 ml-auto">
                      <Button 
                        variant="outline" 
                        onClick={handleCloseEditor}
                        className="dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveGoal}
                        disabled={!isFormValid() || !hasFormChanged()}
                      >
                        {editingGoal ? 'Save changes' : 'Create goal'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && editingGoal && (
          <>
            {/* Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowDeleteConfirm(false)}
            />

            {/* Confirmation Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Delete Goal?</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete "<span className="font-medium text-foreground">{editingGoal.title}</span>"? This action cannot be undone.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      if (editingGoal) {
                        deleteGoal(editingGoal.id);
                        setShowDeleteConfirm(false);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Warning Modal */}
      <AnimatePresence>
        {showUnsavedChangesWarning && (
          <>
            {/* Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowUnsavedChangesWarning(false)}
            />

            {/* Confirmation Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Unsaved Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    You have unsaved changes. Do you want to discard them?
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowUnsavedChangesWarning(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={forceCloseEditor}
                  >
                    Discard
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}