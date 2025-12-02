# GoodChat 💬 - Next.js Chat Application

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Website](https://img.shields.io/badge/website-goodchat.ir-brightgreen)](https://goodchat.ir)
[![GitHub stars](https://img.shields.io/github/stars/Arashmgbrj/GoodChat)](https://github.com/Arashmgbrj/GoodChat/stargazers)

یک پلتفرم چت آنلاین مدرن و سریع ساخته شده با **Next.js 14** که تجربه‌ای بهینه‌شده از ارتباط متنی را ارائه می‌دهد.

🌐 **وبسایت زنده:** [https://goodchat.ir](https://goodchat.ir)

![GoodChat Preview](https://raw.githubusercontent.com/Arashmgbrj/GoodChat/master/public/screenshot.png) <!-- اگر اسکرین شات دارید اضافه کنید -->

---

## ✨ ویژگی‌های کلیدی

*   **Next.js 14 با App Router:** استفاده از آخرین معماری Next.js برای بهترین عملکرد
*   **رابط کاربری واکنش‌گرا:** طراحی مدرن با Tailwind CSS (فرض) سازگار با تمام دستگاه‌ها
*   **ارسال پیام فوری:** ارتباط بلادرنگ با **Socket.io** یا **Server-Sent Events (SSE)**
*   **SSR/SSG پشتیبانی شده:** رندر سمت سرور برای SEO و عملکرد بهتر
*   **Route Handlers:** API endpoints داخلی برای مدیریت منطق سرور
*   **مدیریت وضعیت:** استفاده از Context API یا Zustand برای state management
*   **اتاق‌های چت پویا:** ایجاد و پیوستن به اتاق‌های گفتگو
*   **پروفایل کاربری:** شخصی‌سازی نام و آواتار کاربر
*   **نشان‌های وضعیت:** نمایش وضعیت "در حال تایپ کردن..." کاربران

---

## 🚀 شروع سریع

### پیش‌نیازها

*   [Node.js](https://nodejs.org/) (نسخه 18.17 یا بالاتر)
*   [npm](https://www.npmjs.com/)، [yarn](https://yarnpkg.com/) یا [pnpm](https://pnpm.io/)

### نصب و اجرای محلی

1.  **ریپازیتوری را کلون کنید:**
    ```bash
    git clone https://github.com/Arashmgbrj/GoodChat.git
    cd GoodChat
    ```

2.  **دependencies را نصب کنید:**
    ```bash
    npm install
    # یا
    yarn install
    # یا
    pnpm install
    ```

3.  **متغیرهای محیطی را تنظیم کنید:**
    ```bash
    cp .env.example .env.local
    ```
    سپس فایل `.env.local` را با مقادیر مناسب پر کنید.

4.  **سرور توسعه را راه‌اندازی کنید:**
    ```bash
    npm run dev
    # یا
    yarn dev
    # یا
    pnpm dev
    ```

5.  **برنامه آماده است!**
    مرورگر خود را باز کرده و به آدرس [http://localhost:3000](http://localhost:3000) بروید.


    
---

## 🛠️ فناوری‌های استفاده شده

### Frontend
- **Next.js 14** - فریمورک React با قابلیت‌های پیشرفته
- **React 18** - کتابخانه اصلی UI
- **TypeScript** - تایپ‌ایمنی بهتر
- **Tailwind CSS** - فریمورک utility-first CSS (فرض)
- **Socket.io Client** - برای ارتباط real-time

### Backend (درون Next.js)
- **Next.js Route Handlers** - API endpoints
- **Socket.io Server** - ارتباط بلادرنگ
- **NextAuth.js** - احراز هویت (اگر استفاده می‌کنید)

### Development Tools
- **ESLint** - تحلیل کد
- **Prettier** - فرمت‌دهی کد
- **Husky** - Git hooks

---


GoodChat/
├── app/ # دایرکتوری اصلی App Router
│ ├── (auth)/ # گروه‌بندی route برای صفحات احراز هویت
│ ├── (chat)/ # گروه‌بندی route برای بخش چت
│ ├── api/ # Route handlers (API endpoints)
│ │ ├── auth/ # endpoints احراز هویت
│ │ ├── socket/ # endpoints سوکت
│ │ └── ...
│ ├── layout.tsx # layout اصلی
│ ├── page.tsx # صفحه اصلی
│ └── globals.css # استایل‌های سراسری
├── components/ # کامپوننت‌های قابل استفاده مجدد
│ ├── ui/ # کامپوننت‌های پایه UI
│ ├── chat/ # کامپوننت‌های مخصوص چت
│ └── layout/ # کامپوننت‌های layout
├── lib/ # utilities و helper functions
│ ├── socket.ts # کانفیگ سوکت
│ ├── utils.ts # توابع کمکی
│ └── ...
├── public/ # فایل‌های استاتیک
├── types/ # TypeScript type definitions
├── .env.example # نمونه فایل environment variables
├── next.config.js # کانفیگ Next.js
├── package.json
└── README.md
## 📦 استقرار (Deployment)

این پروژه را می‌توانید روی پلتفرم‌های مختلف مستقر کنید:

### استقرار روی Vercel (توصیه شده)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FArashmgbrj%2FGoodChat)

1.  پروژه را به حساب Vercel خود import کنید
2.  متغیرهای محیطی را تنظیم کنید
3.  Deploy!

### استقرار روی پلتفرم‌های دیگر
- **Netlify:** با استفاده از `@netlify/plugin-nextjs`
- **Railway:** مناسب برای پروژه‌های full-stack
- **Docker:** اگر Dockerfile دارید

---

## 🔧 کانفیگ‌های مهم

### فایل `.env.local`
```env
# کلیدهای API و تنظیمات دیتابیس
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000

# تنظیمات احراز هویت (اگر دارید)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# سایر تنظیمات...

---

## 🏗️ ساختار پروژه
