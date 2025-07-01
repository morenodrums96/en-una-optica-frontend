'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import '@/app/globals.css'


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




  }, [])

  return (
    <>
      


    </>
  )
}
