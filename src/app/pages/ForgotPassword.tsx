import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/app/components/Logo';
import { useAuthTimeout } from '@/app/hooks/useAuthTimeout';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize auth timeout (5-minute rule)
  useAuthTimeout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock sending reset link - in production, this would call your backend
    // Simulating API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setIsLoading(true);
    // Mock resending reset link
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <Link 
          to="/signin" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </header>

      {/* Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          {!isSubmitted ? (
            <>
              <div className="space-y-4">
                <Logo size="xl" className="mx-auto" />
                
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Forgot Password?</h1>
                  <p className="text-muted-foreground">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-input-background"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">
                  The reset link will be valid for 1 hour.
                  <br />
                  Check your spam folder if you don't see the email.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Check Your Email</h1>
                    <p className="text-muted-foreground">
                      We've sent a password reset link to
                    </p>
                    <p className="font-medium text-foreground">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">What's next?</strong>
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Check your email inbox</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/signin')} 
                    className="w-full" 
                    size="lg"
                  >
                    Back to Sign In
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Didn't receive the email?
                    </p>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="text-sm text-primary dark:text-[rgb(200,205,210)] hover:underline font-medium disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Resend reset link'}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    The link expires in 1 hour. Make sure to check your spam folder.
                  </p>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}