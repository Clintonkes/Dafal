import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'

export default function FleetSection({ fleet = [] }) {
  return (
    <section id="fleet" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Fleet"
          title="A capable fleet built for dependable cargo movement"
          description="Showcasing fleet quality reduces buyer anxiety and reinforces operational strength before a customer ever calls."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {fleet.map((truck, index) => (
            <motion.article
              key={truck.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft"
            >
              <img src={truck.image} alt={truck.name} className="h-64 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-900">{truck.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{truck.type}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${truck.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {truck.availability}
                  </span>
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Capacity</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{truck.capacity}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
