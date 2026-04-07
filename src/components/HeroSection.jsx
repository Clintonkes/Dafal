import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'
import { stats } from '../data/mockData'

export default function HeroSection({ settings }) {
  return (
    <section id="home" className="relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-primary/75 to-slate-900/70" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur"
          >
            <ShieldCheck size={16} className="text-orange-300" />
            Trusted cargo movement for time-sensitive operations
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-white md:text-6xl"
          >
            Reliable Cargo Transportation Across Every Mile
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-200"
          >
            Fast, secure, and efficient logistics solutions you can trust. {settings?.name || 'Dafal LLC'} helps businesses move with confidence using dependable fleet coordination and clear delivery visibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              Book Now
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Track Shipment
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
