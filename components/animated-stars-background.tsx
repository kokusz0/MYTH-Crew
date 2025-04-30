"use client"

import { useEffect, useRef, useState } from "react"

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  interactive?: boolean
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  active: boolean
  angle: number
}

export default function AnimatedStarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const shootingStarTimerRef = useRef<NodeJS.Timeout | null>(null)
  const shootingStarsRef = useRef<ShootingStar[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Create stars
    const stars: Star[] = []
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000)

    for (let i = 0; i < starCount; i++) {
      // Make about 20% of stars interactive (follow cursor)
      const interactive = Math.random() < 0.2
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.05 + 0.01,
        opacity: Math.random() * 0.8 + 0.2,
        interactive,
      })
    }

    // Initialize shooting stars array
    shootingStarsRef.current = []

    // Function to create a shooting star
    const createShootingStar = () => {
      const shootingStar: ShootingStar = {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3), // Start in top third of screen
        length: Math.random() * 80 + 100, // Length of the shooting star trail
        speed: Math.random() * 10 + 15,
        opacity: 1,
        active: true,
        angle: Math.PI / 4 + (Math.random() * Math.PI) / 4, // Angle between PI/4 and PI/2 (diagonal down)
      }
      shootingStarsRef.current.push(shootingStar)
    }

    // Set up shooting star timer
    const startShootingStarTimer = () => {
      if (shootingStarTimerRef.current) {
        clearInterval(shootingStarTimerRef.current)
      }

      // Create a shooting star every 6 seconds
      shootingStarTimerRef.current = setInterval(() => {
        createShootingStar()
      }, 6000)

      // Create one immediately
      createShootingStar()
    }

    startShootingStarTimer()

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw and update stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Move star
        if (star.interactive && mousePosition.x > 0 && mousePosition.y > 0) {
          // Calculate distance from mouse
          const dx = mousePosition.x - star.x
          const dy = mousePosition.y - star.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Move star towards mouse if within range (300px)
          if (distance < 300) {
            const influence = 1 - distance / 300 // Stronger influence when closer
            star.x += (dx / distance) * influence * 2
            star.y += (dy / distance) * influence * 2
          } else {
            // Regular movement
            star.x -= star.speed
          }
        } else {
          // Regular movement
          star.x -= star.speed
        }

        // Reset star position if it goes off screen
        if (star.x < 0) {
          star.x = canvas.width
          star.y = Math.random() * canvas.height
        }
        if (star.x > canvas.width) {
          star.x = 0
          star.y = Math.random() * canvas.height
        }
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Draw and update shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((shootingStar) => {
        if (!shootingStar.active) return false

        // Calculate the end point of the shooting star trail
        const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length

        // Create gradient for the shooting star trail
        const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        // Draw the shooting star
        ctx.beginPath()
        ctx.moveTo(shootingStar.x, shootingStar.y)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Update position
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed
        shootingStar.y -= Math.sin(shootingStar.angle) * shootingStar.speed

        // Fade out as it moves
        shootingStar.opacity -= 0.01

        // Check if the shooting star should still be active
        if (
          shootingStar.x < 0 ||
          shootingStar.x > canvas.width ||
          shootingStar.y < 0 ||
          shootingStar.y > canvas.height ||
          shootingStar.opacity <= 0
        ) {
          shootingStar.active = false
          return false
        }

        return true
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (shootingStarTimerRef.current) {
        clearInterval(shootingStarTimerRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ pointerEvents: "none" }} />
}
