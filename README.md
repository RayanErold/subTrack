# 💰 SubTrack: Subscription Optimizer

![SubTrack Hero Banner](./assets/images/hero_banner.png)

> **Regain control of your financial destiny.** A premium, glassmorphic subscription tracker built with React Native, Supabase, and Stripe.

---

## 🚀 The Vision
In an era of "subscription fatigue," many people silently lose thousands of dollars each year to forgotten free trials and recurring charges. **SubTrack** is designed to provide a holistic, beautiful, and proactive view of your financial commitments. 

Built with a **violet-indigo glassmorphism** aesthetic, it doesn't just track your money—it makes managing it a premium experience.

---

## ✨ Key Features

### 💎 Premium Experience
- **🌑 Glassmorphism UI**: A sleek, modern interface designed for the "dark mode" generation.
- **⚡ Optimistic Updates**: Instant UI feedback when adding/editing subscriptions using Zustand and Supabase.
- **📱 Cross-Platform**: Seamlessly runs on **iOS**, **Android**, and **Web**.

### 🛠 Smart Tracking
- **📊 Real-time Dashboard**: Compare **Active Monthly Spend** vs. **Trial Risk** at a glance.
- **🔔 Proactive Reminders**: Get notified 24 hours before a trial expires.
- **🔍 Instant Search & Filter**: Find any subscription in milliseconds.
- **📅 Calendar Sync**: Sync renewal dates directly to **Google Calendar** (Pro feature).

### ☁️ Enterprise-Grade Backend
- **☁️ Supabase Integration**: Real-time cloud synchronization for your data.
- **🔐 Secure Auth**: Robust email-based authentication system.
- **💳 Payments (Stripe)**: Integrated demo payment flow for premium upgrades.
- **📧 Email (Resend)**: Automated notifications via Supabase Edge Functions.

---

## 🛠 Tech Stack

SubTrack is built using a modern, industry-standard stack for high-performance mobile and web experiences:

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) | Cross-platform mobile & web development |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) | Type-safe, file-based routing |
| **Backend** | [Supabase](https://supabase.com/) | Real-time DB, Auth, and Edge Functions |
| **State** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, performant state management |
| **Payments** | [Stripe](https://stripe.com/) | Secure payment processing and premium upgrades |
| **Email** | [Resend](https://resend.com/) | Transactional email delivery |
| **Date Logic** | [date-fns](https://date-fns.org/) | Precision renewal and trial calculations |

---

## 🏗 Modular Architecture

The project follows a scalable, modular folder structure designed for growth:

```text
├── app/                  # File-based routing (Expo Router)
├── components/           # UI Components
│   ├── landing/          # Modular landing page sections
│   ├── settings/         # Dedicated settings components
│   └── ui/               # Core atomic UI elements
├── hooks/                # Custom React hooks (e.g., useTheme)
├── store/                # Global state management (Zustand)
├── types/                # Centralized TypeScript interfaces
├── utils/                # Supabase & Payment utility functions
└── constants/            # Theme tokens & Colors
```

---

## 🏃‍♂️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/client) (for mobile testing)
- A [Supabase](https://supabase.com/) Account

### 2. Installation
```bash
# Clone the repo
git clone https://github.com/RayanErold/subTrack.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

### 4. Launch
```bash
npm run dev   # Start development server
npm run web   # Open in browser
```

---

## 📦 Deployment
- **Web**: Optimized for Netlify/Vercel (see `DEPLOY.md`).
- **Mobile**: Ready for `eas build` to generate `.ipa` or `.apk` files.

---

## 🎨 Design Credits
Assets and UI tokens inspired by modern fintech aesthetics. Icons powered by **Ionicons**.

---
<p align="center">Made with ❤️ for the Million Dollar App Idea Series</p>