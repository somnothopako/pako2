import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { mockUser, mockTransactions } from '@/app/data/mockData';
import { SimpleCarousel, SimpleCarouselRef } from '@/app/components/Carousel';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowLeft, Edit2, Save, X, Check, Trash2, CheckCircle2, XCircle, TrendingDown, Plus } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

// Transaction type for editable expenses
type EditableTransaction = {
  id: string;
  category: string;
  date: string;
  amount: string;
  paid: boolean;
  description: string;
};

export function ExpenseDetails() {
  const navigate = useNavigate();
  const sliderRef = useRef<SimpleCarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Theme detection
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Popup state
  const [popup, setPopup] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  // Recent expense transactions
  const expenseTransactions = mockTransactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Editable transactions state
  const initialTransactions: EditableTransaction[] = expenseTransactions.map(t => ({
    id: t.id,
    category: t.category,
    date: t.date,
    amount: t.amount.toString(),
    paid: true,
    description: t.description
  }));

  const [editableTransactions, setEditableTransactions] = useState<EditableTransaction[]>(initialTransactions);
  const [history, setHistory] = useState<EditableTransaction[][]>([initialTransactions]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Add a new history state
  const addToHistory = (newState: EditableTransaction[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setHasUnsavedChanges(true);
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEditableTransactions(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEditableTransactions(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
    }
  };

  // Add new entry
  const handleAddEntry = () => {
    const newEntry: EditableTransaction = {
      id: `new-${Date.now()}`,
      category: '',
      date: '',
      amount: '',
      paid: false,
      description: 'New Expense'
    };
    const newTransactions = [...editableTransactions, newEntry];
    setEditableTransactions(newTransactions);
    addToHistory(newTransactions);
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    const newTransactions = editableTransactions.filter(t => t.id !== id);
    setEditableTransactions(newTransactions);
    addToHistory(newTransactions);
  };

  // Update field
  const handleUpdateField = (id: string, field: keyof EditableTransaction, value: string | boolean) => {
    const newTransactions = editableTransactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    );
    setEditableTransactions(newTransactions);
    addToHistory(newTransactions);
  };

  // Validate all entries
  const validateEntries = (): boolean => {
    return editableTransactions.every(t => {
      // Check all required fields are filled
      if (!t.category.trim() || !t.date.trim() || !t.amount.trim()) {
        return false;
      }
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(t.date)) {
        return false;
      }
      // Validate amount is a positive number
      const amount = parseFloat(t.amount);
      if (isNaN(amount) || amount <= 0) {
        return false;
      }
      return true;
    });
  };

  // Save changes
  const handleSave = () => {
    if (validateEntries()) {
      // Here you would typically save to a backend
      console.log('Saving transactions:', editableTransactions);
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      setEditingCell(null);
      setPopup({
        visible: true,
        type: 'success',
        message: 'Changes saved successfully!',
      });
    } else {
      setPopup({
        visible: true,
        type: 'error',
        message: 'Please fill all fields correctly:\n- All fields are required\n- Date format: YYYY-MM-DD\n- Amount must be a positive number',
      });
    }
  };

  // Cancel changes
  const handleCancel = () => {
    // Reset to last saved state (first item in history)
    setEditableTransactions(history[0]);
    setHistoryIndex(0);
    setHistory([history[0]]);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    setEditingCell(null);
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditMode(true);
  };

  // Calculate total
  const calculateTotal = () => {
    return editableTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    easing: 'ease-in-out',
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  // Prepare donut chart data with warm color palette for expenses
  const pieData = mockUser.expenseCategories.map((cat, index) => {
    // Custom color palette for expenses
    const colorPalette = [
      '#d90429', // Red - Housing
      '#10b981', // Green - Food (distinct from Housing)
      '#8d99ae', // Blue gray - Transport
      '#2b2d42', // Dark blue - Utilities
      '#ffba08', // Yellow/Gold - Other
    ];
    
    let color = colorPalette[index % colorPalette.length];
    
    // Use lighter color for Utilities in dark mode
    if (cat.category === 'Utilities' && isDarkMode) {
      color = '#a0c4ff'; // Light blue for dark mode
    }
    
    return {
      name: cat.category,
      value: cat.amount,
      color: color,
    };
  });

  // Calculate total expenses for current month
  const totalExpenses = mockUser.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);

  // Prepare line chart data - 6 month window centered on current month (Jan 2026)
  const lineData = [
    { month: 'Aug', expenses: 13200 },
    { month: 'Sep', expenses: 13800 },
    { month: 'Oct', expenses: 13500 },
    { month: 'Nov', expenses: 14000 },
    { month: 'Dec', expenses: 13700 },
    { month: 'Jan', expenses: totalExpenses }, // Current month
    { month: 'Feb', expenses: null }, // Future - no data
    { month: 'Mar', expenses: null }, // Future - no data
  ];

  // Key insights data for expenses
  const insights = [
    { 
      text: "Your expenses decreased by 3% compared to last month", 
      type: "positive" as const 
    },
    { 
      text: "Housing is your largest expense category", 
      type: "neutral" as const 
    },
    { 
      text: "Transport costs have been stable for 3 months", 
      type: "neutral" as const 
    },
    { 
      text: "You're staying within your budget consistently", 
      type: "positive" as const 
    },
  ];

  // Group insights by type
  const positiveInsights = insights.filter(i => i.type === 'positive');
  const neutralInsights = insights.filter(i => i.type === 'neutral');

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/finances')}
            className="mr-3 hover:bg-[#2F7F7A]/10 dark:hover:bg-[#2F7F7A]/20"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Monthly Expenses</h1>
            <p className="text-sm text-muted-foreground">Breakdown for this month</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 max-w-6xl mx-auto">
        {/* Graphs Section - Slidable */}
        <Card className="relative overflow-hidden group">
          {/* Pagination Dots */}
          <div className="absolute top-4 right-4 z-10 flex gap-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => sliderRef.current?.slickGoTo(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx 
                    ? 'w-6 bg-primary' 
                    : 'w-1.5 bg-muted-foreground/30'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Left Arrow - Show on slides 2, 3, and 4 */}
          {currentSlide > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-opacity duration-300 ${
                isEditMode && currentSlide === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          {/* Right Arrow - Show on slides 1, 2, and 3 */}
          {currentSlide < 3 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 hover:bg-background shadow-lg transition-opacity duration-300 ${
                isEditMode && currentSlide === 1 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Next slide"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          <SimpleCarousel ref={sliderRef} {...settings}>
            {/* Slide 1: Donut Chart - Expense Categories */}
            <div className="outline-none">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Expense Categories</h3>
                  <p className="text-sm text-muted-foreground">How your expenses are distributed</p>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => {
                          const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill } = props;
                          const RADIAN = Math.PI / 180;
                          // Position text outside the pie chart
                          const radius = outerRadius + 30;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text 
                              x={x} 
                              y={y} 
                              fill={fill}
                              textAnchor={x > cx ? 'start' : 'end'} 
                              dominantBaseline="central"
                              fontSize="12"
                              fontWeight="500"
                            >
                              {`${name} ${(percent * 100).toFixed(0)}%`}
                            </text>
                          );
                        }}
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={0}
                      >
                        {pieData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `R${value.toLocaleString()}`}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : 'black'
                        }}
                        labelStyle={{ color: isDarkMode ? 'white' : 'black' }}
                        itemStyle={{ color: isDarkMode ? 'white' : 'black' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Slide 2: Expense Table (Editable) */}
            <div className="outline-none">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Expense Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Detailed category information</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditMode ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleEdit}
                        className="h-8"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleUndo}
                          disabled={historyIndex === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRedo}
                          disabled={historyIndex === history.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAddEntry}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCancel}
                          className="h-8"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleSave}
                          disabled={!hasUnsavedChanges}
                          className="h-8 bg-teal-600 hover:bg-teal-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-3 font-semibold text-sm text-muted-foreground">Category</th>
                        <th className="text-left pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                        <th className="text-right pb-3 font-semibold text-sm text-muted-foreground">Amount</th>
                        <th className="text-right pb-3 font-semibold text-sm text-muted-foreground pr-8">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editableTransactions.map((transaction) => {
                        const isEditingCategory = editingCell?.id === transaction.id && editingCell?.field === 'category';
                        const isEditingDate = editingCell?.id === transaction.id && editingCell?.field === 'date';
                        const isEditingAmount = editingCell?.id === transaction.id && editingCell?.field === 'amount';
                        
                        return (
                          <tr key={transaction.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors group">
                            <td className="py-4">
                              {isEditingCategory ? (
                                <input
                                  type="text"
                                  value={transaction.category}
                                  onChange={(e) => handleUpdateField(transaction.id, 'category', e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                  className="px-2 py-1 text-sm border border-primary rounded bg-primary/10 focus:outline-none focus:ring-1 focus:ring-primary"
                                  placeholder="Category"
                                />
                              ) : (
                                <span
                                  onClick={() => isEditMode && setEditingCell({ id: transaction.id, field: 'category' })}
                                  className={isEditMode ? "cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors" : "px-2 py-1"}
                                >
                                  {transaction.category || 'Click to edit'}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {isEditingDate ? (
                                <input
                                  type="date"
                                  value={transaction.date}
                                  onChange={(e) => handleUpdateField(transaction.id, 'date', e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  autoFocus
                                  className="px-2 py-1 text-sm border border-primary rounded bg-primary/10 focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              ) : (
                                <span
                                  onClick={() => isEditMode && setEditingCell({ id: transaction.id, field: 'date' })}
                                  className={isEditMode ? "cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors inline-block" : "px-2 py-1 inline-block"}
                                >
                                  {transaction.date ? new Date(transaction.date).toLocaleDateString('en-ZA', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  }) : 'Click to edit'}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right font-semibold">
                              {isEditingAmount ? (
                                <div className="flex items-center justify-end gap-1">
                                  <span className="text-sm">R</span>
                                  <input
                                    type="number"
                                    value={transaction.amount}
                                    onChange={(e) => handleUpdateField(transaction.id, 'amount', e.target.value)}
                                    onBlur={() => setEditingCell(null)}
                                    autoFocus
                                    className="w-24 px-2 py-1 text-sm border border-primary rounded bg-primary/10 text-right focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                              ) : (
                                <span
                                  onClick={() => isEditMode && setEditingCell({ id: transaction.id, field: 'amount' })}
                                  className={isEditMode ? "cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors inline-block" : "px-2 py-1 inline-block"}
                                >
                                  {transaction.amount ? `R${parseFloat(transaction.amount).toLocaleString()}` : 'Click to edit'}
                                </span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={transaction.paid}
                                  onChange={(e) => isEditMode && handleUpdateField(transaction.id, 'paid', e.target.checked)}
                                  disabled={!isEditMode}
                                  className="h-4 w-4 rounded border-primary text-blue-600 focus:ring-primary cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {isEditMode && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteEntry(transaction.id)}
                                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/20"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="border-t-2 border-border">
                        <td className="py-4 font-bold" colSpan={2}>Total</td>
                        <td className="py-4 text-right font-bold">
                          R{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-4"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Slide 3: Expense Trend (Line Graph) */}
            <div className="outline-none">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Expense Trend</h3>
                  <p className="text-sm text-muted-foreground">6-month view centered on current month</p>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        stroke={isDarkMode ? 'white' : 'black'}
                        tick={{ fontSize: 12, fill: isDarkMode ? 'white' : 'black' }}
                      />
                      <YAxis 
                        stroke={isDarkMode ? 'white' : 'black'}
                        tick={{ fontSize: 12, fill: isDarkMode ? 'white' : 'black' }}
                        tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value: number | null) => value !== null ? `R${value.toLocaleString()}` : 'No data'}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        dataKey="expenses" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#f97316' }}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Slide 4: Key Trends & Insights (Bubble Style) */}
            <div className="outline-none">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">Key Trends & Insights</h3>
                  <p className="text-sm text-muted-foreground">What we've noticed about your expenses</p>
                </div>
                <div className="h-[320px] flex flex-col justify-center gap-4 py-4">
                  {positiveInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="px-5 py-4 rounded-full border-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02] bg-green-50 border-green-500 text-green-700 dark:bg-green-950/30 dark:border-green-600 dark:text-green-400"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-4 w-4 flex-shrink-0" />
                        <span>{insight.text}</span>
                      </div>
                    </div>
                  ))}
                  {neutralInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="px-5 py-4 rounded-full border-2 text-sm font-medium transition-all duration-300 hover:scale-[1.02] bg-blue-50/50 border-blue-300 text-blue-600 dark:bg-blue-950/10 dark:border-blue-700 dark:text-blue-500"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-current flex-shrink-0" />
                        <span>{insight.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SimpleCarousel>
        </Card>

        {/* Recent Expense Activity */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-lg">Recent Expenses</h3>
            <p className="text-sm text-muted-foreground">Your latest expense entries</p>
          </div>
          <div className="space-y-2">
            {expenseTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    -R{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Popup */}
      {popup.visible && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-in fade-in duration-200"
          onClick={() => setPopup({ visible: false, type: 'success', message: '' })}
        >
          <div
            className={`
              bg-background p-6 rounded-2xl shadow-2xl max-w-md w-full
              animate-in zoom-in-95 duration-200
              ${popup.type === 'success' ? 'border-2 border-green-500' : 'border-2 border-red-500'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center gap-4">
              {popup.type === 'success' ? (
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-bold text-lg">
                  {popup.type === 'success' ? 'Success!' : 'Validation Error'}
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {popup.message}
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => setPopup({ visible: false, type: 'success', message: '' })}
                className={`w-full mt-2 ${
                  popup.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}