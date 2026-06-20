"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Your<span className="text-[#f5a623]">App</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white">Sign in</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">Terms and Conditions</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm">By accessing and using YourApp, you agree to these terms and conditions. If you do not agree, please do not use the service. Continued use after updates constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Description of Service</h2>
            <p className="text-sm">YourApp is a SaaS platform that provides [describe your service here]. All calculations and estimates are indicative — see section 8.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. User Account</h2>
            <p className="text-sm mb-2">To use YourApp you must create an account with a valid email. You are responsible for:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying us of any unauthorized use</li>
              <li>The accuracy of data entered into the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Plans, Payments & Subscriptions</h2>
            <p className="text-sm mb-2">YourApp offers monthly subscription plans. Current prices are displayed on the pricing page. All plans include a 30-day free trial.</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Payments are processed monthly via Stripe</li>
              <li>Subscriptions renew automatically every 30 days</li>
              <li>You can cancel anytime from Settings → Subscription, with no penalties</li>
              <li>Upon cancellation, access remains active until the end of the paid period</li>
              <li>No refunds are offered for periods already paid</li>
              <li>Prices may change with 30 days advance notice by email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Free Trial</h2>
            <p className="text-sm">Upon registration you receive free access to the Premium plan for 30 days, without entering card details. After expiry, access to premium features is suspended. No charges are made automatically without your explicit consent.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Referral Program</h2>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Reward: €10 per confirmed referral</li>
              <li>Limit: maximum 4 rewarded referrals per calendar month</li>
              <li>Credit is granted after the referred user's first payment</li>
              <li>Fraudulent referrals (fake accounts, self-referral) result in account suspension</li>
              <li>We reserve the right to modify or end the referral program at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Acceptable Use</h2>
            <p className="text-sm mb-2">You may not use YourApp for:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Illegal or fraudulent activities</li>
              <li>Unauthorized access attempts to our systems</li>
              <li>Reselling or redistributing the service without written consent</li>
              <li>Reverse engineering or decompiling the platform</li>
              <li>Intentionally entering false data to manipulate results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Estimative Nature of Calculations</h2>
            <div className="bg-[#1a1400] border border-[#f5a62330] rounded-lg p-4">
              <p className="text-sm text-gray-300">YourApp provides calculation and estimation tools for guidance purposes only. All results are based solely on data entered by the user and do not constitute financial, tax, or legal advice. The user is solely responsible for business decisions made based on platform data. YourApp cannot be held liable for losses resulting from decisions based on platform calculations.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Intellectual Property</h2>
            <p className="text-sm">All elements of YourApp — code, design, content, algorithms, trademarks — are the exclusive property of YourApp. You may not copy, modify, distribute, or commercially use any element without explicit written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Service Availability</h2>
            <p className="text-sm">We strive to maintain the platform available 24/7 but do not guarantee uninterrupted availability. We reserve the right to perform maintenance and updates that may cause temporary interruptions.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Limitation of Liability</h2>
            <p className="text-sm">To the extent permitted by law, YourApp's total liability for direct damages shall not exceed the amount paid by you in the last 3 calendar months. YourApp is not liable for indirect damages, loss of profit, data loss, or business interruption.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Force Majeure</h2>
            <p className="text-sm">YourApp is not liable for failure to fulfill obligations caused by events beyond its reasonable control, including third-party infrastructure failures, natural disasters, cyberattacks, or legislative changes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">13. Changes to Terms</h2>
            <p className="text-sm">We reserve the right to modify these terms at any time. You will be notified by email at least 14 days before significant changes take effect.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">14. Severability</h2>
            <p className="text-sm">If any provision of these terms is found invalid or unenforceable, the remaining provisions remain in full force and effect.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">15. Governing Law</h2>
            <p className="text-sm">These terms are governed by applicable law. Any disputes that cannot be resolved amicably will be submitted to the competent courts.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">16. Contact</h2>
            <p className="text-sm">
              For any questions regarding these terms:{" "}
              <a href="mailto:contact@yourapp.com" className="text-[#f5a623] hover:underline">contact@yourapp.com</a>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between mt-10">
        <div className="text-sm font-semibold">Your<span className="text-[#f5a623]">App</span></div>
        <div className="flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="text-gray-400">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}