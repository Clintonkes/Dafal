import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'

const initialForm = {
  name: '',
  phone: '',
  pickup: '',
  delivery: '',
  cargo: '',
}

export default function BookingSection({ onCreateOrder }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)

    window.setTimeout(() => {
      onCreateOrder(form)
      setForm(initialForm)
      setSubmitting(false)
      toast.success('Booking request received. Our dispatch team will contact you shortly.')
    }, 1200)
  }

  return (
    <section id="booking" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow="Book Cargo"
          title="Capture demand with a booking flow that feels immediate and dependable"
          description="This form balances speed and trust so users can request a truck without friction while still sharing the operational details your team needs."
        />

        <motion.form
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2"
        >
          <Field label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
          <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
          <Field label="Pickup location" name="pickup" value={form.pickup} onChange={handleChange} placeholder="Pickup address" />
          <Field label="Delivery location" name="delivery" value={form.delivery} onChange={handleChange} placeholder="Delivery address" />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="cargo">
              Cargo details
            </label>
            <textarea
              id="cargo"
              name="cargo"
              rows="4"
              required
              value={form.cargo}
              onChange={handleChange}
              placeholder="Describe weight, quantity, handling needs, or timeline"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
            />
          </div>
          <div className="md:col-span-2 flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center">
            <p className="max-w-lg text-sm text-slate-300">
              Every submission creates a new booking request in the system and triggers an operational notification.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor={props.name}>
        {label}
      </label>
      <input
        id={props.name}
        required
        {...props}
        className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
      />
    </div>
  )
}
