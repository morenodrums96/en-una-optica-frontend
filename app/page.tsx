'use client'

import React, { useRef, useEffect,Suspense } from 'react'
import VideoSection from '@/components/CustomerHome/VideoSection'
import BestSellersCarousel from '@/components/CustomerHome/BestSellersCarousel'
import AboutUs from '@/components/CustomerHome/AboutUs'
import Benefits from '@/components/CustomerHome/Benefits'
import CTASection from '@/components/CustomerHome/CTASection'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {


  return (
    <div className="relative">
      <VideoSection />
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
    </div>
  )
}
