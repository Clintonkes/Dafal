import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import SectionTitle from './SectionTitle'

export default function ContactSection({ settings }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error("Failed to send message")
      
      setFormData({ name: '', email: '', subject: '', message: '' })
      toast.success('Your message has been sent successfully!')
    } catch(err) {
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Contact Us"
          title="Get in touch with our dispatch team"
          description="Have specific shipping requirements or questions? Our team operates 24/7 to ensure your cargo never stops moving."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols[1fr_1.5fr] lg:gap-8 xl:grid-cols-2">
          {/* Contact Details Panel */}
          <div className="rounded-[32px] bg-slate-950 p-8 text-white sm:p-10 lg:order-last">
            <h3 className="font-display text-3xl font-bold">Always ready to help</h3>
            <p className="mt-4 text-slate-300">
              For urgent logistics requests out of our Houston or Dallas hubs, drop us a line or give us a call.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Emergency Dispatch</p>
                  <p className="mt-1 text-lg font-semibold text-white">{settings?.phone || '+1 (800) 555-DAFAL'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">General Inquiries</p>
                  <p className="mt-1 text-lg font-semibold text-white">{settings?.email || 'dispatch@dafalhq.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Main Terminal</p>
                  <p className="mt-1 text-lg font-semibold leading-relaxed text-white whitespace-pre-line">{settings?.address || '4590 Logistics Way\nHouston, TX 77032'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft sm:p-10"
          >
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                  <input
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Subject</label>
                <input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-primary focus:bg-white"
                ></textarea>
              </div>
              <button disabled={loading} type="submit" className="w-full rounded-full bg-primary py-4 font-semibold text-white transition hover:bg-sky-900 disabled:opacity-70">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
