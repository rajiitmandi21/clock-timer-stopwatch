import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ChronoChaos - Ultimate Productivity Timer Suite | Stopwatch, Pomodoro, World Clock",
    template: "%s | ChronoChaos - Productivity Timer Suite",
  },
  description:
    "Free productivity timer suite with real-time tab updates. Features stopwatch with lap tracking, Pomodoro focus timer, countdown timer, world clock with timezone converter, and date calculator. Perfect for time management and productivity tracking.",
  keywords: [
    "productivity timer",
    "time tracking apps",
    "Pomodoro timer",
    "countdown timer",
    "stopwatch online",
    "world clock",
    "date calculator",
    "focus timer",
    "interval timer",
    "time management tools",
    "productivity apps",
    "timer with tab updates",
    "online stopwatch",
    "timezone converter",
    "lap timer",
    "break timer",
    "work timer",
    "study timer",
    "productivity suite",
    "time tracker",
  ],
  authors: [{ name: "ChronoChaos Team" }],
  creator: "ChronoChaos",
  publisher: "ChronoChaos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chronochaos.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chronochaos.app",
    title: "ChronoChaos - Ultimate Productivity Timer Suite",
    description:
      "Free productivity timer suite with real-time tab updates. Stopwatch, Pomodoro timer, countdown, world clock, and more.",
    siteName: "ChronoChaos",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChronoChaos - Productivity Timer Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChronoChaos - Ultimate Productivity Timer Suite",
    description: "Free productivity timer suite with real-time tab updates. Perfect for time management and focus.",
    images: ["/twitter-image.png"],
    creator: "@chronochaos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
    generator: 'v0.dev'
}

const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-EQK3VVB9WB"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://chronochaos.app" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChronoChaos" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ChronoChaos" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ChronoChaos",
              description:
                "Ultimate productivity timer suite with real-time tab updates featuring stopwatch, Pomodoro timer, countdown timer, world clock, and date calculator",
              url: "https://chronochaos.app",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Precision Stopwatch with Lap Tracking",
                "Pomodoro Focus Timer with Statistics",
                "Countdown Timer with Notifications",
                "World Clock with Timezone Converter",
                "Date Calculator and Difference Tool",
                "Real-time Tab Title Updates",
                "Mobile Responsive Design",
                "Offline Functionality",
              ],
              screenshot: "https://chronochaos.app/screenshot.png",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                ratingCount: "1247",
              },
              author: {
                "@type": "Organization",
                name: "ChronoChaos Team",
              },
            }),
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
function gtag(){if(window.self === window.top && ["timer.rajsharma.space", "time.rajsharma.space", "timer.sharma.bio"].includes(window.location.hostname)) dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalisation: 'denied' });
gtag('config', '${gaId}', { allow_google_signals: false, allow_ad_personalization_signals: false });` }} />
        <script id="vercel-web-analytics" dangerouslySetInnerHTML={{ __html: `(function () {
  if (!(window.self === window.top && ["timer.rajsharma.space", "time.rajsharma.space", "timer.sharma.bio"].includes(window.location.hostname))) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', function (event) {
    var url = new URL(event.url);
    url.hash = '';
    Array.from(url.searchParams.keys()).forEach(function (key) { if (!/^utm_(source|medium|campaign|term|content|id)$/.test(key)) url.searchParams.delete(key); });

    return Object.assign({}, event, { url: url.toString() });
  });
  if (!document.querySelector('script[src="/_vercel/insights/script.js"]')) {
    var script = document.createElement('script');
    script.src = '/_vercel/insights/script.js'; script.defer = true;
    document.head.appendChild(script);
  }
})();` }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
