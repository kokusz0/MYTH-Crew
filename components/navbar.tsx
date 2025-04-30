"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="w-full bg-background shadow-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-blue-400 font-bold text-2xl">
          MYTH Crew
        </Link>
        <nav className="flex space-x-6">
          <Link
            href="/application"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname === "/application" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            Application
          </Link>
          <Link
            href="/feedback"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname === "/feedback" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            Feedback
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
              pathname === "/about" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            About Us
          </Link>
        </nav>
      </div>
    </header>
  )
}
