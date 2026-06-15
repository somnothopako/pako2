import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  User, 
  CreditCard, 
  Shield, 
  Gift, 
  Settings,
  FileText,
  ChevronRight,
  MessageCircle,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Smartphone
} from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import pakoLogoWatermark from 'figma:asset/801b48dfe9d59c06d3fbcf335528d783ab88ec14.png';

export function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Sparkles,
      title: 'Getting Started',
      description: 'Learn the basics of using PAKO',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: User,
      title: 'Account Management',
      description: 'Manage your profile and settings',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'Questions about transactions',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data and account safety',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Gift,
      title: 'Rewards Program',
      description: 'Earn and redeem your points',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Budget & Finances',
      description: 'Track and manage your money',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  const popularArticles = [
    {
      title: 'How do I create my first budget?',
      category: 'Getting Started',
    },
    {
      title: 'What is Bubbles and how can it help me?',
      category: 'Getting Started',
    },
    {
      title: 'How do I earn and redeem points?',
      category: 'Rewards Program',
    },
    {
      title: 'Is my financial data secure?',
      category: 'Privacy & Security',
    },
    {
      title: 'How do I connect my bank account?',
      category: 'Account Management',
    },
    {
      title: 'Can I use PAKO on multiple devices?',
      category: 'Account Management',
    },
    {
      title: 'How do I reset my password?',
      category: 'Account Management',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log('Searching for:', searchQuery);
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Logo size="lg" />
          <Link to="/home">
            <Button variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section with Search */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            How can we help?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers to your questions
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for articles, topics, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-base rounded-2xl shadow-lg border-2 focus-visible:ring-4"
              />
              {searchQuery && (
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                >
                  Search
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Browse by Category */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={index}
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50"
                  onClick={() => {
                    // In a real app, this would navigate to category page
                    console.log('Clicked category:', category.title);
                  }}
                >
                  <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${category.bgColor} mb-4`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary dark:text-[rgb(200,205,210)]">
                    View articles
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-2">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group text-left"
                  onClick={() => {
                    // In a real app, this would navigate to article
                    console.log('Clicked article:', article.title);
                  }}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {article.category}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50"
              onClick={() => navigate('/bubbles')}
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-slate-900 dark:text-white">Chat with Bubbles</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get instant AI-powered help
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50"
              onClick={() => navigate('/learning')}
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                <h3 className="font-bold text-slate-900 dark:text-white">Learning Center</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Interactive financial courses
              </p>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-all bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50"
              onClick={() => navigate('/settings')}
            >
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-slate-900 dark:text-white">Account Settings</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage your preferences
              </p>
            </Card>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border-2 border-primary/20 dark:border-primary/30 shadow-xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/20 mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
              Our support team is here to help! Send us a message and we'll get back to you within 24-48 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 h-12 px-8 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate('/contact')}
              >
                <MessageCircle className="h-5 w-5" />
                Contact Support
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-12 px-8 text-base font-semibold rounded-xl"
                onClick={() => navigate('/bubbles')}
              >
                <Sparkles className="h-5 w-5" />
                Ask Bubbles
              </Button>
            </div>

            {/* Additional Contact Info */}
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Or reach us directly at:
              </p>
              <div className="flex flex-wrap gap-6 justify-center text-sm">
                <a 
                  href="mailto:hello@pako.co.za" 
                  className="text-primary dark:text-[rgb(200,205,210)] hover:underline font-medium"
                >
                  hello@pako.co.za
                </a>
                <Link 
                  to="/privacy-policy" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-[rgb(200,205,210)] transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-[rgb(200,205,210)] transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}