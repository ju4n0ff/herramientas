import { Outlet } from 'react-router-dom'
import { useModal } from '../hooks/useModal'
import { useDataContext } from '../App'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import WhatsAppButton from '../components/WhatsAppButton'

const FALLBACK = {
  contactInfo: [],
  categories: [{ key: 'all', label: 'Todos' }],
  slides: [],
  packs: [],
  photoWall: [],
}

export default function MainLayout() {
  const { isOpen, preselect, open, close } = useModal()
  const data = useDataContext()
  const safe = data || FALLBACK

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar onContact={() => open()} />
      <main id="main-content">
        <Outlet context={{ open, data: safe }} />
      </main>
      <Footer contactInfo={safe.contactInfo} />
      <Modal
        isOpen={isOpen}
        onClose={close}
        preselect={preselect}
        categories={safe.categories}
        contactInfo={safe.contactInfo}
      />
      <WhatsAppButton contactInfo={safe.contactInfo} />
    </>
  )
}
