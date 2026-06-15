import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import pakoLogoWatermark from 'figma:asset/801b48dfe9d59c06d3fbcf335528d783ab88ec14.png';
import { useUser } from '@/app/contexts/UserContext';

export function PrivacyPolicy() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  
  // Check where user came from
  const fromSignup = location.state?.from === 'signup';
  const fromSettings = location.state?.from === 'settings';
  
  const handleBackClick = () => {
    // Priority 1: If user came from signup, always return to signup
    if (fromSignup) {
      // Return to signup page at Step 4
      navigate('/signup', { state: { returnToStep: 4 } });
    } 
    // Priority 2: If user is authenticated (logged in)
    else if (isAuthenticated) {
      // Return to home page when authenticated
      navigate('/home');
    } 
    // Priority 3: Default fallback
    else {
      // Return to landing page
      navigate('/');
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
      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent mt-[0px] mr-[0px] mb-[20px] ml-[0px] pb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Last updated: January 17, 2026
          </p>

          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. INTRODUCTION AND RESPONSIBLE PARTY
              </h2>
              <p>
                PAKO (Pty) Ltd ("PAKO", "we", "us"), registration number 2025/752609, is the Responsible Party for the personal information processed through our mobile application and website. We are committed to the Eight Conditions for Lawful Processing as set out in POPIA. This notice describes how we collect, use, disclose, and protect your information.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. INFORMATION WE COLLECT
              </h2>
              <p>We collect information categorized under POPIA as follows:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>Identifying Information:</strong> Full names, South African Identity Number (for FICA/KYC compliance), and biometric data (if used for app authentication).</li>
                <li><strong>Contact Information:</strong> Email address, mobile number, and physical address.</li>
                <li><strong>Financial Information:</strong> Bank account numbers, real-time transaction history, account balances, and categorized spending data via our secure aggregators.</li>
                <li><strong>Credit & Risk Data:</strong> Credit scores, debt obligations, and affordability assessments.</li>
                <li><strong>Technical Data:</strong> IP addresses, device UUIDs, geolocation (to prevent fraud), and "usage cookies" for platform optimization.</li>
                <li><strong>Special Personal Information:</strong> We do not knowingly collect information regarding your religious beliefs, race, or health unless specifically required by law or if you voluntarily include such details in transaction descriptions.</li>
              </ul>
            </section>

            {/* How We Collect Data */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. HOW WE COLLECT DATA
              </h2>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>Directly from You:</strong> During registration and profile completion.</li>
                <li><strong>Automated Technologies:</strong> Via cookies and app telemetry as you navigate the platform.</li>
                <li><strong>Third-Party Sources:</strong> We use Operators (Aggregators such as Stitch or Akahu) to securely link your bank accounts. By linking your account, you authorize us to retrieve data directly from your financial institution.</li>
              </ul>
            </section>

            {/* Lawful Basis and Purpose */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. LAWFUL BASIS AND PURPOSE OF PROCESSING
              </h2>
              <p>
                In terms of Section 11 of POPIA, we process your information based on Contractual Necessity and your Express Consent for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>AI Financial Analysis:</strong> Using machine learning to categorize transactions and provide "Smart Insights."</li>
                <li><strong>Product Personalization:</strong> Tailoring budget "bubbles" and financial goals to your unique cash flow.</li>
                <li><strong>FICA & AML Compliance:</strong> Verifying your identity to prevent money laundering and fraud.</li>
                <li><strong>Communication:</strong> Sending system alerts, security notices, and (with your opt-in) marketing related to financial wellness.</li>
                <li><strong>AI Model Improvement:</strong> We use de-identified and aggregated data to train our algorithms to better serve the South African market.</li>
              </ul>
            </section>

            {/* Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. SHARING AND DISCLOSURE
              </h2>
              <p>We do not sell your data. We only share information with:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>Operators:</strong> Service providers who host our data (e.g., AWS Cape Town) or provide technical functionality.</li>
                <li><strong>Regulatory Bodies:</strong> When required by the South African Revenue Service (SARS), the Financial Intelligence Centre (FIC), or a court order.</li>
                <li><strong>Professional Advisors:</strong> Our legal and cyber-security auditors to ensure PAKO remains secure.</li>
              </ul>
            </section>

            {/* Trans-Border Data Flows */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. TRANS-BORDER DATA FLOWS
              </h2>
              <p>
                While we prioritize local hosting in the AWS Cape Town Region, some of our technical service providers (e.g., email delivery or analytics tools) may operate in the USA or Europe. In terms of Section 72 of POPIA, we ensure these third parties are subject to laws or agreements that provide a level of protection at least as robust as POPIA.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. DATA SECURITY (POPIA CONDITION 7)
              </h2>
              <p>
                We implement "Appropriate, Reasonable, Technical, and Organisational Measures" to prevent loss or unauthorized access:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>Encryption:</strong> All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</li>
                <li><strong>Access Control:</strong> Strict "Least Privilege" access policies for PAKO employees.</li>
                <li><strong>Vulnerability Testing:</strong> Regular "Pen-Tests" to identify and patch potential exploits.</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. DATA RETENTION
              </h2>
              <p>
                We retain your information for as long as your account is active or as required by South African law (e.g., 5 years for FICA records). Once the retention period expires, your data is deleted or de-identified so it can no longer be linked to you.
              </p>
            </section>

            {/* Your Legal Rights */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. YOUR LEGAL RIGHTS
              </h2>
              <p>Under POPIA, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>Access:</strong> Confirm if we hold your data and request a copy.</li>
                <li><strong>Correction:</strong> Update inaccurate or out-of-date information.</li>
                <li><strong>Objection:</strong> Object to processing for direct marketing.</li>
                <li><strong>Complaint:</strong> If you believe we have misused your data, you have the right to lodge a complaint with the Information Regulator (South Africa):
                  <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                    <li>Email: enquiries@inforegulator.org.za / PAIAComplaints@inforegulator.org.za</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* Contact Information Officer */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. CONTACT OUR INFORMATION OFFICER
              </h2>
              <p>
                Antheo Naidoo is the designated Information Officer for PAKO (Pty) Ltd.
              </p>
              <div className="mt-4">
                <p><strong>Email:</strong> hello@pako.co.za</p>
              </div>
            </section>

            {/* Compliance Notice */}
            <section className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                In Compliance with: Protection of Personal Information Act, No. 4 of 2013 ("POPIA")
              </p>
            </section>

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

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md relative z-10 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">© 2026 PAKO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}