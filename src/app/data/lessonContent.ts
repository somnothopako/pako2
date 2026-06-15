// Detailed lesson content with videos, practice, and quizzes

export interface LessonContent {
  id: string;
  categoryId: string;
  lessonId: string;
  title: string;
  steps: LessonStep[];
  practice: PracticeExercise;
  quiz: QuizQuestion[];
}

export interface LessonStep {
  type: 'video' | 'text';
  title: string;
  content?: string; // For text-based content
  videoUrl?: string; // For video content (we'll use placeholder)
  videoDuration?: string; // e.g., "3:45"
}

export interface PracticeExercise {
  instruction: string;
  sentence: string; // Sentence with {blank} placeholders
  blanks: string[]; // Correct answers in order
  wordBank: string[]; // All words including correct answers and distractors
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | boolean;
  explanation: string;
}

// Budgeting Lesson: "Budget Categories"
export const budgetCategoriesLesson: LessonContent = {
  id: 'lesson-budgeting-6',
  categoryId: 'budgeting',
  lessonId: '6',
  title: 'Budget Categories',
  steps: [
    {
      type: 'text',
      title: 'Understanding Budget Categories',
      content: `Organizing your spending into categories helps you see exactly where your money goes each month. This clarity is the foundation of good budgeting.

**Common Budget Categories:**
• **Fixed Expenses:** Rent, insurance, loan payments
• **Variable Expenses:** Groceries, utilities, transport
• **Discretionary Spending:** Entertainment, eating out, hobbies
• **Savings & Investments:** Emergency fund, retirement, goals

By tracking expenses in clear categories, you can identify areas to adjust and make smarter financial decisions.`,
    },
    {
      type: 'text',
      title: 'How to Choose Your Categories',
      content: `Start with broad categories and get more specific as needed. The goal is to make tracking easy, not overwhelming.

**Tips for Creating Categories:**
1. **Start simple** - Use 5-10 main categories at first
2. **Match your lifestyle** - Include categories that reflect how you actually spend
3. **Be consistent** - Use the same categories each month for comparison
4. **Review regularly** - Adjust categories if they're not working

Remember: Your budget should serve you, not stress you out. Keep it practical!`,
    },
    {
      type: 'video',
      title: 'Watch: Setting Up Your Categories',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
      videoDuration: '4:32',
    },
  ],
  practice: {
    instruction: 'Complete the sentence by dragging the correct words into the blanks:',
    sentence: 'Organizing expenses into {blank} helps you track where your {blank} goes and make better {blank} decisions.',
    blanks: ['categories', 'money', 'financial'],
    wordBank: ['categories', 'money', 'financial', 'savings', 'income', 'budget', 'spending', 'choices'],
    hint: 'Think about the key concepts we just learned about organizing your budget.',
  },
  quiz: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'Which of the following is considered a fixed expense?',
      options: ['Groceries', 'Rent payment', 'Entertainment', 'Eating out'],
      correctAnswer: 'Rent payment',
      explanation: 'Rent is a fixed expense because it stays the same amount each month and is a recurring, non-negotiable payment.',
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'You should use the same budget categories every month for consistent tracking.',
      correctAnswer: true,
      explanation: 'Using consistent categories each month allows you to compare spending patterns over time and identify trends.',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'What is the main benefit of organizing expenses into categories?',
      options: [
        'It makes you spend less money',
        'It helps you see where your money goes',
        'It automatically saves money for you',
        'It increases your income',
      ],
      correctAnswer: 'It helps you see where your money goes',
      explanation: 'Categories provide clarity on your spending patterns, which is the first step to making informed financial decisions.',
    },
    {
      id: 'q4',
      type: 'multiple-choice',
      question: 'Which category would "going to the movies" fall under?',
      options: ['Fixed Expenses', 'Variable Expenses', 'Discretionary Spending', 'Savings'],
      correctAnswer: 'Discretionary Spending',
      explanation: 'Entertainment like movies is discretionary spending - it\'s optional and you have control over how much you spend.',
    },
    {
      id: 'q5',
      type: 'true-false',
      question: 'It\'s best to start with 20-30 detailed categories when first creating a budget.',
      correctAnswer: false,
      explanation: 'It\'s better to start with 5-10 broad categories to keep tracking simple. You can add more detail later if needed.',
    },
  ],
};

