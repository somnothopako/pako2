import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import { useEffect } from 'react';
import { useAuthTimeout } from '@/app/hooks/useAuthTimeout';
import { useUser } from '@/app/contexts/UserContext';

// Storage keys for clearing sign-up state
const SIGNUP_STORAGE_KEY = 'pako_signup_state';

export function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  // Initialize auth timeout (5-minute rule)
  useAuthTimeout();

  // Clear any saved sign-up state when user navigates to sign-in
  useEffect(() => {
    sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock signin - in real app would authenticate and fetch user data
    // For demo: Simulate a returning user with no bank account connected
    const mockReturningUser = {
      firstName: 'Thabo',
      surname: 'Sithole',
      email: 'thabo@example.com',
      phoneNumber: '+27123456789',
      dateOfBirth: new Date('1990-05-15'),
      isNewUser: true, // Set to true to trigger bank connection dialog
      connectedAccountsCount: 0, // No bank accounts connected
      uploadedStatementsCount: 0
    };
    
    // Set the user in context
    setUser(mockReturningUser);
    
    // Navigate to home (where the bank connection dialog will show)
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <Logo size="xl" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue your financial journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-input-background"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* OTP Sign In Option */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => navigate('/signin-otp')}
          >
            <Mail className="mr-2 h-4 w-4" />
            Sign In with OTP
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}