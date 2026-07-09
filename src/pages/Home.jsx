import { useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'
import PhotoWall from '../components/PhotoWall'
import Packs from '../components/Packs'
import Contact from '../components/Contact'

export default function Home() {
  const { open, data } = useOutletContext()
  useScrollReveal()

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <Hero onGallery={() => scrollTo('galeria')} onPacks={() => scrollTo('packs')} />
      <Gallery slides={data.slides} categories={data.categories} />
      <About />
      <PhotoWall photos={data.photoWall} />
      <Packs packs={data.packs} onReserve={open} />
      <Contact onOpen={() => open()} />
    </>
  )
}