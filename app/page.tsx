"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <main
      className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!backgroundImage && <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-black -z-10"></div>}

      <div className="absolute top-4 right-4">
        <Button onClick={triggerFileInput} variant="outline" className="flex items-center gap-2">
          <Upload size={16} />
          Upload Background
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>

      <div className="text-center max-w-3xl mx-auto bg-black/80 p-8 rounded-lg backdrop-blur-sm border border-blue-900">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">Welcome to MYTH</h1>
        <p className="text-lg mb-8 text-gray-300">Join our elite crew in CnR and become part of something legendary.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/application">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Join Us Now</Button>
          </Link>
          <Link href="/feedback">
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950 px-6 py-2">
              Send Feedback
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
