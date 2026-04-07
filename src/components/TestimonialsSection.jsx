import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from './SectionTitle'
import { testimonials } from '../data/mockData'

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 4500)

    return () => window.clearInterval(intervalId)
  }, [])

  const testimonial = testimonials[activeIndex]

  return (
    <section className="bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Testimonials"
          title="What customers say after trusting Dafal with their loads"
          description="Social proof is one of the fastest ways to lower hesitation and support conversions."
          light
        />

        <div className="mt-12 rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-glow backdrop-blur">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-orange-300">{'?'.repeat(testimonial.rating)}</div>
              <p className="mt-5 max-w-3xl font-display text-3xl leading-tight text-white">
                ?{testimonial.quote}?
              </p>
              <div className="mt-8">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-slate-200">{testimonial.company}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition ${activeIndex === index ? 'w-10 bg-accent' : 'w-2.5 bg-white/30'}`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
