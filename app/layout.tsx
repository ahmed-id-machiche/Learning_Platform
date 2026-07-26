import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Logo } from '@/components/logo'
import { ToastProvider } from '@/components/providers/toaster-provider'
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <ClerkProvider>
          <ToastProvider />
          <header className="flex justify-between items-center px-6 h-16 border-b border-gray-200 bg-white sticky top-0 z-50">
            <Logo />
            <div className="flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}