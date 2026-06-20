"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#1e1e1e] px-10 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Your<span className="text-[#f5a623]">App</span>
        </Link>
        <Link href="/login" className="text-sm text-gray-400 hover:text-white">
          Sign in
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Data Controller</h2>
            <p className="text-sm">
              The data controller is YourApp. For any questions regarding the processing of your personal data, contact us at:{" "}
              <a href="mailto:contact@yourapp.com" className="text-[#f5a623] hover:underline">contact@yourapp.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Data We Collect</h2>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Account data: email, name, company name</li>
              <li>Usage data: actions performed within the app</li>
              <li>Technical data: IP address, browser type, session data</li>
              <li>Payment data: processed exclusively through Stripe — we do not store card data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Legal Basis (Art. 6 GDPR)</h2>
            <div className="space-y-3">
              {[
                { title: "Contract performance — Art. 6(1)(b)", desc: "Account, usage, and payment data necessary to provide the service." },
                { title: "Legitimate interest — Art. 6(1)(f)", desc: "Technical data for platform security and fraud prevention." },
                { title: "Consent — Art. 6(1)(a)", desc: "Marketing emails and newsletters. You can withdraw consent at any time from Settings." },
                { title: "Legal obligation — Art. 6(1)(c)", desc: "Financial data retained in accordance with applicable tax law." },
              ].map((item) => (
                <div key={item.title} className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-1">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How We Use Your Data</h2>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Providing and improving the service</li>
              <li>Account, trial, and subscription communications</li>
              <li>Payment processing via Stripe</li>
              <li>Sending informational emails (with your consent)</li>
              <li>Technical support</li>
              <li>Managing the referral program</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">We do not sell, rent, or share your data with third parties for commercial purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Storage & Security</h2>
            <p className="text-sm">
              Data is stored on Google Firebase (Firestore) on servers located in Europe (eur3 region). Data is protected by encryption in transit (TLS) and at rest (AES-256). Access is restricted through Firebase security rules — each user can only access their own data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Third-Party Services & International Transfers</h2>
            <p className="text-sm mb-3">We use the following sub-processors. Some may process data outside the EEA under Standard Contractual Clauses (Art. 46 GDPR):</p>
            <ul className="text-sm space-y-2 list-disc list-inside text-gray-400">
              <li><strong className="text-gray-300">Firebase / Google</strong> — authentication and database (EU servers, eur3)</li>
              <li><strong className="text-gray-300">Stripe</strong> — payment processing (USA, covered by SCC)</li>
              <li><strong className="text-gray-300">Vercel</strong> — app hosting (USA, covered by SCC)</li>
              <li><strong className="text-gray-300">Resend</strong> — transactional emails (USA, covered by SCC)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights (GDPR)</h2>
            <ul className="text-sm space-y-1 list-disc list-inside text-gray-400">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data ("right to be forgotten")</li>
              <li>Data portability (CSV/JSON format, on request)</li>
              <li>Objection to processing based on legitimate interest</li>
              <li>Withdrawal of consent at any time</li>
              <li>Restriction of processing in certain circumstances</li>
            </ul>
            <p className="text-sm mt-3 text-gray-400">
              To exercise these rights, contact us at{" "}
              <a href="mailto:contact@yourapp.com" className="text-[#f5a623] hover:underline">contact@yourapp.com</a>. We respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Supervisory Authority</h2>
            <p className="text-sm text-gray-400">
              If you believe your data is being processed unlawfully, you have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Cookies</h2>
            <p className="text-sm">
              We only use essential cookies for app functionality (authentication session). We do not use tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Data Retention</h2>
            <p className="text-sm">
              Your data is retained as long as you have an active account. Upon deletion, data is removed within 30 days, except data required by law (e.g. financial records — retained per applicable tax law, typically 5–10 years).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Policy Changes</h2>
            <p className="text-sm">
              If we make significant changes to this policy, we will notify you by email at least 14 days before they take effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contact</h2>
            <p className="text-sm">
              For any questions:{" "}
              <a href="mailto:contact@yourapp.com" className="text-[#f5a623] hover:underline">contact@yourapp.com</a>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#1e1e1e] py-6 px-10 flex items-center justify-between mt-10">
        <div className="text-sm font-semibold">Your<span className="text-[#f5a623]">App</span></div>
        <div className="flex gap-6 text-xs text-gray-600">
          <Link href="/terms" className="hover:text-gray-400">Terms</Link>
          <Link href="/privacy" className="text-gray-400">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}