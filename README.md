# Next.js SaaS Boilerplate

A production-ready SaaS starter kit built with Next.js, Firebase, Stripe, and Resend. Built and battle-tested on a real SaaS product.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database & Auth**: Firebase (Firestore + Authentication)
- **Payments**: Stripe (subscriptions, billing portal, webhooks)
- **Email**: Resend (transactional emails, drip sequences)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## What's Included

- ✅ Authentication (login, register, forgot password, reset password)
- ✅ Stripe subscriptions (Basic / Pro / Premium)
- ✅ Founder pricing with live counter
- ✅ 30-day free trial logic
- ✅ Billing portal (manage/cancel subscription)
- ✅ Onboarding wizard
- ✅ Dashboard with plan-based access control
- ✅ Referral system (€10/referral)
- ✅ Email sequences (welcome, drip) via Resend
- ✅ GDPR-compliant pages (Privacy, Terms)
- ✅ Cookie consent banner
- ✅ PWA support (manifest + service worker)
- ✅ Vercel Analytics

## Getting Started

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root with the following:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_BASIC_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_PREMIUM_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_cron_secret
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Customization

- Replace `YourApp` with your brand name across the codebase
- Update `contact@yourapp.com` with your email
- Update pricing plans in `pricing/page.tsx` and `lib/planLimits.ts`
- Add your Firestore collections to `firestore.rules`
- Update the landing page copy in `app/page.tsx`

## Deployment

Deploy instantly on [Vercel](https://vercel.com). Add your environment variables in the Vercel dashboard.

## License

MIT — use it for any project, commercial or personal.