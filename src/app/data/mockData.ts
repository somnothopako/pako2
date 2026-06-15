// Mock data for PAKO financial wellness app

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface BudgetEntry {
  id: string;
  category: string;
  description: string;
  amount: string;
  frequency: 'Once' | 'Monthly';
  status: 'Planned' | 'Spent';
  type: 'income' | 'expense';
  date: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  pointsReward: number;
  category: string;
  completedDate?: string; // ISO date string for when course was completed
}

export interface UserData {
  name: string;
  email: string;
  username: string;
  pakoId: string;
  points: number;
  hasConnectedFinances: boolean;
  financialHealth: {
    score: number;
    income: number;
    expenses: number;
    budget: number;
    remaining: number;
    savings: number;
  };
  creditScore: {
    score: number;
    maxScore: number;
    rating: string;
    trend: 'up' | 'down' | 'stable';
  };
  incomeCategories: {
    category: string;
    amount: number;
    color: string;
  }[];
  expenseCategories: {
    category: string;
    amount: number;
    color: string;
  }[];
}

export const mockUser: UserData = {
  name: "Thabang",
  email: "kerry@example.com",
  username: "kerry_m",
  pakoId: "PK8421563",
  points: 1250,
  hasConnectedFinances: true,
  financialHealth: {
    score: 72,
    income: 18500,
    expenses: 14200,
    budget: 16000,
    remaining: 2500,
    savings: 4300,
  },
  creditScore: {
    score: 750,
    maxScore: 850,
    rating: "Good",
    trend: "up",
  },
  incomeCategories: [
    { category: "Salary", amount: 18500, color: "#6a994e" }, // Medium green
    { category: "Freelance", amount: 2500, color: "#bc4749" }, // Red-brown
    { category: "Investments", amount: 500, color: "#f2e8cf" }, // Beige
  ],
  expenseCategories: [
    { category: "Housing", amount: 6500, color: "#d90429" }, // Red
    { category: "Food", amount: 3200, color: "#10b981" }, // Green (distinct from Housing)
    { category: "Transport", amount: 2500, color: "#8d99ae" }, // Blue gray
    { category: "Utilities", amount: 1500, color: "#2b2d42" }, // Dark blue
    { category: "Other", amount: 500, color: "#ffba08" }, // Yellow/Gold
  ],
};

// Previous month comparison data
export const previousMonthData = {
  income: 18000,
  expenses: 14500,
  remaining: 2200,
};

// Investment data (mock)
export const mockInvestmentData = {
  etf: {
    name: "Satrix Top 40",
    ticker: "STX40",
    value: 12500,
    change: 2.3,
    trend: "up" as const,
  },
  unitTrusts: [
    {
      id: "1",
      name: "Allan Gray Balanced",
      value: 8200,
      change: 1.5,
    },
    {
      id: "2",
      name: "Coronation Equity",
      value: 5600,
      change: -0.3,
    },
  ],
  insurancePolicies: [
    {
      id: "1",
      name: "Life Cover",
      provider: "Old Mutual",
      premium: 450,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Medical Aid",
      provider: "Discovery",
      premium: 2100,
      status: "active" as const,
    },
    {
      id: "3",
      name: "Car Insurance",
      provider: "Outsurance",
      premium: 850,
      status: "active" as const,
    },
  ],
  jse: {
    index: "JSE Top 40",
    value: 72450,
    change: 0.8,
    trend: "up" as const,
  },
};

// Learning progress summary
export const learningProgress = {
  streak: 7, // consecutive days learning
  coursesInProgress: 2,
  totalCourses: 4,
  completedLessons: 10,
  totalLessons: 36,
  pointsEarned: 100,
};

// Rewards progress summary
export const rewardsProgress = {
  pointsBalance: 1250, // matches mockUser.points
  pointsEarned: 350, // points earned this month
  pointsExpiringSoon: 50, // points expiring in next 30 days
  activeRewards: 3, // rewards user can currently afford
};

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    amount: 18500,
    type: "income",
    category: "Salary",
    date: "2026-01-01",
  },
  {
    id: "2",
    description: "Rent Payment",
    amount: -6500,
    type: "expense",
    category: "Housing",
    date: "2026-01-02",
  },
  {
    id: "3",
    description: "Grocery Shopping",
    amount: -1200,
    type: "expense",
    category: "Food",
    date: "2026-01-05",
  },
  {
    id: "4",
    description: "Electricity Bill",
    amount: -850,
    type: "expense",
    category: "Utilities",
    date: "2026-01-07",
  },
  {
    id: "5",
    description: "Freelance Work",
    amount: 2500,
    type: "income",
    category: "Freelance",
    date: "2026-01-10",
  },
  {
    id: "6",
    description: "Transport",
    amount: -650,
    type: "expense",
    category: "Transport",
    date: "2026-01-12",
  },
];

