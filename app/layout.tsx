import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Logo } from '@/components/logo'
import { ToastProvider } from '@/components/providers/toaster-provider'
import { ConfettiProvider } from '@/components/providers/confetti-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'PLM - Learning Platform',
  description: 'Learn and manage video & PDF courses online',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <ClerkProvider proxyUrl="/__clerk">
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}