import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import { services } from '../data/mockData'

export default function ServicesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Services"
        title="Logistics services designed for speed, clarity, and control"
        description="Every service is presented to reduce hesitation and help customers understand exactly how Dafal supports their cargo movement needs."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              whileHover={{ y: -8 }}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft transition"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <Icon size={26} />
              </div>
              <h3 className="mt-6 font-display text-2xl font-bold text-slate-900">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
