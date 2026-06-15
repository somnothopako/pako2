import { Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { BookOpen, TrendingUp, Gift, Shield, ArrowRight, Sparkles, Heart, Zap, ChevronDown, Compass } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import { BubblesIcon } from '@/app/components/BubblesIcon';
import { useRef } from 'react';

export function Landing() {
  const whatPakoDoesRef = useRef<HTMLElement>(null);

  const scrollToNextSection = () => {
    whatPakoDoesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Animation keyframes for the flow effect
  const flowAnimationStyles = `
    @keyframes flowingGlow {
      0% {
        transform: translateX(0%);
        opacity: 1;
      }
      15% {
        transform: translateX(10%);
      }
      30% {
        transform: translateX(20%);
      }
      45% {
        transform: translateX(33.33%);
      }
      60% {
        transform: translateX(46.66%);
      }
      75% {
        transform: translateX(56.66%);
      }
      90% {
        transform: translateX(66.66%);
      }
      100% {
        transform: translateX(66.66%);
        opacity: 1;
      }
    }

    @keyframes rotateGradientStroke {
      0% {
        transform: rotate(0deg) scale(1);
      }
      15% {
        transform: rotate(54deg) scale(1.02);
      }
      30% {
        transform: rotate(108deg) scale(0.98);
      }
      45% {
        transform: rotate(162deg) scale(1.01);
      }
      60% {
        transform: rotate(216deg) scale(0.99);
      }
      75% {
        transform: rotate(270deg) scale(1.02);
      }
      90% {
        transform: rotate(324deg) scale(0.98);
      }
      100% {
        transform: rotate(360deg) scale(1);
      }
    }

    .flow-container:hover .flowing-glow-overlay {
      animation-play-state: running !important;
    }
  `;

  const features = [
    {
      icon: TrendingUp,
      title: 'Gamified Financial Planning',
      description: 'Make managing money fun with our playful, bubble-themed approach',
    },
    {
      icon: BookOpen,
      title: 'Interactive Financial Education',
      description: 'Learn at your own pace with engaging lessons and quizzes',
    },
    {
      icon: Gift,
      title: 'Earn Points for Consistency',
      description: 'Get rewarded for learning and staying on track with your budget',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Upload or Connect',
      description: 'Share your financial information securely',
    },
    {
      number: '2',
      title: 'Learn and Plan with Bubbles',
      description: 'Your friendly AI assistant guides you every step',
    },
    {
      number: '3',
      title: 'Track Progress & Earn Rewards',
      description: 'Watch your financial health improve and redeem points',
    },
  ];

  const trustPoints = [
    'Identity Verification',
    'Secure and Confidential Credit Assessment',
    'POPIA Compliant',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Soft Gradient Wash Background */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base warm white layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-stone-50 to-zinc-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        
        {/* Layered gradient blobs - Enhanced with more hues and blur */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-100/40 dark:bg-blue-950/20 rounded-full blur-[180px] -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-purple-100/40 dark:bg-purple-950/20 rounded-full blur-[180px] translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-1/4 w-[900px] h-[900px] bg-pink-100/35 dark:bg-pink-950/15 rounded-full blur-[200px] translate-y-1/3" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-violet-100/30 dark:bg-violet-950/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-0 w-[750px] h-[750px] bg-rose-100/30 dark:bg-rose-950/15 rounded-full blur-[190px] translate-x-1/4" />
        <div className="absolute top-1/2 left-0 w-[650px] h-[650px] bg-emerald-100/25 dark:bg-emerald-950/10 rounded-full blur-[170px] -translate-x-1/4" />
        <div className="absolute bottom-0 right-1/3 w-[800px] h-[800px] bg-cyan-100/25 dark:bg-cyan-950/10 rounded-full blur-[185px] translate-y-1/4" />
        <div className="absolute top-2/3 left-1/2 w-[700px] h-[700px] bg-fuchsia-100/30 dark:bg-fuchsia-950/15 rounded-full blur-[175px]" />
        
        {/* Additional hues for richer gradient wash */}
        <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-amber-100/28 dark:bg-amber-950/12 rounded-full blur-[165px]" />
        <div className="absolute bottom-1/3 left-2/3 w-[680px] h-[680px] bg-teal-100/28 dark:bg-teal-950/12 rounded-full blur-[175px]" />
        <div className="absolute top-1/2 right-1/3 w-[620px] h-[620px] bg-indigo-100/30 dark:bg-indigo-950/14 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/2 left-1/4 w-[590px] h-[590px] bg-sky-100/26 dark:bg-sky-950/11 rounded-full blur-[170px]" />
        <div className="absolute top-3/4 right-1/2 w-[720px] h-[720px] bg-lime-100/24 dark:bg-lime-950/10 rounded-full blur-[185px]" />
        <div className="absolute top-1/6 right-2/3 w-[640px] h-[640px] bg-orange-100/27 dark:bg-orange-950/12 rounded-full blur-[175px]" />
        <div className="absolute bottom-2/3 right-1/4 w-[580px] h-[580px] bg-purple-200/32 dark:bg-purple-900/16 rounded-full blur-[190px]" />
        
        {/* Subtle overlay to soften everything - increased blur */}
        <div className="absolute inset-0 bg-white/35 dark:bg-slate-950/45 backdrop-blur-[4px]" />
      </div>

      {/* Decorative Floating Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 12 }).map((_, i) => {
          // Define base positions in a loose grid, then add significant randomization
          const basePositions = [
            { x: 10, y: 10 },
            { x: 30, y: 15 },
            { x: 55, y: 12 },
            { x: 75, y: 18 },
            { x: 5, y: 40 },
            { x: 35, y: 45 },
            { x: 55, y: 42 },
            { x: 78, y: 48 },
            { x: 15, y: 75 },
            { x: 40, y: 78 },
            { x: 60, y: 72 },
            { x: 80, y: 82 },
          ];
          
          // Add significant random offset to break up grid pattern
          const left = basePositions[i].x + (Math.random() * 16 - 8); // ±8%
          const top = basePositions[i].y + (Math.random() * 16 - 8); // ±8%
          
          // More exaggerated, completely unique randomized animation durations
          const breathDuration = 6 + Math.random() * 8; // 6-14 seconds (faster, more noticeable)
          const deformDuration = 8 + Math.random() * 10; // 8-18 seconds
          const colorDuration = 15 + Math.random() * 12; // 15-27 seconds
          const sizeDriftDuration = 10 + Math.random() * 10; // 10-20 seconds
          const rotateDuration = 12 + Math.random() * 12; // 12-24 seconds
          
          // Completely unique randomized delays for unsynchronized motion
          const breathDelay = -Math.random() * breathDuration;
          const deformDelay = -Math.random() * deformDuration;
          const colorDelay = -Math.random() * colorDuration;
          const sizeDriftDelay = -Math.random() * sizeDriftDuration;
          const rotateDelay = -Math.random() * rotateDuration;
          
          const size = 100 + Math.random() * 140; // 100-240px (larger range)
          
          // More exaggerated size drift multiplier
          const sizeDriftMultiplier = 0.85 + Math.random() * 0.3; // 0.85-1.15 (15% variance)
          
          // More noticeable rotation
          const rotationAmount = (Math.random() - 0.5) * 16; // ±8 degrees
          
          return (
            <div
              key={i}
              className="absolute rounded-full blur-3xl animate-ambient cursor-pointer"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                '--bubble-size': `${size}px`,
                '--size-drift-multiplier': sizeDriftMultiplier,
                '--rotation-amount': `${rotationAmount}deg`,
                background: [
                  'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.6) 0%, rgba(200, 180, 255, 0.5) 30%, rgba(135, 206, 235, 0.45) 55%, rgba(255, 200, 150, 0.4) 80%, rgba(150, 220, 180, 0.5) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(200, 180, 255, 0.65) 0%, rgba(173, 216, 230, 0.5) 30%, rgba(255, 180, 120, 0.45) 60%, rgba(120, 220, 180, 0.5) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(135, 206, 235, 0.6) 0%, rgba(100, 200, 255, 0.55) 30%, rgba(180, 120, 255, 0.45) 65%, rgba(255, 200, 150, 0.4) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(150, 220, 180, 0.6) 0%, rgba(173, 216, 230, 0.5) 35%, rgba(200, 180, 255, 0.45) 70%, rgba(255, 180, 120, 0.4) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(255, 180, 120, 0.6) 0%, rgba(200, 180, 255, 0.5) 30%, rgba(173, 216, 230, 0.45) 60%, rgba(150, 220, 180, 0.5) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(173, 216, 230, 0.65) 0%, rgba(150, 220, 180, 0.55) 30%, rgba(200, 180, 255, 0.45) 65%, rgba(135, 206, 235, 0.4) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(200, 180, 255, 0.6) 0%, rgba(255, 180, 120, 0.5) 35%, rgba(173, 216, 230, 0.45) 70%, rgba(120, 220, 180, 0.4) 100%)',
                  'radial-gradient(circle at 30% 30%, rgba(120, 220, 180, 0.65) 0%, rgba(135, 206, 235, 0.55) 30%, rgba(255, 200, 150, 0.45) 60%, rgba(200, 180, 255, 0.5) 100%)',
                ][i % 8],
                animationDelay: `${breathDelay}s, ${deformDelay}s, ${colorDelay}s, ${sizeDriftDelay}s, ${rotateDelay}s`,
                animationDuration: `${breathDuration}s, ${deformDuration}s, ${colorDuration}s, ${sizeDriftDuration}s, ${rotateDuration}s`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost" className="rounded-full hover:bg-primary/15 hover:text-primary dark:hover:bg-primary/20">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-[48px] md:pt-8 pb-[80px] md:pb-32 max-w-7xl mx-auto relative z-10 pr-[16px] pl-[16px] min-h-[100dvh] md:min-h-0 flex flex-col justify-center">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-pink-500/10 to-purple-500/10 px-5 py-2.5 rounded-full border border-primary/20 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm md:text-base font-medium bg-gradient-to-r from-teal-700 via-pink-700 to-purple-700 dark:from-teal-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              Your Financial Wellness Journey Starts Here
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent leading-snug mt-[0px] mr-[0px] mb-[30px] ml-[0px] pb-2">
            Blow Bubbles, <br />not your Budget
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-[95%] sm:max-w-[90%] md:max-w-5xl mx-auto leading-relaxed whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">
            PAKO makes financial wellness accessible, friendly, and rewarding for everyone
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg text-white"
                style={{
                  background: '#2F7F7A'
                }}
              >
                Try PAKO
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-6 py-5 md:px-8 md:py-6 text-base md:text-lg rounded-2xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 transition-all duration-300 hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator Arrow */}
        <button
          onClick={scrollToNextSection}
          className="hidden md:flex absolute bottom-16 left-1/2 -translate-x-1/2 flex-col items-center gap-2 cursor-pointer group animate-pulse hover:animate-none transition-all bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl hover:scale-110"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-6 w-6 text-primary group-hover:text-pink-500 transition-colors" />
        </button>
      </section>

      {/* What PAKO Does */}
      <section className="px-4 py-20 max-w-7xl mx-auto relative z-10" ref={whatPakoDoesRef}>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
          What PAKO Does
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-8 space-y-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 rounded-3xl"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Feels to Use */}
      <section className="px-4 py-20 relative z-10">
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 border-y border-white/20 dark:border-white/10"></div>
        <div className="absolute inset-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Key Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Compass, text: 'Guidance', color: 'from-pink-400 to-pink-600' },
              { icon: TrendingUp, text: 'Progress', color: 'from-purple-400 to-purple-600' },
              { icon: Shield, text: 'Control', color: 'from-blue-400 to-blue-600' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  {/* Rotating gradient stroke border - only visible on hover */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div 
                      className="absolute inset-0 rounded-full p-[3px]"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0%, rgba(59, 130, 246, 0.8) 15%, rgba(147, 51, 234, 0.9) 35%, rgba(236, 72, 153, 0.8) 50%, transparent 65%, transparent 100%)',
                        animation: 'rotateGradientStroke 3s ease-in-out infinite',
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-900" />
                    </div>
                  </div>
                  
                  {/* Main circle with icon */}
                  <div className={`relative h-32 w-32 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.text}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Bubbles */}
      <section className="px-4 py-20 max-w-4xl mx-auto relative z-10">
        <Card className="p-10 space-y-6 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Subtle Background Bubbles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {/* Bubble 1 - Soft Blue */}
            <div 
              className="absolute rounded-full blur-[120px]"
              style={{
                width: '280px',
                height: '280px',
                top: '10%',
                left: '-5%',
                background: 'radial-gradient(circle, rgba(147, 197, 253, 0.15) 0%, rgba(147, 197, 253, 0.05) 50%, transparent 100%)',
                animation: 'gentleFloat 25s ease-in-out infinite',
                animationDelay: '0s',
              }}
            />
            
            {/* Bubble 2 - Softer Blue */}
            <div 
              className="absolute rounded-full blur-[100px]"
              style={{
                width: '220px',
                height: '220px',
                bottom: '5%',
                right: '10%',
                background: 'radial-gradient(circle, rgba(191, 219, 254, 0.12) 0%, rgba(191, 219, 254, 0.04) 50%, transparent 100%)',
                animation: 'gentleDrift 30s ease-in-out infinite',
                animationDelay: '-10s',
              }}
            />
            
            {/* Bubble 3 - Dark Teal */}
            <div 
              className="absolute rounded-full blur-[110px]"
              style={{
                width: '200px',
                height: '200px',
                top: '50%',
                right: '-3%',
                background: 'radial-gradient(circle, rgba(47, 127, 122, 0.1) 0%, rgba(47, 127, 122, 0.03) 50%, transparent 100%)',
                animation: 'gentleFloat 28s ease-in-out infinite',
                animationDelay: '-15s',
              }}
            />
          </div>
          
          {/* Content - positioned above bubbles */}
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-20 w-20 flex items-center justify-center relative overflow-visible">
              <div className="animate-bounce">
                <BubblesIcon size={80} />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Introducing Bubbles</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Your friendly AI financial coach</p>
            </div>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">
            Bubbles is here to guide you on your financial journey with gentle support, smart insights, and zero judgment. 
            Ask questions anytime, get personalized advice, and build confidence in your money decisions.
          </p>
          
          {/* Add gentle animation keyframes */}
          <style>{`
            @keyframes gentleFloat {
              0%, 100% {
                transform: translate(0, 0);
              }
              33% {
                transform: translate(8px, -12px);
              }
              66% {
                transform: translate(-6px, 8px);
              }
            }
            
            @keyframes gentleDrift {
              0%, 100% {
                transform: translate(0, 0);
              }
              50% {
                transform: translate(-10px, 10px);
              }
            }
          `}</style>
        </Card>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 relative z-10">
        <style>{flowAnimationStyles}</style>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="relative flow-container">
            <div className="grid md:grid-cols-3 gap-12 mt-[0px] mr-[0px] mb-[0px] ml-[10px] m-[0px] relative" style={{ zIndex: 1 }}>
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div 
                      className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-1 mt-[0px] mr-[0px] mb-[0px] ml-[23px] rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="px-4 py-20 max-w-4xl mx-auto relative z-10">
        <Card className="p-10 space-y-8 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shadow-lg">
              <Shield className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Your Data is Safe with Us</h2>
          </div>
          <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400">
            <p className="leading-relaxed">
              PAKO uses bank-level encryption to keep your financial information secure. 
              We never share your data with third parties without your permission.
            </p>
            <div className="space-y-3">
              {trustPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-purple-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 max-w-7xl mx-auto relative z-10">
        <div className="rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden">
          {/* Soft gradient background with darker teal mixing */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(135deg, rgba(128, 90, 213, 0.4) 0%, rgba(178, 223, 219, 0.4) 25%, rgba(173, 180, 230, 0.4) 50%, rgba(147, 112, 219, 0.4) 75%, rgba(32, 178, 170, 0.4) 100%)'
            }}
          />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-slate-700 dark:text-slate-200">
              Join thousands of South Africans building better financial futures
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 rounded-2xl bg-white text-primary hover:bg-slate-50 hover:scale-110 transition-all duration-300 font-semibold"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-8">
            <Logo size="lg" />
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-md text-lg leading-relaxed">
              Making financial wellness accessible, friendly, and rewarding for all South Africans
            </p>
            <div className="flex flex-wrap gap-8 text-sm text-slate-600 dark:text-slate-400 justify-center">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors font-medium">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-primary transition-colors font-medium">Terms of Service</Link>
              <Link to="/contact" className="hover:text-primary transition-colors font-medium">Contact Us</Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500">© 2026 PAKO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}