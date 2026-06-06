import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ThemeProvider from '@/components/providers/ThemeProvider'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'MetaVision — AI Software for Healthcare & Finance',
  description:
    'Premium AI-powered software for doctors and chartered accountants. Real-time consultations, intelligent prescriptions, and automated accounting workflows.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} light`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Apply saved theme before first paint to prevent flash of wrong theme */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('mv-theme');if(t==='dark')document.documentElement.classList.remove('light')}catch(e){}})();`}
        </Script>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
