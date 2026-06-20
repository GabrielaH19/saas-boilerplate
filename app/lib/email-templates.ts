const baseStyle = `
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
`;

const header = `
  <div style="background: #f97316; padding: 24px 32px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">YourApp</h1>
    <p style="color: #fed7aa; margin: 4px 0 0 0; font-size: 14px;">Your tagline here</p>
  </div>
`;

const footer = `
  <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 13px; margin: 0;">
      The YourApp Team · <a href="mailto:contact@yourapp.com" style="color: #f97316;">contact@yourapp.com</a>
    </p>
    <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
      © 2026 YourApp. All rights reserved.
    </p>
  </div>
`;

const ctaButton = (url: string, text: string) => `
  <div style="text-align: center; margin: 32px 0;">
    <a href="${url}" style="background: #f97316; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
      ${text}
    </a>
  </div>
`;

// 1. Welcome
export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to YourApp! 🎉',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Welcome to <strong>YourApp</strong> — your account is active and you have <strong>30 days free</strong> to explore all features.
          </p>
          <ul style="color: #374151; line-height: 2;">
            <li>✅ Feature one</li>
            <li>✅ Feature two</li>
            <li>✅ Feature three</li>
            <li>✅ Feature four</li>
          </ul>
          ${ctaButton('https://yourapp.com/dashboard', 'Go to dashboard →')}
          <p style="color: #6b7280; font-size: 14px;">Questions? Reply to this email or contact us at contact@yourapp.com.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 2. Trial expiring soon (day 27)
export function trialExpiringSoonEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Your free trial expires in 3 days',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your 30-day free trial <strong>expires in 3 days</strong>.
          </p>
          <p style="color: #374151; line-height: 1.6;">To continue without interruption, choose a plan:</p>
          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Basic — €9/month (founder price)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">Core features, 1 user</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Pro — €19/month (founder price)</p>
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">All features, up to 10 users</p>
            <p style="margin: 0 0 8px 0; color: #111827; font-weight: bold;">Premium — €39/month (founder price)</p>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">Unlimited users, all features, priority support</p>
          </div>
          ${ctaButton('https://yourapp.com/pricing', 'Choose your plan →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 3. Trial expired (day 31)
export function trialExpiredEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Your free trial has expired',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your 30-day free trial has expired. We hope YourApp has been useful!
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Activate a subscription now to continue using all features.
          </p>
          ${ctaButton('https://yourapp.com/pricing', 'Activate subscription →')}
          <p style="color: #6b7280; font-size: 14px;">Questions? Contact us at contact@yourapp.com.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 4. Payment success
export function paymentSuccessEmail(name: string, plan: string, amount: number): { subject: string; html: string } {
  return {
    subject: 'Payment confirmed — YourApp',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Thank you, ${name}! ✅</h2>
          <p style="color: #374151; line-height: 1.6;">Your payment has been processed successfully.</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #374151;"><strong>Plan:</strong> ${plan}</p>
            <p style="margin: 0; color: #374151;"><strong>Amount:</strong> €${amount}/month</p>
          </div>
          <p style="color: #374151; line-height: 1.6;">You now have full access to all features of your plan.</p>
          ${ctaButton('https://yourapp.com/dashboard', 'Go to dashboard →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 5. Payment failed
export function paymentFailedEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Payment issue — YourApp',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            We were unable to process your payment for your YourApp subscription.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Please update your payment method to avoid losing access.
          </p>
          ${ctaButton('https://yourapp.com/settings', 'Update payment →')}
          <p style="color: #6b7280; font-size: 14px;">Think this is an error? Contact us at contact@yourapp.com.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 6. Subscription cancelled
export function subscriptionCancelledEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Your subscription has been cancelled — YourApp',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            Your YourApp subscription has been cancelled. You'll keep access until the end of your paid period.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Sorry to see you go! If you'd like to tell us how we could improve, just reply to this email.
          </p>
          ${ctaButton('https://yourapp.com/pricing', 'Reactivate subscription →')}
        </div>
        ${footer}
      </div>
    `,
  };
}

// 7. Day 3 drip
export function day3Email(name: string): { subject: string; html: string } {
  return {
    subject: 'Have you tried the main feature yet? 🚀',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            It's been 3 days since you created your account. Have you had a chance to try the main feature?
          </p>
          <p style="color: #374151; line-height: 1.6;">
            It takes under 2 minutes and gives you instant results.
          </p>
          ${ctaButton('https://yourapp.com/new', 'Try it now →')}
          <p style="color: #6b7280; font-size: 14px;">Need help? Just reply to this email.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}

// 8. Day 7 drip
export function day7Email(name: string): { subject: string; html: string } {
  return {
    subject: 'How is YourApp working for you?',
    html: `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="color: #111827; margin-top: 0;">Hi, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            One week of YourApp! We hope it's been useful so far.
          </p>
          <p style="color: #374151; line-height: 1.6;">
            Have you discovered the <strong>[Feature Name]</strong> yet? It automatically shows you [what it does and why it's valuable].
          </p>
          ${ctaButton('https://yourapp.com/dashboard', 'Explore the feature →')}
          <p style="color: #6b7280; font-size: 14px;">Questions or feedback? Reply to this email anytime.</p>
        </div>
        ${footer}
      </div>
    `,
  };
}