// Budget entries - source of truth for Budget table
// This is filtered to show Income or Expense views
export const mockBudgetEntries: BudgetEntry[] = [
  // Income entries
  {
    id: '1',
    category: 'Salary',
    description: 'Monthly salary deposit',
    amount: '18500',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'income',
    date: '2026-01-01',
  },
  {
    id: '2',
    category: 'Freelance',
    description: 'Freelance work',
    amount: '2500',
    frequency: 'Once',
    status: 'Spent',
    type: 'income',
    date: '2026-01-10',
  },
  {
    id: '3',
    category: 'Investments',
    description: 'Dividend income',
    amount: '500',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'income',
    date: '2026-01-15',
  },
  // Expense entries
  {
    id: '4',
    category: 'Housing',
    description: 'Rent payment',
    amount: '6500',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'expense',
    date: '2026-01-02',
  },
  {
    id: '5',
    category: 'Food',
    description: 'Grocery shopping',
    amount: '3200',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'expense',
    date: '2026-01-05',
  },
  {
    id: '6',
    category: 'Transport',
    description: 'Fuel & Uber',
    amount: '2500',
    frequency: 'Monthly',
    status: 'Planned',
    type: 'expense',
    date: '2026-01-08',
  },
  {
    id: '7',
    category: 'Utilities',
    description: 'Electricity & water',
    amount: '1500',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'expense',
    date: '2026-01-07',
  },
  {
    id: '8',
    category: 'Other',
    description: 'Miscellaneous expenses',
    amount: '500',
    frequency: 'Monthly',
    status: 'Spent',
    type: 'expense',
    date: '2026-01-12',
  },
];

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Budgeting Basics",
    description: "Learn how to create and stick to a budget that works for you",
    progress: 75,
    lessons: 8,
    completedLessons: 6,
    pointsReward: 100,
    category: "Budgeting",
  },
  {
    id: "2",
    title: "Understanding Debt",
    description: "Smart strategies for managing and reducing debt",
    progress: 40,
    lessons: 10,
    completedLessons: 4,
    pointsReward: 150,
    category: "Debt Management",
  },
  {
    id: "3",
    title: "Saving Strategies",
    description: "Build your emergency fund and save for your goals",
    progress: 100,
    lessons: 6,
    completedLessons: 6,
    pointsReward: 100,
    category: "Saving",
    completedDate: "2026-01-15",
  },
  {
    id: "4",
    title: "Investment Introduction",
    description: "Learn the basics of investing for your future",
    progress: 0,
    lessons: 12,
    completedLessons: 0,
    pointsReward: 200,
    category: "Investing",
  },
];

// Lesson roadmap data for each category
export const budgetingLessons = [
  { id: "1", title: "What is a Budget?", description: "Understanding the basics", status: "completed", points: 10, isSpecial: false },
  { id: "2", title: "Track Your Spending", description: "Where does your money go?", status: "completed", points: 15, isSpecial: true },
  { id: "3", title: "Income vs Expenses", description: "Calculate your cash flow", status: "completed", points: 15, isSpecial: false },
  { id: "4", title: "Setting Budget Goals", description: "Create realistic targets", status: "completed", points: 20, isSpecial: false },
  { id: "5", title: "50/30/20 Rule", description: "Simple budgeting framework", status: "completed", points: 15, isSpecial: true },
  { id: "6", title: "Budget Categories", description: "Organize your spending", status: "in-progress", points: 15, isSpecial: false },
  { id: "7", title: "Adjusting Your Budget", description: "Stay flexible and adapt", status: "locked", points: 20, isSpecial: true },
  { id: "8", title: "Sticking to It", description: "Build lasting habits", status: "locked", points: 25, isSpecial: false },
];

