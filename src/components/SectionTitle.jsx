import { motion } from 'framer-motion'

export default function SectionTitle({ eyebrow, title, description, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl"
    >
      <p className={`text-sm font-bold uppercase tracking-[0.35em] ${light ? 'text-orange-300' : 'text-accent'}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 font-display text-3xl font-bold md:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <p className={`mt-4 text-base leading-7 ${light ? 'text-slate-200' : 'text-slate-600'}`}>{description}</p>
    </motion.div>
  )
}
