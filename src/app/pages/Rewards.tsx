import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Gift, 
  Sparkles, 
  Award,
  ShoppingBag,
  Wifi,
  Lock,
  Star,
  TrendingUp,
  Clock,
  ChevronDown,
  HelpCircle,
  X,
  CheckCircle
} from 'lucide-react';
import { mockUser, rewardsData, rewardsProgress } from '@/app/data/mockData';
import { useState, useEffect } from 'react';
import { useBubbles } from '@/app/contexts/BubblesContext';

interface RedeemedReward {
  id: string;
  reward: any;
  code: string;
  barcode: string;
  redeemedAt: Date;
}

export function Rewards() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEarnPointsExpanded, setIsEarnPointsExpanded] = useState(false);
  const [openPopup, setOpenPopup] = useState<'balance' | 'expiring' | null>(null);
  const [closingPopup, setClosingPopup] = useState(false);
  const [redemptionPopup, setRedemptionPopup] = useState<{ reward: any; code: string; barcode: string } | null>(null);
  const [closingRedemption, setClosingRedemption] = useState(false);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [selectedRedemption, setSelectedRedemption] = useState<RedeemedReward | null>(null);
  const [closingSelectedRedemption, setClosingSelectedRedemption] = useState(false);
  const { setIsModalOpen } = useBubbles();
  
  // Animation state for counters and progress bars
  const [animatedPointsBalance, setAnimatedPointsBalance] = useState(0);
  const [animatedPointsEarned, setAnimatedPointsEarned] = useState(0);
  const [animatedActiveRewards, setAnimatedActiveRewards] = useState(0);
  const [animatedPointsExpiring, setAnimatedPointsExpiring] = useState(0);
  const [animatedCircleProgress, setAnimatedCircleProgress] = useState(0);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Animate counters and progress bars on mount
  useEffect(() => {
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    // Calculate target values
    const targetPointsBalance = rewardsProgress.pointsBalance;
    const targetPointsEarned = rewardsProgress.pointsEarned;
    const targetActiveRewards = rewardsProgress.activeRewards;
    const targetPointsExpiring = rewardsProgress.pointsExpiringSoon;
    const targetCircleProgress = (rewardsProgress.pointsBalance / 5000) * 226;
    
    // Animation loop with smoother easing
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart for smoother, more gradual deceleration)
      const eased = 1 - Math.pow(1 - progress, 4);
      
      // Update all counter values
      setAnimatedPointsBalance(targetPointsBalance * eased);
      setAnimatedPointsEarned(targetPointsEarned * eased);
      setAnimatedActiveRewards(targetActiveRewards * eased);
      setAnimatedPointsExpiring(targetPointsExpiring * eased);
      setAnimatedCircleProgress(targetCircleProgress * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Set final values to ensure precision
        setAnimatedPointsBalance(targetPointsBalance);
        setAnimatedPointsEarned(targetPointsEarned);
        setAnimatedActiveRewards(targetActiveRewards);
        setAnimatedPointsExpiring(targetPointsExpiring);
        setAnimatedCircleProgress(targetCircleProgress);
      }
    };
    
    // Start animation
    requestAnimationFrame(animate);
  }, []);

  const icons = {
    'Shoprite': ShoppingBag,
    'Takealot': ShoppingBag,
    'Woolworths': ShoppingBag,
    'Data': Wifi,
  };

  const getIcon = (name: string) => {
    for (const [key, Icon] of Object.entries(icons)) {
      if (name.includes(key)) return Icon;
    }
    return Gift;
  };

  // Generate mock redemption code and barcode
  const generateRedemptionCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 4 === 0 && i !== 11) code += '-';
    }
    return code;
  };

  const generateBarcodeNumber = () => {
    let barcode = '';
    for (let i = 0; i < 13; i++) {
      barcode += Math.floor(Math.random() * 10);
    }
    return barcode;
  };

  const handleRedeemReward = (reward: any) => {
    const code = generateRedemptionCode();
    const barcode = generateBarcodeNumber();
    const newRedemption: RedeemedReward = {
      id: `${reward.id}-${Date.now()}`,
      reward,
      code,
      barcode,
      redeemedAt: new Date(),
    };
    setRedeemedRewards([newRedemption, ...redeemedRewards]);
    setRedemptionPopup({ reward, code, barcode });
    setClosingRedemption(false);
    setIsModalOpen(true); // Close floating Bubbles
  };

  const handleCloseRedemption = () => {
    setClosingRedemption(true);
    setTimeout(() => {
      setRedemptionPopup(null);
      setClosingRedemption(false);
      setIsModalOpen(false); // Re-enable floating Bubbles
    }, 300);
  };

  const handleOpenPopup = (type: 'balance' | 'expiring') => {
    setOpenPopup(type);
    setClosingPopup(false);
    setIsModalOpen(true); // Close the floating Bubbles assistant
  };

  const handleClosePopup = () => {
    setClosingPopup(true);
    setTimeout(() => {
      setOpenPopup(null);
      setClosingPopup(false);
      setIsModalOpen(false); // Re-enable the floating Bubbles assistant
    }, 300);
  };

  const handleViewRedemption = (redemption: RedeemedReward) => {
    setSelectedRedemption(redemption);
    setClosingSelectedRedemption(false);
    setIsModalOpen(true); // Close floating Bubbles
  };

  const handleCloseSelectedRedemption = () => {
    setClosingSelectedRedemption(true);
    setTimeout(() => {
      setSelectedRedemption(null);
      setClosingSelectedRedemption(false);
      setIsModalOpen(false); // Re-enable floating Bubbles
    }, 300);
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-6xl mx-auto">
      {/* Animation Keyframes */}
      <style>{`
        @keyframes bubbleFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(15px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-10px, 15px) scale(0.98);
          }
        }
        
        @keyframes bubbleFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-20px, 15px) scale(1.03);
          }
          66% {
            transform: translate(18px, -12px) scale(0.97);
          }
        }
        
        @keyframes bubbleFloat3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(12px, 18px) scale(1.04);
          }
          66% {
            transform: translate(-15px, -10px) scale(0.96);
          }
        }
        
        @keyframes bubblePopOut {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes bubblePopIn {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Rewards Summary Container - Redesigned */}
      <Card className="relative overflow-hidden p-8 bg-white dark:bg-[linear-gradient(to_bottom_right,rgb(18,16,10),rgb(16,15,12),rgb(17,16,11))] shadow-lg border-primary/10">
        {/* Floating Bubbles - Same as Learning Hub */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Bubble 1 - Dark Teal (#2F7F7A) - Top Right */}
          <div 
            className="absolute rounded-full blur-[108px]"
            style={{
              width: '280px',
              height: '280px',
              top: '-10%',
              right: '10%',
              background: 'rgba(47, 127, 122, 0.30)',
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
                ? 'bubblePopIn 0.3s ease-out forwards'
                : 'bubbleFloat1 20s ease-in-out infinite',
            }}
          />
          
          {/* Bubble 2 - Bright Blue (#0B6AC5) - Bottom Left */}
          <div 
            className="absolute rounded-full blur-[118px]"
            style={{
              width: '320px',
              height: '320px',
              bottom: '-15%',
              left: '5%',
              background: 'rgba(11, 106, 197, 0.30)',
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
                ? 'bubblePopIn 0.3s ease-out forwards'
                : 'bubbleFloat2 25s ease-in-out infinite',
            }}
          />
          
          {/* Bubble 3 - Dark Teal (#2F7F7A) - Center Right */}
          <div 
            className="absolute rounded-full blur-[104px]"
            style={{
              width: '260px',
              height: '260px',
              top: '45%',
              right: '-5%',
              background: 'rgba(47, 127, 122, 0.30)',
              animation: openPopup && !closingPopup
                ? 'bubblePopOut 0.3s ease-out forwards'
                : closingPopup
                ? 'bubblePopIn 0.3s ease-out forwards'
                : 'bubbleFloat3 22s ease-in-out infinite',
            }}
          />
        </div>
        
        <div className="relative space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Rewards</h1>
            <p className="text-muted-foreground">Redeem your points for real rewards</p>
          </div>

          {/* Compact Stats Grid - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Your Reward Balance - Left */}
            <button 
              onClick={() => handleOpenPopup('balance')}
              className="group relative text-left w-full"
            >
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-yellow-50/80 to-yellow-50/40 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-2xl border border-yellow-400/50 dark:border-yellow-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-yellow-500/60 dark:hover:border-yellow-600/60 cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Compact Points Display */}
                  <div className="relative flex-shrink-0">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-primary/20"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${animatedCircleProgress} 226`}
                        strokeLinecap="round"
                        className="text-secondary transition-all duration-500"
                      />
                    </svg>
                    
                    <div className="relative w-20 h-20 flex flex-col items-center justify-center">
                      <Star className="h-5 w-5 text-secondary mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                      <p className="text-2xl font-bold text-slate-900 dark:text-[rgb(240,243,245)]">{Math.round(animatedPointsBalance)}</p>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1">Your Balance</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                      {5000 - rewardsProgress.pointsBalance > 0 
                        ? `${5000 - rewardsProgress.pointsBalance} pts to unlock premium`
                        : 'All rewards unlocked!'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="secondary" className="bg-background/50 text-xs text-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{rewardsProgress.pointsEarned}
                      </Badge>
                      <Badge variant="secondary" className="bg-background/50 text-xs text-foreground">
                        <Gift className="h-3 w-3 mr-1" />
                        {rewardsProgress.activeRewards}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Points Expiring Soon - Right */}
            <button 
              onClick={() => handleOpenPopup('expiring')}
              className="group relative text-left w-full"
            >
              <div className="relative overflow-hidden p-5 bg-gradient-to-br from-orange-50/80 to-orange-50/40 dark:from-orange-900/20 dark:to-orange-900/10 rounded-2xl border border-orange-400/50 dark:border-orange-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-orange-500/60 dark:hover:border-orange-600/60 cursor-pointer">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                    <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-[rgb(200,205,210)] uppercase tracking-wide mb-1">Expiring Soon</h3>
                    <p className="text-2xl font-bold text-slate-900 dark:text-[rgb(240,243,245)]">{Math.round(animatedPointsExpiring)}</p>
                    <p className="text-xs text-slate-700 dark:text-[rgb(180,185,190)] mt-1">points in 30 days</p>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Ways to Earn - Collapsible */}
          <div className="border-t border-border/50 pt-4">
            <button
              onClick={() => setIsEarnPointsExpanded(!isEarnPointsExpanded)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Ways to earn</span>
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Collapsible Content with Slide Animation */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isEarnPointsExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { action: 'Complete a course', points: 100 },
                  { action: 'Pass a quiz', points: 50 },
                  { action: 'Stay within budget', points: 200 },
                  { action: 'Daily login streak', points: 10 },
                  { action: 'Upload bank statements', points: 25 },
                  { action: 'Reach savings goal', points: 150 },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-background to-background/50 border border-border rounded-lg space-y-1 hover:border-primary/30 transition-colors">
                    <p className="font-medium text-sm">{item.action}</p>
                    <p className="text-2xl font-bold text-secondary">+{item.points}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Available Rewards */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-lg">Available Rewards</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[...rewardsData].sort((a, b) => a.points - b.points).map((reward) => {
            const Icon = getIcon(reward.name);
            const canAfford = mockUser.points >= reward.points;
            
            return (
              <div 
                key={reward.id} 
                className={`p-6 flex flex-col min-h-[180px] border rounded-lg ${!canAfford ? 'opacity-60' : 'hover:shadow-md transition-shadow'}`}
              >
                {/* Top Content Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        canAfford ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Icon className={`h-6 w-6 ${canAfford ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold line-clamp-2">{reward.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={canAfford ? 'default' : 'secondary'}>
                            {reward.points} points
                          </Badge>
                          {!canAfford && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Button Section - Pinned to bottom */}
                <div className="pt-4">
                  {canAfford ? (
                    <Button className="w-full" onClick={() => handleRedeemReward(reward)}>
                      Redeem Reward
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">
                        Need {reward.points - mockUser.points} more points
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Transparency Notice */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold">Simple & Transparent Rewards</h3>
            <p className="text-sm text-muted-foreground">
              All rewards are straightforward - no gambling, no chance mechanics, just clear value for your points. 
              Redeem whenever you're ready, and your vouchers will be sent via email within 24 hours.
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Redemptions */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-lg">Recent Redemptions</h3>
        {redeemedRewards.length > 0 ? (
          <div className="space-y-4">
            {redeemedRewards.map((redemption) => (
              <div key={redemption.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold line-clamp-2">{redemption.reward.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Redeemed on {redemption.redeemedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  className="text-sm"
                  onClick={() => handleViewRedemption(redemption)}
                >
                  View Voucher
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>You haven't redeemed any rewards yet</p>
            <p className="text-sm">Start earning points to unlock rewards!</p>
          </div>
        )}
      </Card>

      {/* Popup Modals */}
      {openPopup && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto ${closingPopup ? 'animate-[fadeOut_0.3s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Popup Card with scale + fade-in/out animation */}
          <div className={closingPopup ? 'animate-[scaleOut_0.3s_ease-out]' : 'animate-[scaleIn_0.3s_ease-out]'}>
            <style>{`
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes scaleOut {
                from {
                  opacity: 1;
                  transform: scale(1);
                }
                to {
                  opacity: 0;
                  transform: scale(0.95);
                }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              @keyframes iconPulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.08);
                }
              }
            `}</style>

            {/* Balance Popup */}
            {openPopup === 'balance' && (
              <Card className="p-6 max-w-md w-full bg-gradient-to-br from-green-50/90 via-green-50/80 to-green-100/70 border-2 border-green-200/50 shadow-2xl relative">
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-slate-700 group-hover:text-slate-900 transition-colors" />
                </button>

                {/* Content */}
                <div className="space-y-5">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center"
                      style={{
                        animation: closingPopup ? 'none' : 'iconPulse 2s ease-in-out infinite'
                      }}
                    >
                      <Star className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Your Balance</h3>
                      <p className="text-sm text-slate-700">Total points available</p>
                    </div>
                  </div>

                  {/* Main Value */}
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold text-slate-900 mb-2">{rewardsProgress.pointsBalance}</p>
                    <p className="text-sm text-slate-700">points</p>
                  </div>

                  {/* Insight Badge */}
                  <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-border">
                    <p className="text-sm font-semibold text-slate-900 mb-1">✨ Progress</p>
                    <p className="text-sm text-[rgba(2,9,19,0.89)]">
                      You've earned +{rewardsProgress.pointsEarned} points this month and have {rewardsProgress.activeRewards} active rewards!
                    </p>
                  </div>

                  {/* Details */}
                  <div className="pt-2">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {5000 - rewardsProgress.pointsBalance > 0 
                        ? `You're ${5000 - rewardsProgress.pointsBalance} points away from unlocking premium tier rewards. Keep completing courses and activities to earn more!`
                        : 'Congratulations! You\'ve unlocked premium tier. You have access to all available rewards. Redeem them anytime for real value.'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Expiring Popup */}
            {openPopup === 'expiring' && (
              <Card className="p-6 max-w-md w-full bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-900/10 border-2 border-orange-200/40 dark:border-orange-800/30 shadow-2xl relative">
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>

                {/* Content */}
                <div className="space-y-5">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <div 
                      className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center"
                      style={{
                        animation: closingPopup ? 'none' : 'iconPulse 2s ease-in-out infinite'
                      }}
                    >
                      <Clock className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Expiring Soon</h3>
                      <p className="text-sm text-muted-foreground">Use them before they're gone</p>
                    </div>
                  </div>

                  {/* Main Value */}
                  <div className="text-center py-4">
                    <p className="text-5xl font-bold text-foreground mb-2">{rewardsProgress.pointsExpiringSoon}</p>
                    <p className="text-sm text-muted-foreground">points expiring in 30 days</p>
                  </div>

                  {/* Insight Badge */}
                  <div className="p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-border">
                    <p className="text-sm font-semibold text-foreground mb-1">⏰ Reminder</p>
                    <p className="text-sm text-muted-foreground">
                      These points will expire on <span className="font-bold">February 18, 2026</span>. Redeem them or complete activities to extend.
                    </p>
                  </div>

                  {/* Details */}
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Points expire after 90 days of inactivity, but any learning activity resets the timer for all your points. 
                      Complete a course or quiz to keep your points active!
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Redemption Popup */}
      {redemptionPopup && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto ${closingRedemption ? 'animate-[fadeOut_0.3s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Popup Card with scale + fade-in/out animation */}
          <div className={closingRedemption ? 'animate-[scaleOut_0.3s_ease-out]' : 'animate-[scaleIn_0.3s_ease-out]'}>
            <style>{`
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes scaleOut {
                from {
                  opacity: 1;
                  transform: scale(1);
                }
                to {
                  opacity: 0;
                  transform: scale(0.95);
                }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              @keyframes iconPulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.08);
                }
              }
            `}</style>

            {/* Redemption Popup */}
            <Card className="p-6 max-w-md w-full bg-gradient-to-br from-amber-50/90 via-yellow-50/80 to-amber-100/70 border-2 border-amber-200/50 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={handleCloseRedemption}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-slate-700 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* Content */}
              <div className="space-y-5">
                {/* Icon + Title */}
                <div className="flex items-center gap-4">
                  <div 
                    className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                    style={{
                      animation: closingRedemption ? 'none' : 'iconPulse 2s ease-in-out infinite'
                    }}
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Reward Redeemed!</h3>
                    <p className="text-sm text-slate-700">{redemptionPopup.reward.name}</p>
                  </div>
                </div>

                {/* Reward Details */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold">Present this voucher</p>
                </div>

                {/* Redemption Code */}
                <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border-2 border-primary/30">
                  <p className="text-xs text-slate-600 text-center mb-2">Redemption Code</p>
                  <p className="text-2xl font-bold text-center tracking-wider text-slate-900 dark:text-[rgb(240,243,245)] font-mono">{redemptionPopup.code}</p>
                </div>

                {/* Barcode */}
                <div className="p-4 rounded-xl bg-white border-2 border-primary/30">
                  <div className="flex justify-center items-center gap-[2px] h-24 bg-white px-4">
                    {/* Generate barcode bars */}
                    {redemptionPopup.barcode.split('').map((digit, index) => {
                      const height = parseInt(digit) > 5 ? '100%' : '80%';
                      const width = parseInt(digit) % 2 === 0 ? '6px' : '4px';
                      return (
                        <div
                          key={index}
                          className="bg-black"
                          style={{
                            width: width,
                            height: height,
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-center text-xs font-mono text-slate-900 mt-2">{redemptionPopup.barcode}</p>
                </div>

                {/* Insight Badge */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold text-slate-900 mb-1">🎉 Success!</p>
                  <p className="text-sm text-slate-700">
                    Your voucher is ready! Present this code at checkout or use it online. Valid for 30 days.
                  </p>
                </div>

                {/* Details */}
                <div className="pt-2">
                  <p className="text-xs text-slate-600 leading-relaxed text-center">
                    Screenshot this for your records. A copy has also been sent to your email.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Selected Redemption Popup */}
      {selectedRedemption && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-auto ${closingSelectedRedemption ? 'animate-[fadeOut_0.3s_ease-out]' : 'animate-[fadeIn_0.2s_ease-out]'}`}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Popup Card with scale + fade-in/out animation */}
          <div className={closingSelectedRedemption ? 'animate-[scaleOut_0.3s_ease-out]' : 'animate-[scaleIn_0.3s_ease-out]'}>
            <style>{`
              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              @keyframes scaleOut {
                from {
                  opacity: 1;
                  transform: scale(1);
                }
                to {
                  opacity: 0;
                  transform: scale(0.95);
                }
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              @keyframes iconPulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.08);
                }
              }
            `}</style>

            {/* Selected Redemption Popup */}
            <Card className="p-6 max-w-md w-full bg-gradient-to-br from-amber-50/90 via-yellow-50/80 to-amber-100/70 border-2 border-amber-200/50 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={handleCloseSelectedRedemption}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors group"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-slate-700 group-hover:text-slate-900 transition-colors" />
              </button>

              {/* Content */}
              <div className="space-y-5">
                {/* Icon + Title */}
                <div className="flex items-center gap-4">
                  <div 
                    className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                    style={{
                      animation: closingSelectedRedemption ? 'none' : 'iconPulse 2s ease-in-out infinite'
                    }}
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Reward Redeemed!</h3>
                    <p className="text-sm text-slate-700">{selectedRedemption.reward.name}</p>
                  </div>
                </div>

                {/* Reward Details */}
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-600 uppercase tracking-wide font-semibold">Present this voucher</p>
                </div>

                {/* Redemption Code */}
                <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border-2 border-primary/30">
                  <p className="text-xs text-slate-600 text-center mb-2">Redemption Code</p>
                  <p className="text-2xl font-bold text-center tracking-wider text-slate-900 dark:text-[rgb(240,243,245)] font-mono">{selectedRedemption.code}</p>
                </div>

                {/* Barcode */}
                <div className="p-4 rounded-xl bg-white border-2 border-primary/30">
                  <div className="flex justify-center items-center gap-[2px] h-24 bg-white px-4">
                    {/* Generate barcode bars */}
                    {selectedRedemption.barcode.split('').map((digit, index) => {
                      const height = parseInt(digit) > 5 ? '100%' : '80%';
                      const width = parseInt(digit) % 2 === 0 ? '6px' : '4px';
                      return (
                        <div
                          key={index}
                          className="bg-black"
                          style={{
                            width: width,
                            height: height,
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-center text-xs font-mono text-slate-900 mt-2">{selectedRedemption.barcode}</p>
                </div>

                {/* Insight Badge */}
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold text-slate-900 mb-1">🎉 Success!</p>
                  <p className="text-sm text-slate-700">
                    Your voucher is ready! Present this code at checkout or use it online. Valid for 30 days.
                  </p>
                </div>

                {/* Details */}
                <div className="pt-2">
                  <p className="text-xs text-slate-600 leading-relaxed text-center">
                    Screenshot this for your records. A copy has also been sent to your email.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}