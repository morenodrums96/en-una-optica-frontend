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
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-10vh)', // 💡 este lo puedes ajustar
        paddingTop: 'clamp(0px, 2vh, 40px)',
        padding: '0 5vw',
        gap: '6vw'
      }}
    >

      {/* Columna izquierda: Lentes */}
      <div
        className="hero-glasses"
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          opacity: 0,
          visibility: 'hidden',
        }}
      >
        <div style={{ position: 'relative', marginTop: '-40px' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, #ffffff00 40%, rgba(240,238,237,1) 100%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <img
            ref={imgRef}
            src="imagen/frames/001.webp"
            loading="eager"
            alt="Lentes animados"
            style={{
              width: 'clamp(350px, 40vw, 800px)',
              height: 'auto',
              position: 'relative',
              zIndex: 1,
              willChange: 'transform',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
              maskRepeat: 'no-repeat',
              maskSize: '100% 100%'
            }}
          />
        </div>
      </div>

      {/* Columna derecha: Texto hero */}
      <div
        className="hero-text"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <h1
          className="hero-title"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '700',
            color: '#286D76', // primary.700
            lineHeight: 1.2,
            marginBottom: '1rem',
            opacity: 0
          }}
        >
          Ver bien es solo el inicio,<br />
          <span style={{ color: '#31AFB4' }}>verte increíble</span> es nuestro compromiso.
        </h1>
      </div>

      <div
        className="hero-text-phase-2"
        style={{
          position: 'absolute',
          left: '5%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '40%',
          opacity: 0,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '700',
            color: '#286D76',
            lineHeight: 1.2,
            marginBottom: '1rem',
          }}
        >
          Con lentes que reflejan tu estilo y tu visión.<br />
          <span style={{ color: '#31AFB4' }}>Y mostrar al mundo tu auténtica versión.</span>
        </h1>
      </div>


    </section>
  )
}