// Saving Lesson: "Pay Yourself First"
export const payYourselfFirstLesson: LessonContent = {
  id: 'lesson-saving-4',
  categoryId: 'saving',
  lessonId: '4',
  title: 'Pay Yourself First',
  steps: [
    {
      type: 'text',
      title: 'The Pay Yourself First Principle',
      content: `"Pay yourself first" means treating your savings like a bill that must be paid every month - before spending on anything else.

**Why It Works:**
• **Priority:** Your savings become automatic, not an afterthought
• **Consistency:** You save regularly without having to think about it
• **Growth:** Even small amounts add up significantly over time

Instead of saving what's left over (which is often nothing!), you set aside savings first and then budget the rest.`,
    },
    {
      type: 'text',
      title: 'How to Automate Your Savings',
      content: `The easiest way to pay yourself first is to automate the process completely.

**Steps to Automate:**
1. **Set up a separate savings account** - Keep it away from daily spending
2. **Schedule automatic transfers** - Right after payday
3. **Start with any amount** - Even R100/month makes a difference
4. **Increase gradually** - Add more as your income grows

Many employers can split your paycheck between accounts, or you can use your banking app to set up recurring transfers.

**Pro tip:** Treat your automated savings like a non-negotiable bill. Don't cancel it unless there's a real emergency!`,
    },
  ],
  practice: {
    instruction: 'Complete the sentence with the correct words:',
    sentence: 'Pay yourself first means treating {blank} like a monthly {blank} and transferring money to savings {blank} spending on other things.',
    blanks: ['savings', 'bill', 'before'],
    wordBank: ['savings', 'bill', 'before', 'after', 'income', 'account', 'expenses', 'budget'],
    hint: 'Remember: savings should be a priority, not an afterthought.',
  },
  quiz: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What does "pay yourself first" mean?',
      options: [
        'Buy yourself treats before paying bills',
        'Save money before spending on other expenses',
        'Pay off all your debts first',
        'Earn extra income from a side job',
      ],
      correctAnswer: 'Save money before spending on other expenses',
      explanation: '"Pay yourself first" means prioritizing savings by setting aside money for your future before spending on anything else.',
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'Automating your savings makes it easier to save consistently.',
      correctAnswer: true,
      explanation: 'Automation removes the need for willpower and ensures you save regularly without having to remember or make the decision each time.',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'When is the best time to transfer money to your savings account?',
      options: ['At the end of the month', 'Whenever you remember', 'Right after payday', 'Only when you have extra money'],
      correctAnswer: 'Right after payday',
      explanation: 'Transferring right after payday ensures the money goes to savings before you have a chance to spend it on other things.',
    },
    {
      id: 'q4',
      type: 'true-false',
      question: 'You should only start saving once you can afford to save at least R1000 per month.',
      correctAnswer: false,
      explanation: 'Starting small is perfectly fine! Even R50 or R100 per month builds the savings habit and adds up over time.',
    },
    {
      id: 'q5',
      type: 'multiple-choice',
      question: 'Why should savings be kept in a separate account?',
      options: [
        'Banks require it by law',
        'It earns higher interest',
        'It keeps savings separate from daily spending money',
        'It automatically increases your savings',
      ],
      correctAnswer: 'It keeps savings separate from daily spending money',
      explanation: 'A separate account creates a mental and physical barrier that makes it less tempting to dip into your savings for everyday purchases.',
    },
  ],
};

