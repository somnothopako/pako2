import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { BubblesProvider } from '@/app/contexts/BubblesContext';
import { UserProvider } from '@/app/contexts/UserContext';
import { Landing } from '@/app/pages/Landing';
import { SignIn } from '@/app/pages/SignIn';
import { SignInOTP } from '@/app/pages/SignInOTP';
import { ForgotPassword } from '@/app/pages/ForgotPassword';
import { SignUp } from '@/app/pages/SignUp';
import { VerifyEmail } from '@/app/pages/VerifyEmail';
import { Home } from '@/app/pages/Home';
import { Learning } from '@/app/pages/Learning';
import { CategoryLearning } from '@/app/pages/CategoryLearning';
import { Finances } from '@/app/pages/Finances';
import { Investments } from '@/app/pages/Investments';
import { Rewards } from '@/app/pages/Rewards';
import { Settings } from '@/app/pages/Settings';
import Profile from '@/app/pages/Profile';
import { Bubbles } from '@/app/pages/Bubbles';
import { BubblesChat } from '@/app/pages/BubblesChat';
import { IncomeDetails } from '@/app/pages/IncomeDetails';
import { ExpenseDetails } from '@/app/pages/ExpenseDetails';
import { MonthlyBudget } from '@/app/pages/MonthlyBudget';
import { GoalsAndTodos } from '@/app/pages/GoalsAndTodos';
import { PrivacyPolicy } from '@/app/pages/PrivacyPolicy';
import { TermsOfService } from '@/app/pages/TermsOfService';
import { Contact } from '@/app/pages/Contact';
import { HelpCenter } from '@/app/pages/HelpCenter';
import { LessonContent } from '@/app/pages/LessonContent';
import { LessonPractice } from '@/app/pages/LessonPractice';
import { LessonQuiz } from '@/app/pages/LessonQuiz';
import { LessonResults } from '@/app/pages/LessonResults';
import { UnitTrusts } from '@/app/pages/UnitTrusts';
import { TFSA } from '@/app/pages/TFSA';
import { InsurancePolicyCheck } from '@/app/pages/InsurancePolicyCheck';
import { AppLayout } from '@/app/components/AppLayout';

// PAKO Financial Wellness App
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <UserProvider>
        <BubblesProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signin-otp" element={<SignInOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help-center" element={<HelpCenter />} />
              
              {/* Authenticated Routes with Layout */}
              <Route element={<AppLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/learning/:category" element={<CategoryLearning />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/goals-and-todos" element={<GoalsAndTodos />} />
                <Route path="/investments" element={<Investments />} />
                <Route path="/bubbles" element={<Bubbles />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Detail Pages (with layout) */}
              <Route element={<AppLayout />}>
                <Route path="/income-details" element={<IncomeDetails />} />
                <Route path="/expense-details" element={<ExpenseDetails />} />
                <Route path="/monthly-budget" element={<MonthlyBudget />} />
                <Route path="/goals-and-todos" element={<GoalsAndTodos />} />
              </Route>

              {/* Lesson Flow Pages (full screen, no layout) */}
              <Route path="/learning/:categoryId/:lessonId/content" element={<LessonContent />} />
              <Route path="/learning/:categoryId/:lessonId/practice" element={<LessonPractice />} />
              <Route path="/learning/:categoryId/:lessonId/quiz" element={<LessonQuiz />} />
              <Route path="/learning/:categoryId/:lessonId/results" element={<LessonResults />} />

              {/* Clinic Coming Soon Pages (full screen, no layout) */}
              <Route path="/clinic/unit-trusts" element={<UnitTrusts />} />
              <Route path="/clinic/tfsa" element={<TFSA />} />
              <Route path="/clinic/insurance-policy-check" element={<InsurancePolicyCheck />} />

              {/* Bubbles Chat (full screen, no layout) - Keep for backward compatibility */}
              <Route path="/bubbles-chat" element={<BubblesChat />} />
              
              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BubblesProvider>
      </UserProvider>
    </ThemeProvider>
  );
}