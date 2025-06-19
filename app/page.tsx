'use client'

import React from 'react'
import VideoSection from '@/components/CustomerHome/VideoSection'
import BestSellersCarousel from '@/components/CustomerHome/BestSellersCarousel'
import AboutUs from '@/components/CustomerHome/AboutUs'
import Benefits from '@/components/CustomerHome/Benefits'
import CTASection from '@/components/CustomerHome/CTASection'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Video en posición fija mientras se hace scroll */}
      <VideoSection />

      {/* Contenido que se desliza encima al terminar el scroll */}
      <div className="relative z-10 -mt-screen">
        <BestSellersCarousel />
        <AboutUs />
        <Benefits />
        <CTASection />
      </div>
    </div>
  )
}
