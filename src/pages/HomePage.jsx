import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import TrackingPanel from '../components/TrackingPanel'
import ServicesSection from '../components/ServicesSection'
import FleetSection from '../components/FleetSection'
import TrustSection from '../components/TrustSection'
import TestimonialsSection from '../components/TestimonialsSection'
import BookingSection from '../components/BookingSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function HomePage() {
  const [fleet, setFleet] = useState([])
  const [settings, setSettings] = useState({ name: 'Dafal LLC', phone: '', email: '', address: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err))

    fetch('/api/fleet')
      .then(res => res.json())
      .then(data => setFleet(data))
      .catch(err => console.error(err))
  }, [])

  const handleCreateOrder = async (bookingForm) => {
    try {
      const newOrder = {
        id: `DFL-${Math.floor(Math.random() * 9000 + 1000)}`,
        customer: bookingForm.name,
        status: 'Pending',
        truckNumber: 'Awaiting assignment',
        route: `${bookingForm.pickup} -> ${bookingForm.delivery}`,
        eta: 'Awaiting dispatch',
        cargo: bookingForm.cargo,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })

      if (!response.ok) throw new Error("Failed to book order")
      
      const created = await response.json()
      toast.success(`Booking created with order ID ${created.id}`)
    } catch (err) {
      toast.error('Could not submit booking request.')
    }
  }

  return (
    <div className="bg-white text-slate-900">
      <Navbar />
      <HeroSection settings={settings} />
      <TrackingPanel />
      <ServicesSection />
      <FleetSection fleet={fleet} />
      <TrustSection />
      <TestimonialsSection />
      <BookingSection onCreateOrder={handleCreateOrder} />
      <ContactSection settings={settings} />
      <Footer settings={settings} />
    </div>
  )
}
