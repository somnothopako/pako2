import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { Checkbox } from '@/app/components/ui/checkbox';
import { DatePicker } from '@/app/components/ui/date-picker';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';
import { useUser } from '@/app/contexts/UserContext';
import { useAuthTimeout } from '@/app/hooks/useAuthTimeout';

// Storage keys for preserving sign-up state
const SIGNUP_STORAGE_KEY = 'pako_signup_state';

export function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();
  
  // Initialize auth timeout (5-minute rule)
  useAuthTimeout();
  
  // Load saved state from sessionStorage if it exists
  const loadSavedState = () => {
    try {
      const saved = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load saved sign-up state:', error);
    }
    return null;
  };

  const savedState = loadSavedState();
  
  // Initialize with saved state or defaults
  const initialStep = location.state?.returnToStep || savedState?.step || 1;
  const [step, setStep] = useState(initialStep);
  const [agreedToTerms, setAgreedToTerms] = useState(savedState?.agreedToTerms || false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordChecking, setPasswordChecking] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpSent, setOtpSent] = useState(savedState?.otpSent || false);
  const [otpVerified, setOtpVerified] = useState(savedState?.otpVerified || false);
  const [otpChecking, setOtpChecking] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const totalSteps = 4;

  // Password strength requirements
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Form data state - persists across step navigation and legal page visits
  const [formData, setFormData] = useState({
    firstName: savedState?.formData?.firstName || '',
    surname: savedState?.formData?.surname || '',
    countryCode: savedState?.formData?.countryCode || '+27',
    phoneNumber: savedState?.formData?.phoneNumber || '',
    email: savedState?.formData?.email || '',
    otp: savedState?.formData?.otp || '',
    dateOfBirth: savedState?.formData?.dateOfBirth ? new Date(savedState.formData.dateOfBirth) : undefined,
    password: savedState?.formData?.password || '',
    confirmPassword: savedState?.formData?.confirmPassword || ''
  });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      step,
      agreedToTerms,
      otpSent,
      otpVerified,
      formData
    };
    sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [step, agreedToTerms, otpSent, otpVerified, formData]);

  // Update form field handler
  const updateFormField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear password error when user types
    if (field === 'password' || field === 'confirmPassword') {
      setPasswordError('');
    }
    // Check password requirements in real-time
    if (field === 'password') {
      checkPasswordRequirements(value);
    }
    // Clear phone error when user types
    if (field === 'phoneNumber') {
      setPhoneError('');
    }
  };

  // Check password requirements in real-time
  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    });
  };

  // Clear the navigation state after using it
  useEffect(() => {
    if (location.state?.returnToStep) {
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle back button - clear storage when truly exiting
  const handleBackToLanding = () => {
    // User is exiting sign-up flow - clear saved state
    sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
    navigate('/');
  };

  // Validate passwords match
  const validatePasswords = () => {
    // Check all password requirements
    if (!passwordRequirements.minLength) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!passwordRequirements.hasUppercase) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!passwordRequirements.hasLowercase) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!passwordRequirements.hasNumber) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!passwordRequirements.hasSpecial) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Validate phone number
  const validatePhoneNumber = () => {
    if (formData.phoneNumber.length !== 9) {
      setPhoneError('Phone number must be exactly 9 digits');
      return false;
    }
    return true;
  };

  // Verify OTP code
  const verifyOtp = async (otpCode: string) => {
    setOtpChecking(true);
    setOtpError('');
    
    // Simulate API call with 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock OTP verification - in real implementation this would call an API
    // For demo purposes, accept "123456" as the correct code
    if (otpCode === '123456') {
      setOtpVerified(true);
      setOtpChecking(false);
      return true;
    } else {
      setOtpError('Invalid verification code. Please try again.');
      setOtpChecking(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords on step 3
    if (step === 3) {
      setPasswordChecking(true);
      
      // Simulate validation with a short delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!validatePasswords()) {
        setPasswordChecking(false);
        return;
      }
      
      setPasswordChecking(false);
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Save user data to context
      setUser({
        firstName: formData.firstName,
        surname: formData.surname,
        email: formData.email,
        phoneNumber: `${formData.countryCode}${formData.phoneNumber}`,
        dateOfBirth: formData.dateOfBirth,
        isNewUser: true // Mark as new user to show bank connection prompt
      });
      
      // Complete signup - clear saved state and navigate to home
      sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
      setCreatingAccount(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/home');
    }
  };

  // Handle OTP send
  const handleSendOtp = async () => {
    // Validate phone number first
    if (!validatePhoneNumber()) {
      return;
    }
    
    // Show sending animation
    setSendingCode(true);
    
    // Simulate sending OTP with 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock sending OTP - in real implementation this would call an API
    setSendingCode(false);
    setOtpSent(true);
    // Here you would normally call an API to send the OTP
    console.log('OTP sent to', formData.phoneNumber, 'and', formData.email);
    setResendTimer(120); // Set resend timer to 120 seconds (2 minutes)
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    handleSendOtp();
  };

  // Update resend timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}min ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Loading Overlay */}
      {creatingAccount && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 space-y-4 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Creating Your Account</h2>
                <p className="text-sm text-muted-foreground">
                  Setting up your financial wellness journey...
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="px-4 py-4">
        <button 
          onClick={handleBackToLanding}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </header>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-4">
            <Logo size="xl" className="mx-auto" />
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Create Your Account</h1>
              <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      required
                      className="bg-input-background"
                      value={formData.firstName}
                      onChange={(e) => updateFormField('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      type="text"
                      placeholder="Surname"
                      required
                      className="bg-input-background"
                      value={formData.surname}
                      onChange={(e) => updateFormField('surname', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                    placeholder="Select your date of birth"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex gap-2">
                    <select
                      id="countryCode"
                      className="bg-input-background border border-input rounded-md px-3 py-2 text-sm w-24"
                      value={formData.countryCode}
                      onChange={(e) => updateFormField('countryCode', e.target.value)}
                      required
                    >
                      <option value="+27">+27</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                      <option value="+61">+61</option>
                    </select>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="812345678"
                      required
                      maxLength={9}
                      pattern="\d{9}"
                      className={`bg-input-background flex-1 ${phoneError ? 'border-red-500 dark:border-red-500' : ''}`}
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 9) {
                          updateFormField('phoneNumber', value);
                        }
                      }}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {phoneError}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Must be exactly 9 digits
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="bg-input-background"
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                  />
                </div>

                {!otpSent && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      className="text-primary hover:underline text-sm font-medium"
                      onClick={handleSendOtp}
                    >
                      Send confirmation code
                    </button>
                  </div>
                )}

                {(sendingCode || otpSent) && (
                  <div className="space-y-3 pt-2">
                    <div className={`flex items-center gap-2 p-3 border rounded-lg ${
                      sendingCode 
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900' 
                        : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                    }`}>
                      {sendingCode ? (
                        <>
                          <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" />
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Sending code...
                          </p>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {otpVerified ? 'Code verified successfully!' : 'Confirmation code sent!'}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="otp-1">Enter 6-digit code</Label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                          <Input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            className="bg-input-background w-12 h-12 text-center text-lg font-semibold"
                            value={formData.otp[index - 1] || ''}
                            disabled={otpVerified}
                            onChange={(e) => {
                              if (otpVerified) return; // Prevent changes if already verified
                              
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                const newOtp = formData.otp.split('');
                                newOtp[index - 1] = value;
                                const completeOtp = newOtp.join('');
                                updateFormField('otp', completeOtp);
                                
                                // Check if we have 6 digits now
                                if (completeOtp.length === 6) {
                                  verifyOtp(completeOtp);
                                }
                                
                                // Auto-focus next input
                                if (value && index < 6) {
                                  const nextInput = document.getElementById(`otp-${index + 1}`);
                                  nextInput?.focus();
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace to go to previous input
                              if (e.key === 'Backspace' && !formData.otp[index - 1] && index > 1) {
                                const prevInput = document.getElementById(`otp-${index - 1}`);
                                prevInput?.focus();
                              }
                            }}
                            required
                          />
                        ))}
                      </div>
                      
                      {/* Verification Status */}
                      {otpChecking && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Verifying code...</span>
                        </div>
                      )}
                      
                      {!otpChecking && otpVerified && (
                        <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 pt-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Code verified successfully</span>
                        </div>
                      )}
                      
                      {!otpChecking && otpError && !otpVerified && (
                        <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 pt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{otpError}</span>
                        </div>
                      )}
                    </div>

                    {!otpVerified && (
                      <div className="text-center">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground text-sm"
                          onClick={handleResendOtp}
                        >
                          {resendTimer > 0 ? `Resend in ${formatTimer(resendTimer)}` : 'Resend code'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="bg-input-background"
                    value={formData.password}
                    onChange={(e) => updateFormField('password', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-input-background"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormField('confirmPassword', e.target.value)}
                  />
                </div>

                {/* Password Requirements Checklist */}
                {formData.password && (
                  <div className="p-3 bg-muted/50 dark:bg-muted/20 border border-border rounded-lg space-y-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {passwordRequirements.minLength ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordRequirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasUppercase ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordRequirements.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          One uppercase letter (A-Z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasLowercase ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordRequirements.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          One lowercase letter (a-z)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasNumber ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          One number (0-9)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordRequirements.hasSpecial ? (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${passwordRequirements.hasSpecial ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          One special character (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Password Error Message */}
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordError}
                    </p>
                  </div>
                )}
                
                {/* Password Checking State */}
                {passwordChecking && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Checking passwords...
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Your Data is Safe</h3>
                    <p className="text-sm text-muted-foreground">
                      Bank-level encryption protects your information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">You're in Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose what to share and when
                    </p>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <label 
                      htmlFor="terms" 
                      className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                    >
                      I agree to PAKO's{' '}
                      <Link 
                        to="/terms-of-service" 
                        state={{ from: 'signup' }}
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        to="/privacy-policy" 
                        state={{ from: 'signup' }}
                        className="text-primary hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={
                  (step === totalSteps && !agreedToTerms) || 
                  passwordChecking ||
                  (step === 1 && (!formData.firstName || !formData.surname || !formData.dateOfBirth)) ||
                  (step === 2 && (!formData.phoneNumber || !formData.email || !otpVerified)) ||
                  (step === 3 && (!formData.password || !formData.confirmPassword))
                }
              >
                {passwordChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  step === totalSteps ? 'Create Account' : 'Continue'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}