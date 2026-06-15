import { Card } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import { 
  TrendingUp, 
  Shield, 
  FileCheck,
  ChevronRight,
  Wallet,
  PiggyBank,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export function Investments() {
  const navigate = useNavigate();

  // Mock data for summary metrics
  const tfsaProgress = {
    contributed: 15000,
    limit: 36000,
    percentage: (15000 / 36000) * 100,
  };

  return (
    <div className="min-h-screen px-4 py-6 space-y-8 max-w-6xl mx-auto">
      {/* Summary Container */}
      <Card className="relative overflow-hidden p-6 bg-white dark:bg-[linear-gradient(to_bottom_right,rgb(10,16,18),rgb(12,17,20),rgb(11,18,19))] shadow-lg border-primary/10">
        {/* Floating Bubbles - Fun and Dynamic Background */}
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
              animation: 'bubbleFloat1 20s ease-in-out infinite',
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
              animation: 'bubbleFloat2 25s ease-in-out infinite',
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
              animation: 'bubbleFloat3 22s ease-in-out infinite',
            }}
          />
        </div>
        
        <div className="relative flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left: Clinic Heading - 1/3 */}
          <div className="lg:w-1/3 flex flex-col justify-center">
            <h1 className="text-3xl font-bold">Clinic</h1>
            <p className="text-sm text-[#0F3D3E] dark:text-[rgb(240,243,245)] mt-1">Review and improve your financial setup</p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-border" />
          <div className="lg:hidden w-full h-px bg-border" />

          {/* Right: Key Metrics - 2/3 */}
          <div className="lg:w-2/3 grid md:grid-cols-3 gap-6">
            {/* Unit Trusts Performance */}
            <div className="space-y-2 pt-[0px] pr-[30px] pb-[0px] pl-[0px] mt-[0px] mr-[10px] mb-[0px] ml-[0px]">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Unit Trusts
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600 dark:text-[rgb(180,185,190)]">+8.3%</p>
                <p className="text-xs text-muted-foreground">Avg. annual return</p>
              </div>
            </div>

            {/* TFSA Progress */}
            <div className="space-y-2 mt-[0px] mr-[65px] mb-[0px] ml-[-20px] pt-[0px] pr-[0px] pb-[0px] pl-[-5px]">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  TFSA
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1 mt-[5px] mr-[0px] mb-[8px] ml-[0px]">
                  <p className="text-lg font-bold">R{tfsaProgress.contributed.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">/ R{tfsaProgress.limit.toLocaleString()}</p>
                </div>
                <Progress value={tfsaProgress.percentage} className="h-1.5 mt-[10px] mr-[0px] mb-[0px] ml-[0px]" />
              </div>
            </div>

            {/* Insurance Review CTA */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Insurance
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Get an insurance review</p>
                <p className="text-xs text-muted-foreground text-[13px] mt-[10px] mr-[0px] mb-[0px] ml-[0px]">Find overlaps & save money</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 1 - Investments */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Investments</h2>
          <p className="text-sm text-[#0F3D3E] dark:text-[rgb(255,255,255)] mt-1">
            Explore investment opportunities with trusted financial service providers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Unit Trusts Subcontainer */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className="p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
              onClick={() => navigate('/clinic/unit-trusts')}
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Unit Trusts</h3>
                <p className="text-sm text-[rgb(255,255,255)] leading-relaxed">
                  Professionally managed investment funds for long-term growth
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>Managed by licensed FSPs</span>
              </div>
            </Card>
          </motion.div>

          {/* TFSA Subcontainer */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className="p-6 space-y-4 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30"
              onClick={() => navigate('/clinic/tfsa')}
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <PiggyBank className="h-6 w-6 text-primary" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Tax-Free Savings Account</h3>
                <p className="text-sm text-[rgb(255,255,255)] leading-relaxed">
                  Tax-efficient savings for your long-term financial goals
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                <span>Tax-free growth on investments</span>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Section 2 - Insurance Policy Check */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Insurance Review</h2>
          <p className="text-sm text-[#0F3D3E] dark:text-[rgb(255,255,255)] mt-1">
            Identify overlaps and optimize your insurance policies
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
        >
          <Card 
            className="p-6 space-y-5 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/30 bg-white dark:bg-gradient-to-br dark:from-primary/5 dark:to-background dark:border-primary/20"
            onClick={() => navigate('/clinic/insurance-policy-check')}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg dark:text-white">Insurance Policy Check</h3>
                  <p className="text-sm text-muted-foreground dark:text-white mt-1">
                    Review all your policies to find overlaps and potential savings
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground dark:text-white flex-shrink-0" />
            </div>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground dark:text-white">Detect duplicate coverage</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground dark:text-white">Find coverage gaps</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground dark:text-white">Optimize premiums</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground dark:text-white">Smart recommendations</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white pt-2 border-t border-border">
              <Shield className="h-3.5 w-3.5" />
              <span>Your data is encrypted and never shared without permission</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}