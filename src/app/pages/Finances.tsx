import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  Link2, 
  Upload, 
  CheckCircle2, 
  Plus, 
  Info,
  FileText,
  Loader2,
  XCircle,
  X
} from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { BubblesIcon } from '@/app/components/BubblesIcon';
import { SimpleCarousel, SimpleCarouselRef } from '@/app/components/Carousel';
import { useBubbles } from '@/app/contexts/BubblesContext';
import { useUser } from '@/app/contexts/UserContext';
import { mockUser, mockTransactions } from '@/app/data/mockData';

export function Finances() {
  const navigate = useNavigate();
  const { financialHealth } = mockUser;
  const { triggerCustomPopup } = useBubbles();
  const { addConnectedAccount, addUploadedStatement, getTotalAccountCount } = useUser();
  
  // State for account connection (toggle this to test both states)
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  const [connectedAccountsCount] = useState(1);
  const [connectedBankName] = useState('Capitec Bank');
  
  // State for upload statement modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Animation state - runs once on mount
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedProgressValues, setAnimatedProgressValues] = useState<Record<string, number>>({});
  
  // Calculate category spending
  const categorySpending = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const categories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a);

  // Budget allocations per category (as percentages of total budget)
  const categoryBudgets = {
    'Housing': financialHealth.budget * 0.35, // 35% for housing
    'Food': financialHealth.budget * 0.20, // 20% for food
    'Transport': financialHealth.budget * 0.15, // 15% for transport
    'Utilities': financialHealth.budget * 0.10, // 10% for utilities
    'Entertainment': financialHealth.budget * 0.10, // 10% for entertainment
    'Other': financialHealth.budget * 0.10, // 10% for other
  };

  // Combine spending with budgets for comparison
  const categoryComparisons = Object.entries(categoryBudgets).map(([category, budget]) => ({
    category,
    budget,
    spent: categorySpending[category] || 0,
    percentageUsed: ((categorySpending[category] || 0) / budget) * 100,
  })).sort((a, b) => b.spent - a.spent);

  // Load animations - run once on mount
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const duration = 1200; // 1.2 seconds for smooth animation
    const startTime = Date.now();
    
    const targetBalance = financialHealth.income - financialHealth.expenses;
    const targetIncome = financialHealth.income;
    const targetExpenses = financialHealth.expenses;
    
    // Calculate target progress values
    const targetMainProgress = (financialHealth.expenses / financialHealth.budget) * 100;
    const targetCategoryProgress: Record<string, number> = {};
    categoryComparisons.forEach((item) => {
      targetCategoryProgress[item.category] = item.percentageUsed;
    });

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation (ease-out)
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      // Animate summary amounts
      setAnimatedBalance(Math.round(targetBalance * easedProgress));
      setAnimatedIncome(Math.round(targetIncome * easedProgress));
      setAnimatedExpenses(Math.round(targetExpenses * easedProgress));
      
      // Animate progress bars
      const currentProgressValues: Record<string, number> = {
        main: targetMainProgress * easedProgress,
      };
      
      categoryComparisons.forEach((item) => {
        currentProgressValues[item.category] = targetCategoryProgress[item.category] * easedProgress;
      });
      
      setAnimatedProgressValues(currentProgressValues);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []); // Empty dependency array - runs once on mount

  return (
    <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F3D3E] dark:text-[rgb(240,243,245)]">Finances</h1>
        <p className="text-xs sm:text-sm md:text-base text-[#0F3D3E] dark:text-[rgb(240,243,245)]">Track your money flow and budget</p>
      </div>

      {/* Financial Data Connection Header */}
      {!isAccountConnected ? (
        // No Account Connected State
        <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#CE424B]/10 via-white dark:via-slate-800 to-[#B02D36]/10 border-2 border-[#CE424B]/40 dark:border-[#CE424B]/60 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            {/* Left Side - Info */}
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#CE424B] flex items-center justify-center flex-shrink-0 shadow-md">
                <Link2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-bold text-base sm:text-lg text-black dark:text-[rgb(240,243,245)]">Connect your financial data</h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-[rgb(200,205,210)] max-w-md">
                  Securely link your bank account for real-time insights and personalized guidance.
                </p>
                {/* Trust Signals */}
                <div className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 text-[10px] sm:text-xs text-gray-600 dark:text-[rgb(180,185,190)] pt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-[#B02D36] dark:bg-[#CE424B]" />
                    <span>Bank-level encryption</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-[#B02D36] dark:bg-[#CE424B]" />
                    <span>Read-only access</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - CTAs */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:flex-shrink-0">
              <Button 
                className="sm:min-w-[140px] md:min-w-[160px] bg-[#CE424B] hover:bg-[#B02D36] text-white shadow-md text-sm sm:text-base py-2 sm:py-2.5 cursor-pointer"
                onClick={() => {
                  addConnectedAccount();
                  setIsAccountConnected(true);
                }}
              >
                <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Connect Account
              </Button>
              <Button 
                variant="outline"
                className="sm:min-w-[140px] md:min-w-[160px] border-[#CE424B] text-[#CE424B] hover:bg-[#CE424B] hover:text-white text-sm sm:text-base py-2 sm:py-2.5 cursor-pointer"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Upload Statement
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        // Connected State
        <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-green-50/50 via-background to-green-50/50 dark:from-green-950/10 dark:via-background dark:to-green-950/10 border-green-200/50 dark:border-green-800/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            {/* Left Side - Confirmation */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">
                  {connectedAccountsCount} {connectedAccountsCount === 1 ? 'account' : 'accounts'} connected
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {connectedBankName} • Syncing automatically
                </p>
              </div>
            </div>
            
            {/* Right Side - Secondary Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[10px] sm:text-xs h-8"
                onClick={() => setIsAccountConnected(false)}
              >
                <Plus className="h-3 w-3 mr-1 sm:mr-1.5" />
                Add another
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[10px] sm:text-xs text-foreground hover:text-white h-8"
              >
                Manage connections
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Monthly Income - Two Slide Carousel - Spans 2 columns on mobile */}
        <div className="col-span-2 md:col-span-1">
          <IncomeCarousel 
            total={animatedIncome}
            categories={mockUser.incomeCategories}
          />
        </div>

        {/* Monthly Expenses - Two Slide Carousel - Spans 2 columns on mobile */}
        <div className="col-span-2 md:col-span-1">
          <ExpenseCarousel 
            total={animatedExpenses}
            categories={mockUser.expenseCategories}
          />
        </div>

        {/* Current Balance - Spans 2 columns on mobile */}
        <div className="col-span-2 md:col-span-1">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow group flex flex-col pt-[20px] pr-[20px] pb-[20px] pl-[20px] sm:pt-[24px] sm:pr-[24px] sm:pb-[37px] sm:pl-[24px]" onClick={() => navigate('/monthly-budget')}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-[rgb(180,185,190)]">Current Balance</p>
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" style={{ color: '#DC2387' }} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold mb-1 dark:text-[rgb(240,243,245)]" style={{ color: '#DC2387' }}>
              R{animatedBalance.toLocaleString()}
            </p>
            <div className="mt-auto">
              <div className="flex items-center gap-1 text-xs cursor-pointer hover:underline dark:text-[rgb(200,205,210)]" style={{ color: '#DC2387', marginTop: '-10pt' }}>
                <span>View budget</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Budget Progress */}
      <Card className="p-4 sm:p-6 space-y-4 sm:space-y-5 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/monthly-budget')}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Monthly Budget</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              R{financialHealth.remaining.toLocaleString()} remaining
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-primary dark:text-[rgb(240,243,245)]">
              {Math.round((financialHealth.remaining / financialHealth.budget) * 100)}%
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">of budget left</p>
          </div>
        </div>

        {/* Budget vs Expenditure Graph */}
        <div className="space-y-2 sm:space-y-3">
          {/* Stacked Bar Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
              <span>Budget vs Spent</span>
              <span>{Math.round((financialHealth.expenses / financialHealth.budget) * 100)}% used</span>
            </div>
            
            {/* Horizontal Stacked Bar */}
            <div className="relative w-full h-8 sm:h-10 bg-muted/30 rounded-full overflow-hidden">
              {/* Spent Amount */}
              <div 
                className={`absolute left-0 top-0 h-full transition-all duration-500 rounded-full ${
                  financialHealth.expenses > financialHealth.budget 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500' // Muted warning tone
                    : 'bg-gradient-to-r from-primary to-primary/80'
                }`}
                style={{ 
                  width: `${Math.min((financialHealth.expenses / financialHealth.budget) * 100, 100)}%` 
                }}
              />
              
              {/* Amount Labels Inside Bar */}
              <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-4 text-[10px] sm:text-xs font-medium">
                <span className="text-white drop-shadow-sm">
                  R{financialHealth.expenses.toLocaleString()} spent
                </span>
                {financialHealth.remaining > 0 && (
                  <span className="text-foreground hidden sm:inline">
                    R{financialHealth.budget.toLocaleString()} budget
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar (existing style) */}
          <Progress 
            value={animatedProgressValues.main || 0} 
            className="h-2"
          />
        </div>

        {/* Bubbles Insight - Contextual Messaging */}
        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex-shrink-0 mt-0.5">
            <BubblesIcon />
          </div>
          <div className="flex-1 space-y-0.5 sm:space-y-1">
            <p className="text-[10px] sm:text-xs font-semibold text-primary dark:text-[rgb(200,205,210)]">Bubbles says</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {financialHealth.expenses <= financialHealth.budget * 0.75 
                ? "Nice work — you're managing your budget well so far this month."
                : financialHealth.expenses <= financialHealth.budget * 0.95
                ? "You're getting close to your budget — want to take a quick look at your spending?"
                : financialHealth.expenses <= financialHealth.budget
                ? "Almost at your budget limit. A small check-in now could help you stay on track."
                : "Looks like this month was a bit tight — that happens. Want help adjusting things for next month?"
              }
            </p>
          </div>
        </div>

        {/* Budget vs Expenditure by Category - Double Bar Graph */}
        <div className="space-y-3 sm:space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-semibold">Budget vs Spending by Category</h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Per category breakdown</p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {categoryComparisons.map((item) => (
              <div key={item.category} className="space-y-1.5 sm:space-y-2">
                {/* Category Name and Amounts */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                    <span className="text-muted-foreground hidden sm:inline">
                      R{item.spent.toLocaleString()} / R{item.budget.toLocaleString()}
                    </span>
                    <span className={`font-semibold ${
                      item.percentageUsed > 100 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : item.percentageUsed > 90
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {Math.round(item.percentageUsed)}%
                    </span>
                  </div>
                </div>

                {/* Double Bar Graph */}
                <div className="space-y-1.5">
                  {/* Budget Bar (lighter, background) */}
                  <div className="relative w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-muted/60 rounded-full"
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  {/* Spent Bar (colored, overlaid) */}
                  <div className="relative w-full h-2 -mt-3.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.percentageUsed > 100
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                          : item.percentageUsed > 90
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : 'bg-gradient-to-r from-primary to-primary/80'
                      }`}
                      style={{ 
                        width: `${Math.min(animatedProgressValues[item.category] || 0, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Credit Score */}
      <Card className="p-4 sm:p-6">
        {/* Split Layout Container */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Left Side - Circular Progress Indicator */}
          <div className="flex-1 flex flex-col items-center justify-center py-3 sm:py-4">
            {/* Circular Progress Ring */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              {/* Background Circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/20"
                />
                {/* Progress Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - 0.685)}`}
                />
              </svg>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl sm:text-4xl font-bold text-foreground">685</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Credit Score</p>
              </div>
            </div>
            
            {/* Badge and Last Updated */}
            <div className="mt-3 sm:mt-4 text-center space-y-0.5 sm:space-y-1">
              <Badge variant="outline" className="text-xs">Good</Badge>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Last updated: Jan 15, 2026</p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-border" />
          <div className="md:hidden h-px bg-border" />

          {/* Right Side - Bubbles Insights */}
          <div className="flex-1 flex flex-col justify-center space-y-3 sm:space-y-4">
            {/* Bubbles Insight Header */}
            <div className="flex items-start gap-2.5 sm:gap-3">
              {/* Bubbles Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <BubblesIcon />
              </div>

              {/* Insight Content */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <h4 className="font-semibold text-xs sm:text-sm text-primary dark:text-[rgb(200,205,210)]">Improve your credit score</h4>
                
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <p className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-primary mt-0.5 sm:mt-1">•</span>
                    <span>Paying accounts on time has the biggest impact on your score.</span>
                  </p>
                  <p className="flex items-start gap-1.5 sm:gap-2">
                    <span className="text-primary mt-0.5 sm:mt-1">•</span>
                    <span>Keeping balances low can help boost your score over time.</span>
                  </p>
                </div>

                {/* Learn More Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 hover:bg-teal-600 hover:text-white hover:border-teal-600 text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerCustomPopup({
                      messages: [
                        "Your credit score is a number between 300 and 850 that shows how well you manage credit and debt.",
                        "It helps lenders decide if they'll approve you for loans, credit cards, or even rental applications.",
                        "A higher score means better interest rates and more financial opportunities!"
                      ],
                      actionButton: {
                        label: "Learn about Credit Scores",
                        onClick: () => navigate('/learning')
                      }
                    });
                  }}
                >
                  <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          Upcoming Bills
        </h3>
        <div className="space-y-2">
          {[
            { name: 'Water Bill', amount: 350, date: 'Jan 20', daysUntil: 4 },
            { name: 'Phone Bill', amount: 450, date: 'Jan 25', daysUntil: 9 },
            { name: 'Internet', amount: 699, date: 'Jan 28', daysUntil: 12 },
          ].map((bill, index) => {
            // Determine urgency color based on days until due
            // Green: 10+ days (plenty of time)
            // Yellow: 5-9 days (upcoming soon)
            // Orange: 3-4 days (due soon)
            // Red: 0-2 days (urgent)
            const urgencyColor = bill.daysUntil >= 10
              ? 'bg-green-500 dark:bg-green-400' 
              : bill.daysUntil >= 5
              ? 'bg-yellow-500 dark:bg-yellow-400' 
              : bill.daysUntil >= 3
              ? 'bg-orange-500 dark:bg-orange-400'
              : 'bg-red-500 dark:bg-red-400';
            
            return (
              <div key={index} className="flex items-stretch gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg">
                {/* Urgency Color Indicator */}
                <div className={`w-1 rounded-full ${urgencyColor} flex-shrink-0`} />
                
                {/* Bill Content */}
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{bill.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {bill.date} • due in {bill.daysUntil} {bill.daysUntil === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  <p className="font-bold text-sm sm:text-base">R{bill.amount}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upload Statement Modal */}
      <UploadStatementModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadStatus('idle');
          setSelectedFile(null);
        }}
        uploadStatus={uploadStatus}
        setUploadStatus={setUploadStatus}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef}
        onStatementUploaded={addUploadedStatement}
      />
    </div>
  );
}

// Income Carousel Component with Arrow Navigation
interface IncomeCarouselProps {
  total: number;
  categories: {
    category: string;
    amount: number;
    color: string;
  }[];
}

function IncomeCarousel({ total, categories }: IncomeCarouselProps) {
  const navigate = useNavigate();
  const sliderRef = useRef<SimpleCarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Sort categories by amount (largest first)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleCardClick = () => {
    navigate('/income-details');
  };

  return (
    <Card 
      className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow flex flex-col pt-[20px] pr-[20px] pb-[20px] pl-[20px] sm:pt-[24px] sm:pr-[24px] sm:pb-[20px] sm:pl-[24px]"
      onClick={handleCardClick}
    >
      {/* Static Header with Title and Icon - doesn't move with slides */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">Monthly Income</p>
        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" style={{ color: '#16A34A' }} />
      </div>

      {/* Left Arrow - Only show on Slide 2 */}
      {currentSlide === 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-all opacity-0 group-hover:opacity-40 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      {/* Right Arrow - Only show on Slide 1 */}
      {currentSlide === 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-all opacity-0 group-hover:opacity-40 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      <div className="flex-1 flex flex-col px-[2px] py-[0px]">
        <SimpleCarousel ref={sliderRef} {...settings}>
          {/* Slide 1: Summary View */}
          <div className="outline-none">
            <div className="flex flex-col" style={{ minHeight: '100px' }}>
              <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#16A34A' }}>
                R{total.toLocaleString()}
              </p>
              <div className="mt-auto">
                <div className="flex items-center gap-1 text-xs cursor-pointer hover:underline mt-2" style={{ color: '#16A34A' }}>
                  <span>View breakdown</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: Category Breakdown */}
          <div className="outline-none">
            <div className="space-y-2 sm:space-y-3">
              {/* Segmented Horizontal Bar */}
              <div className="w-full h-5 sm:h-6 flex rounded-full overflow-hidden">
                {sortedCategories.map((cat, idx) => {
                  const percentage = (cat.amount / total) * 100;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: cat.color,
                      }}
                      className="transition-all"
                      title={`${cat.category}: ${percentage.toFixed(1)}%`}
                    />
                  );
                })}
              </div>

              {/* Category Labels */}
              <div className="space-y-1">
                {sortedCategories.map((cat, idx) => {
                  const percentage = (cat.amount / total) * 100;
                  return (
                    <div key={idx} className="flex items-center justify-between text-[10px] sm:text-xs">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-muted-foreground truncate">{cat.category}</span>
                      </div>
                      <span className="font-medium whitespace-nowrap ml-1">
                        {percentage.toFixed(0)}% • R{cat.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SimpleCarousel>
      </div>
    </Card>
  );
}

// Expense Carousel Component with Arrow Navigation
interface ExpenseCarouselProps {
  total: number;
  categories: {
    category: string;
    amount: number;
    color: string;
  }[];
}

function ExpenseCarousel({ total, categories }: ExpenseCarouselProps) {
  const navigate = useNavigate();
  const sliderRef = useRef<SimpleCarouselRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Sort categories by amount (largest first)
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleCardClick = () => {
    navigate('/expense-details');
  };

  return (
    <Card 
      className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow flex flex-col pt-[20px] pr-[20px] pb-[20px] pl-[20px] sm:pt-[24px] sm:pr-[24px] sm:pb-[20px] sm:pl-[24px]"
      onClick={handleCardClick}
    >
      {/* Static Header with Title and Icon - doesn't move with slides */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">Monthly Expenses</p>
        <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" style={{ color: '#EF1E0E' }} />
      </div>

      {/* Left Arrow - Only show on Slide 2 */}
      {currentSlide === 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-all opacity-0 group-hover:opacity-40 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      {/* Right Arrow - Only show on Slide 1 */}
      {currentSlide === 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/80 hover:bg-background transition-all opacity-0 group-hover:opacity-40 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full max-w-full">
        <div className="overflow-hidden w-full">
          <SimpleCarousel ref={sliderRef} {...settings}>
            {/* Slide 1: Summary View */}
            <div className="outline-none w-full max-w-full">
              <div className="flex flex-col w-full" style={{ minHeight: '100px' }}>
                <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#EF1E0E' }}>
                  R{total.toLocaleString()}
                </p>
                <div className="mt-auto">
                  <div className="flex items-center gap-1 text-xs cursor-pointer hover:underline" style={{ color: '#EF1E0E' }}>
                    <span>View breakdown</span>
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Category Breakdown */}
            <div className="outline-none w-full max-w-full">
              <div className="space-y-2 sm:space-y-3 w-full px-[2px] py-[0px]">
                {/* Segmented Horizontal Bar */}
                <div className="w-full h-5 sm:h-6 flex rounded-full overflow-hidden">
                  {sortedCategories.map((cat, idx) => {
                    const percentage = (cat.amount / total) * 100;
                    return (
                      <div
                        key={idx}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                        }}
                        className="transition-all"
                        title={`${cat.category}: ${percentage.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>

                {/* Category Labels */}
                <div className="space-y-1">
                  {sortedCategories.map((cat, idx) => {
                    const percentage = (cat.amount / total) * 100;
                    return (
                      <div key={idx} className="flex items-center justify-between text-[10px] sm:text-xs">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-muted-foreground truncate">{cat.category}</span>
                        </div>
                        <span className="font-medium whitespace-nowrap ml-1">
                          {percentage.toFixed(0)}% • R{cat.amount.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SimpleCarousel>
        </div>
      </div>
    </Card>
  );
}

// Upload Statement Modal Component
interface UploadStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadStatus: 'idle' | 'scanning' | 'success' | 'error';
  setUploadStatus: (status: 'idle' | 'scanning' | 'success' | 'error') => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onStatementUploaded: () => void;
}

function UploadStatementModal({
  isOpen,
  onClose,
  uploadStatus,
  setUploadStatus,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  onStatementUploaded,
}: UploadStatementModalProps) {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadStatus('scanning');
      
      // Simulate PDF scanning - randomly decide if document is fine or not
      setTimeout(() => {
        const isValid = Math.random() > 0.3; // 70% success rate
        setUploadStatus(isValid ? 'success' : 'error');
      }, 2500);
    } else if (file) {
      // Not a PDF
      alert('Please upload a PDF file');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg pointer-events-auto bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-lg font-bold">Upload Bank Statement</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a PDF of your bank statement for analysis
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-xl p-8 transition-colors ${
              uploadStatus === 'idle' 
                ? 'border-muted-foreground/25 hover:border-primary/50 cursor-pointer' 
                : 'border-muted-foreground/10'
            }`}
            onClick={() => uploadStatus === 'idle' && fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                {/* Idle State */}
                {uploadStatus === 'idle' && (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Choose a PDF file</p>
                      <p className="text-sm text-muted-foreground">
                        Click to browse or drag and drop your bank statement
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}>
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </>
                )}

                {/* Scanning State */}
                {uploadStatus === 'scanning' && (
                  <>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Scanning document...</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Verifying format and readability
                      </p>
                    </div>
                  </>
                )}

                {/* Success State */}
                {uploadStatus === 'success' && (
                  <>
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-green-600 dark:text-green-400">Document is fine!</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Your statement is ready to be processed
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReset}
                    >
                      Upload Different File
                    </Button>
                  </>
                )}

                {/* Error State */}
                {uploadStatus === 'error' && (
                  <>
                    <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-red-600 dark:text-red-400">Document not fine</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Please upload another statement
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReset}
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Try Another File
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground">
              {uploadStatus === 'success' ? 'Ready to proceed' : 'PDF files only'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              {uploadStatus === 'success' && (
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    if (selectedFile) {
                      onStatementUploaded();
                    }
                    handleClose();
                  }}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}