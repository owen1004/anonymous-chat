import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import PathnameProvider from "@/components/providers/PathnameProvider"

const inter = Inter({ subsets: ["latin"] })

const publicPaths = ["/", "/about", "/contact"]

export const metadata: Metadata = {
  title: "匿名聊天室",
  description: "一個安全的匿名聊天空間",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} light`} style={{ colorScheme: "light" }}>
        <AuthProvider>
          <PathnameProvider>
            <div className="min-h-screen bg-[#F8EFE3]">
              {children}
            </div>
          </PathnameProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
