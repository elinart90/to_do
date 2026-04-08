import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Power OS — Your Millionaire Command Center',
  description: 'The most powerful personal operating system for driven achievers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0f] text-[#f0f0ff] antialiased">
        {children}
      </body>
    </html>
  )
}
