import type { Metadata } from 'next'
import { Sora, Plus_Jakarta_Sans, Inter } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ThemeProvider from '@/components/providers/ThemeProvider'
import SmoothScroll from '@/components/providers/SmoothScroll'
import ChunkErrorRecovery from '@/components/providers/ChunkErrorRecovery'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MetaVision — AI Software for Healthcare & Finance',
  description:
    'Premium AI-powered software for doctors and chartered accountants. Real-time consultations, intelligent prescriptions, and automated accounting workflows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable} ${inter.variable} light`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable}`}>
        {/* Apply saved theme before first paint to prevent flash of wrong theme */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('mv-theme');if(t==='dark')document.documentElement.classList.remove('light')}catch(e){}})();`}
        </Script>
        <ChunkErrorRecovery />
        <ThemeProvider>
          <SmoothScroll>
            <Header />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
