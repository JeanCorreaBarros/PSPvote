import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import { ColorThemeProvider } from '@/components/color-theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PSPVote - Sistema de Votaciones',
  description: 'Sistema de gestión y registro de votaciones',
  generator: 'Jean Carlo Correa Barros',
  authors: [{ name: 'Jean Carlo Correa Barros', url: 'https://jeancorrea.dev' }],
  keywords: ['votaciones', 'sistema de votación', 'registro de votos', 'gestión electoral', 'PSPVote'],
  icons: {
    icon: [
      {
        url: '/PSPvote.ico',
        sizes: 'any',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/PSPvote.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/PSPvote.png',
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
        <link rel="icon" href="/PSPvote.ico" sizes="any" />
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
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <Analytics />
      </body>
    </html>
  )
}

