'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  const logoRef = useRef(null)
  const videoWrapperRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#videoSection",
        start: "top top",
        end: "190% top", // 👈 tarda 4 scrolls completos
        scrub: true,
        pin: true,
      },
    })

    // Video: pequeño zoom out del wrapper (no del video directamente)
    tl.fromTo(videoWrapperRef.current,
      { scale: 1.2 },
      { scale: 1, ease: "power2.out" },
      0
    )

    tl.to(logoRef.current, {
      scale: 0.1,
      y: -430,
      opacity: 2,
      ease: "power2.out",
      duration: 0.4, // 👈 se encoge más rápido

    }, 0) // ← empieza desde el primer scroll

  }, [])

  return (
    <section
      id="videoSection"
      className="w-screen h-screen relative overflow-hidden"
    >
      {/* Video wrapper con zoom inicial */}
      <div
        ref={videoWrapperRef}
        className="w-full h-full overflow-hidden"
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/poster-home.jpg"
        >
          <source src="/video/Videoone.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>

      {/* Logo opcional */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <Image
          ref={logoRef}
          id="logoAnimated"
          src="/imagen/name_blue.png"
          alt="EnUnaÓptica Logo"
          width={5000}
          height={5000}
          style={{
            transform: 'scale(52) translateY(-15%)', // 👈 GIGANTESCO y más visible desde el inicio
          }}
          className="object-contain"
          priority
        />

      </div>
    </section>
  )
}
