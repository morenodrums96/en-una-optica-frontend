'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    // Precargar solo los primeros frames más importantes
    const PRELOAD_FRAMES = 50
    for (let i = 1; i <= PRELOAD_FRAMES; i++) {
      const frameNumber = String(i).padStart(3, '0')
      const img = new Image()
      img.src = `imagen/frames/${frameNumber}.webp`
    }

    // ✅ Deferir animaciones hasta que el navegador esté ocioso
    const runAnimations = () => {
      const MAX_FRAMES = 178

      const updateImage = (frame: number) => {
        const frameNumber = String(frame).padStart(3, '0')
        if (imgRef.current) {
          imgRef.current.src = `imagen/frames/${frameNumber}.webp`
        }
      }

      const frameObj = { frame: 1 }

      gsap.to(frameObj, {
        frame: MAX_FRAMES,
        ease: 'none',
        scrollTrigger: {
          trigger: '#video-scroll-wrapper',
          start: 'top top',
          end: '+=250%',
          scrub: true,
          pin: true,
          markers: false
        },
        onUpdate: () => {
          const frameIndex = Math.floor(frameObj.frame)
          updateImage(frameIndex)
        }
      })

      // Animación de entrada
      const tl = gsap.timeline({ delay: 0.3 })
        .fromTo(
          '.hero-glasses',
          { y: 50, opacity: 0, visibility: 'hidden' },
          { y: 0, opacity: 1, visibility: 'visible', duration: 1, ease: 'power3.out' }
        )
        .fromTo(
          '.hero-title',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.6'
        )

      // ScrollTrigger para transición de texto
      gsap.timeline({
        scrollTrigger: {
          trigger: '#video-scroll-wrapper',
          start: 'center center',
          end: '+=300%',
          scrub: true,
        }
      })
        .to('.hero-glasses', {
          x: '45vw',
          duration: 1,
          ease: 'power2.out'
        })
        .to('.hero-text', {
          opacity: 0,
          duration: 0.5,
          ease: 'power1.out'
        }, '-=1')
        .to('.hero-text-phase-2', {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: 'power2.out'
        }, '-=0.5')
    }

    // Usa requestIdleCallback si está disponible, si no usa fallback con setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(runAnimations)
    } else {
      setTimeout(runAnimations, 100)
    }
  }, [])


  return (
  <section
    id="video-scroll-wrapper"
    className="flex flex-col lg:flex-row items-center justify-center gap-12 px-[5vw] pt-[clamp(0px,2vh,40px)] h-[100vh] relative -translate-y-[10vh]"
  >
    {/* Columna izquierda: Lentes */}
    <div
      className="hero-glasses flex justify-center items-start opacity-0 invisible w-full lg:w-1/2"
    >
      <div className="relative mt-[-40px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff00_40%,_rgba(240,238,237,1)_100%)] pointer-events-none z-0" />
        <img
          ref={imgRef}
          src="imagen/frames/001.webp"
          loading="eager"
          alt="Lentes animados"
          className="relative z-10 will-change-transform w-[clamp(280px,40vw,800px)] h-auto 
                     mask-[radial-gradient(ellipse_at_center,_rgba(0,0,0,1)_60%,_rgba(0,0,0,0)_100%)]"
        />
      </div>
    </div>

    {/* Columna derecha: Texto hero */}
    <div className="hero-text w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
      <h1
        className="hero-title text-[clamp(2rem,5vw,4.5rem)] font-bold leading-tight text-[#286D76] opacity-0 mb-4"
      >
        Ver bien es solo el inicio,<br />
        <span className="text-[#31AFB4]">verte increíble</span> es nuestro compromiso.
      </h1>
    </div>

    {/* Segunda fase de texto */}
    <div
      className="hero-text-phase-2 absolute left-[5%] top-1/2 -translate-y-1/2 w-[90%] lg:max-w-[40%] opacity-0"
    >
      <h1
        className="text-[clamp(2rem,5vw,4.5rem)] font-bold leading-tight text-[#286D76] mb-4"
      >
        Con lentes que reflejan tu estilo y tu visión.<br />
        <span className="text-[#31AFB4]">Y mostrar al mundo tu auténtica versión.</span>
      </h1>
    </div>
  </section>
)

}