export const savingLessons = [
  { id: "1", title: "Why Save?", description: "The importance of saving", status: "completed", points: 10, isSpecial: false },
  { id: "2", title: "Emergency Fund Basics", description: "Your financial safety net", status: "completed", points: 20, isSpecial: true },
  { id: "3", title: "How Much to Save", description: "Calculate your goal", status: "completed", points: 15, isSpecial: false },
  { id: "4", title: "Pay Yourself First", description: "Automate your savings", status: "in-progress", points: 20, isSpecial: false },
  { id: "5", title: "Savings Accounts", description: "Choose the right account", status: "locked", points: 15, isSpecial: true },
  { id: "6", title: "Reach Your Goals", description: "Stay motivated and focused", status: "locked", points: 20, isSpecial: false },
];

export const debtLessons = [
  { id: "1", title: "Understanding Debt", description: "Good debt vs bad debt", status: "completed", points: 15, isSpecial: false },
  { id: "2", title: "Interest Rates", description: "How debt grows over time", status: "completed", points: 15, isSpecial: false },
  { id: "3", title: "List Your Debts", description: "Know what you owe", status: "completed", points: 10, isSpecial: true },
  { id: "4", title: "Debt Snowball Method", description: "Pay off smallest debts first", status: "completed", points: 20, isSpecial: false },
  { id: "5", title: "Debt Avalanche Method", description: "Target high-interest debt", status: "in-progress", points: 20, isSpecial: true },
  { id: "6", title: "Negotiate Rates", description: "Lower your interest costs", status: "locked", points: 25, isSpecial: false },
  { id: "7", title: "Avoid New Debt", description: "Break the cycle", status: "locked", points: 20, isSpecial: false },
  { id: "8", title: "Credit Score Impact", description: "Protect your credit", status: "locked", points: 15, isSpecial: true },
  { id: "9", title: "Debt Consolidation", description: "Simplify your payments", status: "locked", points: 25, isSpecial: false },
  { id: "10", title: "Stay Debt-Free", description: "Build better habits", status: "locked", points: 25, isSpecial: false },
];

export const investingLessons = [
  { id: "1", title: "Why Invest?", description: "Growing your wealth", status: "locked", points: 15, isSpecial: false },
  { id: "2", title: "Risk and Return", description: "Understanding the basics", status: "locked", points: 20, isSpecial: true },
  { id: "3", title: "Types of Investments", description: "Stocks, bonds, and more", status: "locked", points: 20, isSpecial: false },
  { id: "4", title: "Diversification", description: "Don't put all eggs in one basket", status: "locked", points: 25, isSpecial: false },
  { id: "5", title: "Unit Trusts", description: "Pooled investments explained", status: "locked", points: 20, isSpecial: true },
  { id: "6", title: "ETFs Explained", description: "Low-cost investing", status: "locked", points: 20, isSpecial: false },
  { id: "7", title: "Retirement Savings", description: "Plan for your future", status: "locked", points: 25, isSpecial: true },
  { id: "8", title: "Tax Benefits", description: "Save while you invest", status: "locked", points: 20, isSpecial: false },
  { id: "9", title: "Investment Platforms", description: "Where to start investing", status: "locked", points: 15, isSpecial: false },
  { id: "10", title: "Building a Portfolio", description: "Create your investment plan", status: "locked", points: 25, isSpecial: true },
  { id: "11", title: "Monitor Your Investments", description: "Track your progress", status: "locked", points: 20, isSpecial: false },
  { id: "12", title: "Long-Term Mindset", description: "Patience pays off", status: "locked", points: 30, isSpecial: true },
];

export const bubblesInsights = [
  "Great job! You're R2,500 under budget this month. Keep it up!",
  "I noticed your grocery spending is higher than usual. Want to explore some savings tips?",
  "You're on track to reach your savings goal by March. Well done!",
  "Remember to set aside money for your electricity bill next week.",
];

