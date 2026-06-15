import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import pakoLogoWatermark from 'figma:asset/801b48dfe9d59c06d3fbcf335528d783ab88ec14.png';
import { useUser } from '@/app/contexts/UserContext';

export function TermsOfService() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent pb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
            Document Version: 1.2.0-BETA<br />
            Effective Date: January 17, 2026<br />
            Jurisdiction: Republic of South Africa
          </p>

          <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            {/* Preamble and Definitions */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. PREAMBLE AND DEFINITIONS
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                1.1. The Agreement
              </h3>
              <p>
                This Master Beta Testing & Services Agreement ("Agreement") is a legally binding contract between PAKO (Pty) Ltd (hereinafter "the Company," "PAKO," "we," "us," or "our") and the individual or legal entity accessing the platform (hereinafter "the User," "Tester," or "you").
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                1.2. Acceptance
              </h3>
              <p>
                By clicking "I Accept," registering an account, or accessing the PAKO mobile application or web portal, you acknowledge that you have read, understood, and voluntarily agree to be bound by every provision of this Agreement.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                1.3. Definitions
              </h3>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li><strong>"App" or "Platform":</strong> Refers to the PAKO mobile application, website, and all associated AI models, APIs, and backend systems.</li>
                <li><strong>"Beta Version":</strong> Refers to the pre-release, experimental version of the software which is currently undergoing testing and has not been made generally available to the public.</li>
                <li><strong>"Confidential Information":</strong> Includes, but is not limited to, the App's source code, algorithms, UI/UX design, business logic, marketing plans, and any "bugs" or "errors" discovered during testing.</li>
                <li><strong>"Insights":</strong> Refers to any AI-generated data, budget suggestions, cash-flow forecasts, or financial "nudges" provided by the Platform.</li>
              </ul>
            </section>

            {/* Eligibility and Enrollment */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. ELIGIBILITY AND ENROLLMENT
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                2.1. Strict Legal Capacity
              </h3>
              <p>
                You warrant that you are at least 18 (eighteen) years of age and have the full legal capacity to enter into binding contracts in the Republic of South Africa.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                2.2. Residency Requirement
              </h3>
              <p>
                Access is limited to permanent residents or legal inhabitants of South Africa. Use of the Platform via VPN to circumvent geographical restrictions is strictly prohibited.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                2.3. Exclusion of Competitors
              </h3>
              <p>
                You warrant that you are not currently employed by, a consultant for, or an owner of any company that provides competing financial technology, personal finance management, or AI-driven banking services. Entry under false pretenses constitutes a material breach of contract and theft of trade secrets.
              </p>
            </section>

            {/* Account Registration and Security */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. ACCOUNT REGISTRATION AND SECURITY OBLIGATIONS
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                3.1. Verification of Data
              </h3>
              <p>
                You must provide information that is true, accurate, and verifiable. The Company reserves the right to request proof of identity (SA ID or Passport) to maintain the security of the Beta environment.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                3.2. Credential Integrity
              </h3>
              <p>
                You are the sole custodian of your login credentials. You are strictly prohibited from sharing your account with third parties. Any action taken via your account is legally attributed to you.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                3.3. Security Breach Protocol
              </h3>
              <p>
                You must notify PAKO via hello@pako.co.za within 60 (sixty) minutes of any suspected unauthorized access. Failure to do so waives any claim of liability against the Company for resulting data loss.
              </p>
            </section>

            {/* The Beta License */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. THE BETA LICENSE: SCOPE AND LIMITATIONS
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                4.1. Grant of License
              </h3>
              <p>
                The Company grants you a limited, non-exclusive, non-transferable, non-sublicensable, and fully revocable license to use the Beta Version.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                4.2. Purpose of License
              </h3>
              <p>
                This license is granted solely for the purpose of evaluation and providing feedback. Any use for commercial gain or competitive analysis is a violation of this Agreement.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                4.3. Ownership of Feedback
              </h3>
              <p>
                You agree that any "Feedback" (suggestions, bug reports, or feature requests) provided by you becomes the exclusive property of PAKO (Pty) Ltd upon submission. You hereby irrevocably assign all intellectual property rights in such Feedback to the Company, without the right to compensation or royalties.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. PROHIBITED ACTIVITIES AND "ANTI-LOOPHOLE" CLAUSE
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                5.1. Technical Restrictions
              </h3>
              <p>You shall not, and shall not attempt to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Reverse-engineer, decompile, or disassemble the App's binary or AI logic;</li>
                <li>Use "crawlers," "spiders," or automated scripts to scrape data from the App;</li>
                <li>Conduct "stress tests" or "penetration tests" without prior written authorization.</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                5.2. Conduct Restrictions
              </h3>
              <p>You shall not use the App to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Facilitate money laundering, terrorist financing, or any activity prohibited by the FIC Act;</li>
                <li>Upload "deepfakes," malware, or any content that infringes on third-party rights.</li>
              </ul>
            </section>

            {/* Financial Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. FINANCIAL INFORMATION AND THE "NO-ADVICE" SHIELD
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                6.1. Educational Only
              </h3>
              <p>
                The App provides AI-driven financial insights. You acknowledge that these are for educational and illustrative purposes only.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                6.2. Non-Reliance
              </h3>
              <p>
                No information provided by the App constitutes financial, investment, legal, or tax advice. PAKO is not a Registered Financial Services Provider (FSP) under the FAIS Act.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                6.3. AI Error Margin
              </h3>
              <p>
                You acknowledge that AI models can produce inaccurate or "fictitious" data (hallucinations). You must verify all insights against your official bank statements. Reliance on App data for financial decisions is done at your own peril.
              </p>
            </section>

            {/* Accuracy of Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. ACCURACY OF INFORMATION AND THIRD-PARTY DATA
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                7.1. Upstream Data
              </h3>
              <p>
                PAKO relies on third-party aggregators and your own bank's API to retrieve data. We do not warrant the accuracy of the data provided by these third parties.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                7.2. Latency
              </h3>
              <p>
                You acknowledge that data syncs may be delayed and that the "real-time" nature of the App is subject to internet connectivity and bank server availability.
              </p>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. DATA PROTECTION AND PRIVACY (POPIA COMPLIANCE)
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                8.1. Informed Consent
              </h3>
              <p>
                In accordance with the Protection of Personal Information Act (POPIA), you provide express, voluntary consent for the processing of your:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-4">
                <li>Personal Identifiers (Name, Email, Contact);</li>
                <li>Financial Identifiers (Transaction history, bank balances, spending patterns);</li>
                <li>Technical Identifiers (IP address, location data, device type).</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                8.2. Storage and Security
              </h3>
              <p>
                Your data is stored using bank-level encryption (TBD). You acknowledge that while we take "reasonable and appropriate" steps, no beta software is immune to cyber-attacks.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                8.3. Data Deletion
              </h3>
              <p>
                Upon termination of the Beta, you may request the deletion of your personal data, subject to the Company's legal data retention obligations under South African tax and AML laws.
              </p>
            </section>

            {/* Points and Rewards */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                9. POINTS, REWARDS, AND THE LOYALTY PROGRAM
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                9.1. Experimental Tokens
              </h3>
              <p>
                Any points, badges, or rewards earned during the Beta are "Experimental Tokens" and hold no cash value.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                9.2. No Proprietary Right
              </h3>
              <p>
                You have no ownership right to points. The Company reserves the unilateral right to "wipe," reset, or modify the rewards program at any time without prior notice or compensation.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                10. INTELLECTUAL PROPERTY RIGHTS
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                10.1. Exclusive Ownership
              </h3>
              <p>
                All rights, title, and interest in and to the App (including code, design, logos, and "PAKO" trademark) are the sole property of PAKO (Pty) Ltd.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                10.2. No Transfer
              </h3>
              <p>
                Nothing in this Agreement shall be construed as a transfer of IP to the User.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                11. TERMINATION AND SUSPENSION
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                11.1. Termination at Will
              </h3>
              <p>
                Either party may terminate this Agreement at any time via written notice or by deleting the App.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                11.2. Breach Termination
              </h3>
              <p>
                PAKO reserves the right to instantly terminate access if we suspect a breach of Section 5 (Prohibited Activities) or Section 12 (Confidentiality).
              </p>
            </section>

            {/* Confidentiality */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                12. CONFIDENTIALITY AND NON-DISCLOSURE (NDA)
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                12.1. The Core Secret
              </h3>
              <p>
                The Beta Version is the "Trade Secret" of PAKO.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                12.2. Prohibition on Disclosure
              </h3>
              <p>
                You shall not share, publish, or discuss any unreleased features, screenshots, or "bugs" with any third party, including social media platforms, without express written consent. A breach of this section entitles PAKO to seek an urgent interdict and damages.
              </p>
            </section>

            {/* Disclaimer and Limitation */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                13. DISCLAIMER AND LIMITATION OF LIABILITY
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                13.1. "As-Is" Warranty
              </h3>
              <p>
                The App is provided "AS IS" and "AS AVAILABLE". We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                13.2. Liability Cap
              </h3>
              <p>
                To the maximum extent permitted by the Consumer Protection Act (CPA), the Company's total liability for any claim shall not exceed R100.00 (One Hundred Rand).
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                14. GOVERNING LAW AND DISPUTE RESOLUTION
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                14.1. South African Law
              </h3>
              <p>
                This Agreement is governed by the laws of the Republic of South Africa.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                14.2. Arbitration Clause
              </h3>
              <p>
                Any dispute arising from this Agreement shall be referred to private, confidential arbitration under the rules of the Arbitration Foundation of Southern Africa (AFSA) in Johannesburg. This ensures that any "Beta bugs" revealed during a dispute remain confidential.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                15. CHANGES TO THESE TERMS
              </h2>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                15.1. Right to Amend
              </h3>
              <p>
                We may update these Terms as the App evolves.
              </p>

              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6">
                15.2. Continued Use
              </h3>
              <p>
                Your continued use of the App following a notification of changes constitutes your unconditional acceptance of the revised Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                16. CONTACT US
              </h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <p className="font-semibold">PAKO Financial Wellness</p>
                <p className="mt-2">Email: legal@pako.co.za</p>
                <p>Support: hello@pako.co.za</p>
                <p className="mt-2">
                  Or visit our{' '}
                  <Link 
                    to="/contact" 
                    state={{ 
                      from: fromSignup ? 'signup' : undefined,
                      returnToStep: fromSignup ? 3 : undefined
                    }}
                    className="text-primary hover:underline"
                  >
                    Contact Support
                  </Link>{' '}
                  page
                </p>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-8">
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                By using PAKO, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms of Service. If you do not agree to these Terms, please do not use our Service.
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
    </div>
  );
}