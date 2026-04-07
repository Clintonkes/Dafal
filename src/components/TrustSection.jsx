import { motion } from 'framer-motion'
import SectionTitle from './SectionTitle'
import { trustBadges } from '../data/mockData'

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionTitle
          eyebrow="Trust & Security"
          title="Built to make customers feel protected before they commit"
          description="Trust psychology matters in logistics. Dafal uses proof points that reduce friction and reassure visitors that their cargo is in capable hands."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-900">{badge.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{badge.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
