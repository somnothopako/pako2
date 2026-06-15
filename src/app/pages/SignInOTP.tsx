import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';
import { useAuthTimeout } from '@/app/hooks/useAuthTimeout';
import { useUser } from '@/app/contexts/UserContext';

export function SignInOTP() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  
  // Initialize auth timeout (5-minute rule)
  useAuthTimeout();
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  // Auto-focus first input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      const firstInput = document.getElementById('otp-0');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [step]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sending OTP - in production, this would call your backend
    setStep('otp');
    setTimeLeft(60);
    setCanResend(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp.slice(0, 6));
      // Focus last filled input
      const lastIndex = Math.min(pastedData.length, 5);
      const lastInput = document.getElementById(`otp-${lastIndex}`);
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    
    // Mock resend logic - in production, this would call your backend
    setTimeLeft(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    // Focus first input
    const firstInput = document.getElementById('otp-0');
    if (firstInput) {
      firstInput.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Mock verification logic - in production, this would call your backend
    // Simulating API call
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      // In production, verify against backend
      if (otpCode.length === 6) {
        setSuccess(true);
        
        // Mock signin - in real app would authenticate and fetch user data
        // For demo: Simulate a returning user with no bank account connected
        const mockReturningUser = {
          firstName: 'Sarah',
          surname: 'Ndlovu',
          email: email,
          phoneNumber: '+27987654321',
          dateOfBirth: new Date('1992-08-22'),
          isNewUser: true, // Set to true to trigger bank connection dialog
          connectedAccountsCount: 0, // No bank accounts connected
          uploadedStatementsCount: 0
        };
        
        // Set the user in context
        setUser(mockReturningUser);
        
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
        setIsVerifying(false);
      }
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="px-4 py-4">
        <button 
          onClick={() => step === 'email' ? navigate('/signin') : setStep('email')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </header>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-4">
            <Logo size="xl" className="mx-auto" />
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">
                {step === 'email' ? 'Sign In with OTP' : 'Enter Verification Code'}
              </h1>
              <p className="text-muted-foreground">
                {step === 'email' 
                  ? 'Enter your email to receive a one-time password'
                  : `We've sent a 6-digit code to ${email}`
                }
              </p>
            </div>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-lg font-semibold bg-input-background"
                      disabled={isVerifying || success}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Verified! Signing you in...
                    </p>
                  </div>
                )}
              </div>

              {/* Resend Timer */}
              <div className="text-center space-y-3">
                {!canResend ? (
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <span className="font-medium text-foreground">
                      Resend in {formatTime(timeLeft)}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={otp.join('').length !== 6 || isVerifying || success}
              >
                {isVerifying ? 'Verifying...' : success ? 'Verified!' : 'Sign In'}
              </Button>
            </form>
          )}

          {/* Footer */}
          {step === 'email' && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                We'll send a 6-digit code to your email address.
                <br />
                The code expires in 10 minutes.
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Check your spam folder if you don't see the email.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}