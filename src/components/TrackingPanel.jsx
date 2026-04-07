import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

export default function TrackingPanel() {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleTrack = async (event) => {
    event.preventDefault()
    if (!orderId.trim()) return
    setLoading(true)

    try {
      const response = await fetch(`/api/orders/${orderId.trim()}`)
      const data = await response.json()
      
      if (data.error) {
        toast.error('No order was found with that ID')
      } else {
        setResult(data)
        setIsModalOpen(true)
        toast.success(`Tracking info found for ${data.id}`)
      }
    } catch (error) {
      toast.error('Failed to track order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="tracking" className="mx-auto mt-6 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft lg:p-8 relative z-10"
      >
        <div className="grid gap-8 lg:items-center">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-accent">Track Order</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Monitor every shipment with confidence</h2>
            <p className="mt-4 text-slate-600">
              Enter an order ID to view live delivery progress, truck assignment, route, and estimated arrival.
            </p>

            <form onSubmit={handleTrack} className="mt-6 flex flex-col gap-3 sm:flex-row max-w-lg mx-auto">
              <label className="sr-only" htmlFor="order-id">
                Order ID
              </label>
              <input
                id="order-id"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder="Enter order ID (e.g. DFL-001)"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-800 outline-none transition focus:border-primary focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Search size={18} />
                {loading ? 'Checking...' : 'Track Order'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && result && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-[32px] bg-slate-950 p-6 shadow-2xl md:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 text-slate-400 transition hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between pr-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-orange-300">Shipment status</p>
                  <h3 className="mt-2 font-display text-3xl font-bold text-white">{result.id}</h3>
                  <p className="mt-1 text-slate-400">Customer: {result.customer}</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
                  {result.status}
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <StatusItem label="Truck Number" value={result.truckNumber} />
                <StatusItem label="Delivery Route" value={result.route} />
                <StatusItem label="Estimated Time" value={result.eta} />
                <StatusItem label="Cargo Info" value={result.cargo} />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                 <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white/20 transition">Close Tracking</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

function StatusItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  )
}
