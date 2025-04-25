import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anonymous Chat Room",
  description: "Connect with strangers. No login needed.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} light`} style={{ colorScheme: "light" }}>
        {children}
      </body>
    </html>
  )
}
