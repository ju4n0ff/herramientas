import { Outlet } from 'react-router-dom'
import { useModal } from '../hooks/useModal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Modal from '../components/Modal'
import WhatsAppButton from '../components/WhatsAppButton'

export default function MainLayout(){
    const {isOpen,preselect, open,close} = useModal();

    return (<>
        <a href="#main-content" className="skip-link">
            Saltar al contenido principal
        </a>
        <Navbar onContact={()=>open()}/>
        <main id="main-content">
            <Outlet context={{open}}/>
        </main>
        <Footer/>
        <Modal isOpen={isOpen} onClose={close} preselect={preselect}/>
        <WhatsAppButton/>
    </>)
}
