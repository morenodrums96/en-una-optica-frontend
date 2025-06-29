'use client'

import React, { useRef, useEffect } from 'react'
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

    </div>
  )
}