// Debt Lesson: "Debt Avalanche Method"
export const debtAvalancheLesson: LessonContent = {
  id: 'lesson-debt-5',
  categoryId: 'debt',
  lessonId: '5',
  title: 'Debt Avalanche Method',
  steps: [
    {
      type: 'text',
      title: 'Understanding the Debt Avalanche',
      content: `The debt avalanche method focuses on paying off debts with the highest interest rates first, saving you the most money over time.

**How It Works:**
1. **List all debts** by interest rate (highest to lowest)
2. **Make minimum payments** on all debts
3. **Put extra money** toward the highest-rate debt
4. **Once paid off**, move to the next highest rate
5. **Repeat** until all debts are cleared

**Example:**
• Credit card at 24% interest: R5,000
• Personal loan at 18% interest: R15,000  
• Student loan at 8% interest: R25,000

You'd focus extra payments on the credit card first, even though it's the smallest balance.`,
    },
    {
      type: 'text',
      title: 'Avalanche vs Snowball: Which is Better?',
      content: `**Debt Avalanche Benefits:**
• Saves the most money on interest
• Mathematically the fastest payoff method
• Best for disciplined savers

**Debt Snowball Benefits:**
• Quick wins boost motivation
• Simpler to understand
• Better for those who need encouragement

**Which should you choose?**
If saving money matters most and you can stay motivated by the numbers, choose avalanche. If you need psychological wins to stay on track, snowball might work better.

The best method is the one you'll actually stick with!`,
    },
  ],
  practice: {
    instruction: 'Fill in the blanks to describe the debt avalanche method:',
    sentence: 'The debt avalanche method prioritizes paying off debts with the highest {blank} first to save the most {blank} over time.',
    blanks: ['interest', 'money'],
    wordBank: ['interest', 'money', 'balance', 'payments', 'minimum', 'rate', 'principal', 'savings'],
    hint: 'Think about what makes debt expensive and what you want to minimize.',
  },
  quiz: [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'In the debt avalanche method, which debt do you focus on first?',
      options: [
        'The debt with the smallest balance',
        'The debt with the highest interest rate',
        'The debt with the lowest payment',
        'The newest debt',
      ],
      correctAnswer: 'The debt with the highest interest rate',
      explanation: 'The avalanche method targets high-interest debts first because they cost you the most money over time.',
    },
    {
      id: 'q2',
      type: 'true-false',
      question: 'You should stop making minimum payments on other debts while focusing on your highest-rate debt.',
      correctAnswer: false,
      explanation: 'You must continue making minimum payments on all debts to avoid late fees and credit damage. Extra money goes to the highest-rate debt.',
    },
    {
      id: 'q3',
      type: 'multiple-choice',
      question: 'What is the main advantage of the debt avalanche method?',
      options: [
        'It provides quick psychological wins',
        'It saves the most money on interest',
        'It requires no planning',
        'It eliminates debts fastest regardless of interest',
      ],
      correctAnswer: 'It saves the most money on interest',
      explanation: 'By targeting high-interest debt first, you minimize the total amount of interest paid over the life of your debts.',
    },
    {
      id: 'q4',
      type: 'true-false',
      question: 'The debt avalanche method is always better than the debt snowball method.',
      correctAnswer: false,
      explanation: 'While avalanche saves more money, snowball can be better for those who need motivational wins. The best method is the one you\'ll stick with.',
    },
    {
      id: 'q5',
      type: 'multiple-choice',
      question: 'After paying off your highest-interest debt, what should you do next?',
      options: [
        'Celebrate and take a break from debt payments',
        'Split the extra money among all remaining debts',
        'Apply the extra payment to the next highest-rate debt',
        'Put the money into savings instead',
      ],
      correctAnswer: 'Apply the extra payment to the next highest-rate debt',
      explanation: 'Continue the avalanche by redirecting the full payment amount to the next highest-interest debt, maintaining momentum.',
    },
  ],
};

// Map lesson IDs to content
export const lessonContentMap: Record<string, LessonContent> = {
  'budgeting-6': budgetCategoriesLesson,
  'saving-4': payYourselfFirstLesson,
  'debt-5': debtAvalancheLesson,
};

// Helper function to get lesson content
export function getLessonContent(categoryId: string, lessonId: string): LessonContent | undefined {
  const key = `${categoryId}-${lessonId}`;
  return lessonContentMap[key];
}