// Goals data
export interface Goal {
  id: string;
  title: string;
  description?: string;
  goalType: 'Save money' | 'Build emergency fund' | 'Grow wealth' | 'Pay off debt' | 'Reduce spending' | 'Stay within budget' | 'Increase income' | 'Stabilise cash flow' | 'Prepare for an expense' | 'Improve financial habits' | 'Complete financial setup' | 'Custom goal type';
  customGoalType?: string; // For when goalType is "Custom goal type"
  trackingMethod: 'Amount-based' | 'Time-based' | 'Completion-based';
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  deadline: string;
  category: 'Savings' | 'Expenses' | 'Debt' | 'Investment' | 'Education' | 'Healthcare' | 'Travel' | 'Housing' | 'Transportation' | 'Emergency Fund' | 'General';
  status: 'on-track' | 'completed' | 'overdue';
  createdDate: string;
  icon?: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  category: string;
  suggestedByPako: boolean;
  completedAt: string | null;
}

export const goalsData: Goal[] = [
  {
    id: "3",
    title: "New Laptop",
    description: "Save for a new laptop for work",
    goalType: "Save money",
    trackingMethod: "Amount-based",
    targetAmount: 12000,
    currentAmount: 4800,
    startDate: "2026-01-01",
    deadline: "2026-01-28",
    category: "General",
    status: "on-track",
    createdDate: "2026-01-01",
    icon: "Laptop",
  },
  {
    id: "2",
    title: "Holiday to Cape Town",
    description: "Family vacation to Cape Town",
    goalType: "Save money",
    trackingMethod: "Amount-based",
    targetAmount: 15000,
    currentAmount: 8200,
    startDate: "2025-12-01",
    deadline: "2026-06-30",
    category: "Savings",
    status: "on-track",
    createdDate: "2025-12-01",
    icon: "Plane",
  },
  {
    id: "1",
    title: "Emergency Fund",
    description: "Build a 6-month emergency fund",
    goalType: "Build emergency fund",
    trackingMethod: "Amount-based",
    targetAmount: 30000,
    currentAmount: 12500,
    startDate: "2025-10-01",
    deadline: "2026-12-31",
    category: "Savings",
    status: "on-track",
    createdDate: "2025-10-01",
    icon: "Shield",
  },
].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

// To-dos data
export const todosData: Todo[] = [
  {
    id: "1",
    title: "Review monthly budget",
    completed: false,
    dueDate: "2026-01-25",
    category: "Finance",
    suggestedByPako: false,
    completedAt: null,
  },
  {
    id: "2",
    title: "Complete emergency fund lesson",
    completed: false,
    dueDate: "2026-01-22",
    category: "Learning",
    suggestedByPako: true,
    completedAt: null,
  },
  {
    id: "3",
    title: "Update insurance beneficiaries",
    completed: true,
    dueDate: "2026-01-15",
    category: "Settings",
    suggestedByPako: false,
    completedAt: "2026-01-16T10:30:00Z",
  },
  {
    id: "4",
    title: "Check credit report",
    completed: false,
    dueDate: "2026-01-30",
    category: "Finance",
    suggestedByPako: false,
    completedAt: null,
  },
  {
    id: "5",
    title: "Explore rewards catalog",
    completed: true,
    dueDate: "2026-01-10",
    category: "Rewards",
    suggestedByPako: true,
    completedAt: "2026-01-14T15:45:00Z",
  },
];

// Bubbles suggestions for optional features
export const bubblesSuggestions = [
  {
    id: "1",
    title: "Set up a Savings Goal",
    description: "Create your first savings goal and track your progress",
    icon: "Target",
    actionText: "Create Goal",
    actionRoute: "/goals",
    completed: false,
  },
  {
    id: "2",
    title: "Enable Budget Alerts",
    description: "Get notified when you're close to your spending limits",
    icon: "Bell",
    actionText: "Enable Alerts",
    actionRoute: "/settings",
    completed: false,
  },
  {
    id: "3",
    title: "Complete Your Profile",
    description: "Add your financial preferences for better insights",
    icon: "User",
    actionText: "Complete Profile",
    actionRoute: "/profile",
    completed: false,
  },
];

export const rewardsData = [
  {
    id: "1",
    name: "R50 Shoprite Voucher",
    points: 500,
    available: true,
    expiryDate: "2026-02-15",
  },
  {
    id: "2",
    name: "R100 Takealot Voucher",
    points: 1000,
    available: true,
    expiryDate: "2026-02-28",
  },
  {
    id: "3",
    name: "R200 Woolworths Voucher",
    points: 2000,
    available: false,
    expiryDate: "2026-03-31",
  },
  {
    id: "4",
    name: "R50 Data Bundle",
    points: 500,
    available: true,
    expiryDate: "2026-01-31",
  },
];