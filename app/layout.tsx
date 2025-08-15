import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BlurGradientBackground } from "@/components/ui/BlurGradientBackground";
import { Toaster } from "@/components/ui/toaster"
import { GlobalSearch } from "@/components/global-search"
import { KbdShortcut } from "@/components/kbd-shortcut"

export const metadata: Metadata = {
  title: "QTools AI: Your All-in-One AI-Powered Toolkit",
  description: "Explore dozens of powerful AI tools, handy utilities, and fun games. Generate content, summarize text, convert units, and play classic games like Tic-Tac-Toe and Snake, all in one place without needing to sign up.",
  keywords: ["AI tools", "utilities", "productivity", "creative tools", "games", "text summarizer", "password generator", "currency converter", "code explainer"],
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optimized Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Michroma&family=Rowdies:wght@300;400;700&display=swap" rel="stylesheet" />

        {/* Favicons and Mobile Optimization */}
        <link rel="icon" href="/LOGO1.png" type="image/png" sizes="512*512" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href="https://www.qtoolsai.store/" />

        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content="QTools AI: Your All-in-One AI-Powered Toolkit" />
        <meta property="og:description" content="Access dozens of intelligent AI tools, utilities, and games to boost your productivity and creativity, all in one place. No sign-up required." />
        <meta property="og:image" content="https://www.qtoolsai.store/LOGO1.png" />
        <meta property="og:url" content="https://www.qtoolsai.store/" />
        <meta property="og:type" content="website" />
        
        {/* Schema.org Metadata */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "QTools AI",
          "url": "https://www.qtoolsai.store/",
          "logo": "https://www.qtoolsai.store/LOGO1.png",
          "sameAs": [
            "https://github.com/chakraborty-sayantan",
            "https://www.linkedin.com/in/sayantan-c12/"
          ]
        }`}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "QTools AI",
          "url": "https://www.qtoolsai.store/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.qtoolsai.store//dashboard?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }`}} />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BlurGradientBackground />
          <KbdShortcut />
          <div className="relative z-10">{children}</div>
          <Toaster />
          <GlobalSearch />
        </ThemeProvider>
      </body>
    </html>
  )
}