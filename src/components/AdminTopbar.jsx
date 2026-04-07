import { useState } from 'react'
import { ChevronDown, ArrowLeft } from 'lucide-react'

export default function AdminTopbar({ activeTab, setActiveTab, notifications, onLogout }) {
  const [open, setOpen] = useState(false)
  const tabs = ['Overview', 'Orders', 'Fleet', 'Customers', 'Messages', 'Profile']

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-accent">Admin Dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Dafal logistics operations</h1>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('Overview')}
              className="mr-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-sky-900"
            >
              <ArrowLeft size={16} />
              Back to overview
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-primary text-center text-sm font-bold leading-10 text-white">
                  AD
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">Admin Dispatch</p>
                  <p className="text-xs text-slate-500">{notifications.length} active alerts</p>
                </div>
                <ChevronDown size={18} className="text-slate-500" />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                  <button 
                    type="button" 
                    onClick={() => { setActiveTab('Profile'); setOpen(false); }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    Profile
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { onLogout(); setOpen(false); }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-sky-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
