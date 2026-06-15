import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { ArrowLeft, Send, CheckCircle2, Mail, MessageSquare } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import pakoLogoWatermark from 'figma:asset/801b48dfe9d59c06d3fbcf335528d783ab88ec14.png';

export function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    reason: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Context-aware back navigation - check if from signup flow
  const handleBackClick = () => {
    // Check if user came from signup flow
    if (location.state?.from === 'signup') {
      navigate('/signup', { state: { returnToStep: 4 } });
    } else if (location.state?.from) {
      // Check if there's a referrer in the state
      navigate(location.state.from, { state: location.state.returnState });
    } else if (window.history.length > 1) {
      // Use browser's back if there's history
      navigate(-1);
    } else {
      // Default fallback to home
      navigate('/');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.reason) {
      newErrors.reason = 'Please select a reason for contacting';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        firstName: '',
        surname: '',
        email: '',
        reason: '',
        message: '',
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Watermark Logo - Repeating Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${pakoLogoWatermark})`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
        }}
      />

      {/* Soft gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Logo size="lg" />
          <Button 
            variant="ghost" 
            className="rounded-full hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100 gap-2 transition-colors duration-[50ms]"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50 dark:border-slate-800/50">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              Contact Support
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              We're here to help! Send us a message and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-900 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100 text-lg mb-1">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thank you for contacting us. We'll respond to your inquiry within 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-900 dark:text-white">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`${errors.firstName ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  aria-invalid={!!errors.firstName}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                )}
              </div>

              {/* Surname */}
              <div className="space-y-2">
                <Label htmlFor="surname" className="text-slate-900 dark:text-white">
                  Surname <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Doe"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className={`${errors.surname ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  aria-invalid={!!errors.surname}
                  disabled={isSubmitting}
                />
                {errors.surname && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.surname}</p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-900 dark:text-white">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Reason for Contacting */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-slate-900 dark:text-white">
                Reason for Contacting <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.reason}
                onValueChange={(value) => handleInputChange('reason', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="reason"
                  className={`${errors.reason ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                  aria-invalid={!!errors.reason}
                >
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="rewards">Rewards Program</SelectItem>
                  <SelectItem value="data">Data & Privacy</SelectItem>
                  <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                  <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.reason && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.reason}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-900 dark:text-white">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Please describe your inquiry or issue in detail..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={6}
                className={`resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500/20' : ''}`}
                aria-invalid={!!errors.message}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Minimum 10 characters
                  </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formData.message.length} characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full gap-2 h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
              Other Ways to Reach Us
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Email Support</p>
                <a href="mailto:hello@pako.co.za" className="text-sm text-primary dark:text-[rgb(200,205,210)] hover:underline">
                  hello@pako.co.za
                </a>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Response Time</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Within 24-48 hours
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Back Button */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button 
              variant="outline" 
              className="w-full md:w-auto rounded-full hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100 gap-2 transition-colors duration-[50ms]"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}