import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/mockData'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const handleScroll = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button onClick={(e) => handleScroll(e, 'home')} className="font-display text-2xl font-bold text-primary">
          Dafal LLC
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <button key={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-sm font-medium text-slate-600 transition hover:text-primary">
              {link.label}
            </button>
          ))}

          <button
            onClick={(e) => handleScroll(e, 'booking')}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-500"
          >
            Book a Truck
          </button>
        </nav>

        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button key={link.href} onClick={(e) => handleScroll(e, link.href)} className="text-left text-sm font-medium text-slate-700">
                {link.label}
              </button>
            ))}

            <button
              onClick={(e) => handleScroll(e, 'booking')}
              className="inline-flex w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Book a Truck
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
