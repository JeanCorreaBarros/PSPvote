import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ColorThemeProvider } from '@/components/color-theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PSPVote - Sistema de Votaciones',
  description: 'Sistema de gestión y registro de votaciones',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme-dark-mode') === 'true') {
                  document.documentElement.classList.add('dark');
                  document.body.style.backgroundColor = '#09090b';
                  document.body.style.color = '#fafafa';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.body.style.backgroundColor = '#ffffff';
                  document.body.style.color = '#000000';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased transition-colors duration-300`}>
        <ColorThemeProvider>
          {children}
        </ColorThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

