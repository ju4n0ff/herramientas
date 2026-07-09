import { Outlet } from 'react-router-dom'
import { useModal } from '../hooks/useModal'
import { useDataContext } from '../App'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function MainLayout() {
  const { isOpen, preselect, open, close } = useModal()
  const data = useDataContext()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <Navbar onContact={() => open()} />
      <main id="main-content">
        <Outlet context={{ open, data }} />
      </main>
      <Footer contactInfo={data.contactInfo} />
      <Modal
        isOpen={isOpen}
        onClose={close}
        preselect={preselect}
        categories={data.categories}
        contactInfo={data.contactInfo}
      />
      <WhatsAppButton contactInfo={data.contactInfo} />
    </>
  )
}