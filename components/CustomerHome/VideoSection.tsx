'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import '@/app/globals.css'
import BestSellersCarousel from '@/components/CustomerHome/BestSellersCarousel'
import AboutUs from '@/components/CustomerHome/AboutUs'
import Benefits from '@/components/CustomerHome/Benefits'
import CTASection from '@/components/CustomerHome/CTASection'
import React, { Suspense } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  useEffect(() => {
    let minScrollY = 0
    let lockScroll = false
    let isScrollingBack = false

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-area',
        scrub: 1,
        start: 'top top',
        end: () => {
          const el = document.querySelector('#scroll-area') as HTMLElement | null
          return `${el?.offsetHeight ?? 1000}px top`
        }
      }
    })

    // Animación para el logo
    tl.to('#logo-key', {
      scale: 1,
      ease: 'power2.out',
      y: () => -window.innerHeight * 0.47,
    })

    // Zoom out del video de fondo
    tl.to('#portada-key', { scale: 1, ease: 'none' }, 0)

    // Animación de la niebla
    tl.to(
      '#fog-overlay',
      {
        y: '0%',
        opacity: 1,
        ease: 'none',
      },
      1,
    )

    // Desvanecer el video
    tl.to(
      '#portada-key',
      {
        opacity: 0,
        ease: 'none',
      },
      0.5,
    )

    // Desvanecer el logo
    gsap.to('#logo-key', {
      scrollTrigger: {
        trigger: '#scroll-area',
        start: () => `${window.innerHeight * 0.7}px top`,
        end: () => `${window.innerHeight * 0.85}px top`,
        scrub: 1,
      },
      opacity: 0,
      ease: 'none',
    })

    // Animación del header
    gsap.to('#header-public', {
      scrollTrigger: {
        trigger: '#scroll-area',
        start: () => `${window.innerHeight * 0.85}px top`,
        end: () => `${window.innerHeight * 1.0}px top`,
        scrub: 1,
        onUpdate: self => {
          if (self.progress > 0.1 && !lockScroll) {
            const scrollEl = document.getElementById('scroll-area') as HTMLElement | null
            minScrollY = scrollEl?.offsetHeight ? scrollEl.offsetHeight * 0.9 : window.scrollY
            lockScroll = true
          }
        },
      },
      opacity: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.34)',
      backdropFilter: 'blur(10px)',
      ease: 'none',
      onStart: () => {
        gsap.set('#header-public', { pointerEvents: 'auto' })
      },
      onReverseComplete: () => {
        gsap.set('#header-public', { pointerEvents: 'none' })
      },
    })

    // Previene scroll hacia arriba
    const handleScroll = () => {
      if (lockScroll && window.scrollY < minScrollY && !isScrollingBack) {
        isScrollingBack = true
        requestAnimationFrame(() => {
          window.scrollTo({ top: minScrollY })
          isScrollingBack = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* VIDEO HERO ANIMADO */}
      <section
        id="scroll-area"
        className="h-[140vh] sm:h-[120vh] md:h-[130vh] lg:h-[140vh] relative"
      >
        <div
          id="portada-key"
          className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0"
          style={{ transform: 'scale(1.2)' }}
        >
          <video
            id="video-key"
            className="absolute w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/video/Videoone.webm" type="video/webm" />
            <source src="/video/Videoone.mp4" type="video/mp4" />
            Tu navegador no soporta videos en HTML5.
          </video>

          {/* NIEBLA */}
          <div
            id="fog-overlay"
            className="absolute top-0 left-0 w-full h-full z-10"
            style={{
              background:
                'linear-gradient(to top, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
              opacity: 0,
              transform: 'translateY(100%)',
              backdropFilter: 'blur(0px)',
              WebkitBackdropFilter: 'blur(0px)',
            }}
          ></div>
        </div>

        {/* LOGO */}
        <div
          id="logo-key"
          className="fixed inset-0 z-20 flex items-center justify-center"
          style={{
            transform: 'scale(400)',
            height: '100vh',
            transformOrigin: 'center center',
          }}
        >
          <Image
            src="/imagen/name_blue.svg"
            alt="EnUnaÓptica"
            width={200}
            height={100}
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <Suspense fallback={<div>Cargando contenido...</div>}>
        <section id="best-sellers-section" className="bg-white py-1">
          <BestSellersCarousel />
        </section>

        <section id="about-us-section" className="bg-white py-16">
          <AboutUs />
        </section>

        <section id="benefits-section" className="bg-white py-16">
          <Benefits />
        </section>

        <section id="cta-section" className="bg-white py-16">
          <CTASection />
        </section>
      </Suspense>
    </>
  )
}
