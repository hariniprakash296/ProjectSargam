import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sargam - Carnatic Music Transcriber",
  description: "Transcribe Carnatic and Hindustani music to swaram notation with raaga recognition",
}

/**
 * Root layout component
 * Wraps the entire application with providers and global styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Toast notifications for user feedback */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
            },
            success: {
              iconTheme: {
                primary: '#f97316', // Orange primary color
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}

