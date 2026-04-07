import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { CircleAlert, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import AdminTopbar from '../components/AdminTopbar'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  
  const [orders, setOrders] = useState([])
  const [fleet, setFleet] = useState([])
  const [messages, setMessages] = useState([])
  const [metrics, setMetrics] = useState([])
  const [settings, setSettings] = useState({ name: '', phone: '', email: '', address: '' })
  const [loading, setLoading] = useState(true)

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Admin session started' }
  ])
  const [newTruck, setNewTruck] = useState({ id: '', name: '', type: '', capacity: '' })
  const [isEditingTruck, setIsEditingTruck] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const fetchDashboardData = async () => {
    try {
      const [ordRes, fltRes, msgRes, ovwRes, setRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/fleet'),
        fetch('/api/messages'),
        fetch('/api/overview'),
        fetch('/api/settings')
      ])
      
      if (!ordRes.ok) throw new Error("Not authorized")

      setOrders(await ordRes.json())
      setFleet(await fltRes.json())
      setMessages(await msgRes.json())
      setSettings(await setRes.json())
      
      const ovw = await ovwRes.json()
      setMetrics([
        { label: 'Total orders', value: ovw.total_orders },
        { label: 'Active deliveries', value: ovw.active_deliveries },
        { label: 'Completed jobs', value: ovw.completed_jobs },
        { label: 'Available trucks', value: ovw.available_trucks }
      ])
    } catch (err) {
      toast.error('Session expired. Please login again.')
      localStorage.removeItem('token')
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  // Poll messages every 10s
  useEffect(() => {
    const fetchMessagesOnly = async () => {
       try {
         const res = await fetch('/api/messages')
         setMessages(await res.json())
       } catch (err) {}
    }
    const int = setInterval(fetchMessagesOnly, 10000)
    return () => clearInterval(int)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const customers = Array.from(new Set(orders.map(o => o.customer))).map((name, i) => ({
    id: i,
    name,
    company: name,
    phone: 'N/A',
    orders: orders.filter(o => o.customer === name).length
  }))

  const updateOrder = async (id, field, value) => {
    const order = orders.find(o => o.id === id)
    if (field === 'status' && value === 'In Transit' && (!order.truckNumber || order.truckNumber === 'Awaiting assignment')) {
      toast.error('You must assign an available truck before upgrading status to In Transit.')
      return
    }

    const payload = { [field]: value }
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      toast.success(`Order updated`)
      fetchDashboardData()
    } catch(err) {
      toast.error("Failed to update order")
    }
  }

  const handleAddTruck = async (event) => {
    event.preventDefault()
    
    if (isEditingTruck) {
      await editFleet(newTruck.id, { name: newTruck.name, type: newTruck.type, capacity: newTruck.capacity })
      setIsEditingTruck(false)
      setNewTruck({ id: '', name: '', type: '', capacity: '' })
      return
    }

    const truck = {
      id: `TRK-${Math.floor(Math.random() * 900 + 100)}`,
      name: newTruck.name,
      type: newTruck.type,
      capacity: newTruck.capacity,
      availability: 'Available'
    }
    
    try {
      await fetch('/api/fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(truck)
      })
      toast.success(`${truck.name} added to fleet`)
      setNewTruck({ id: '', name: '', type: '', capacity: '' })
      fetchDashboardData()
    } catch(err) {
      toast.error("Failed to add truck")
    }
  }

  const toggleAvailability = async (id) => {
    try {
       await fetch(`/api/fleet/${id}/availability`, { method: 'PUT'})
       fetchDashboardData()
       toast.success(`Truck availability updated`)
    } catch(err) {
       toast.error("Failed to update")
    }
  }

  const editFleet = async (id, payload) => {
    try {
       await fetch(`/api/fleet/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
       })
       fetchDashboardData()
       toast.success(`Truck details updated`)
    } catch(err) {
       toast.error("Failed to update")
    }
  }

  const deleteFleet = async (id) => {
    try {
       await fetch(`/api/fleet/${id}`, { method: 'DELETE' })
       fetchDashboardData()
       toast.success(`Truck deleted successfully`)
    } catch(err) {
       toast.error("Failed to delete")
    }
  }

  const updateSettings = async (event) => {
    event.preventDefault()
    try {
       await fetch('/api/settings', {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(settings)
       })
       toast.success(`Profile settings updated`)
    } catch(err) {
       toast.error("Failed to update profile")
    }
  }

  const confirmLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-100 font-display text-xl">Loading Admin Database...</div>

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <AdminTopbar activeTab={activeTab} setActiveTab={setActiveTab} notifications={notifications} onLogout={() => setShowLogoutModal(true)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-end gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <CircleAlert size={16} />
            Secure Connection Active
          </div>
        </div>

        {(activeTab === 'Overview' || activeTab === 'Orders') && <OverviewCards metrics={metrics} />}

        {activeTab === 'Overview' && <OverviewPanel notifications={notifications} />}
        {activeTab === 'Orders' && <OrdersPanel orders={orders} onUpdateOrder={updateOrder} fleet={fleet} />}
        {activeTab === 'Fleet' && (
          <FleetPanel fleet={fleet} newTruck={newTruck} setNewTruck={setNewTruck} onAddTruck={handleAddTruck} toggleAvailability={toggleAvailability} editFleet={editFleet} deleteFleet={deleteFleet} isEditingTruck={isEditingTruck} setIsEditingTruck={setIsEditingTruck} />
        )}
        {activeTab === 'Customers' && <CustomersPanel customers={customers} />}
        {activeTab === 'Messages' && <MessagesPanel messages={messages} />}
        {activeTab === 'Profile' && <ProfilePanel settings={settings} setSettings={setSettings} onSave={updateSettings} />}

      </main>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-xl">
              <h3 className="text-xl font-bold font-display text-slate-900">Sign Out</h3>
              <p className="mt-2 text-slate-500">Are you sure you want to securely log out of the admin session?</p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="rounded-full px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                <button onClick={confirmLogout} className="rounded-full bg-rose-600 px-5 py-2.5 font-semibold text-white hover:bg-rose-700 transition">Yes, Sign out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
      <button disabled={page === 1} onClick={() => setPage(page-1)} className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold transition disabled:opacity-50">Previous</button>
      <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold transition disabled:opacity-50">Next</button>
    </div>
  )
}

function OverviewCards({ metrics }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
          className="rounded-[28px] bg-white p-6 shadow-soft"
        >
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-4 font-display text-4xl font-bold text-slate-900">{metric.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

function OverviewPanel({ notifications }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-accent">Operations View</p>
        <h2 className="mt-3 font-display text-3xl font-bold text-slate-900">Dispatch activity at a glance</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['New orders', 'Live db'],
            ['On-time rate', '97.4%'],
            ['Customer response', '< 10 min'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-soft">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Notifications</p>
        <div className="mt-5 space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              {notification.text}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function OrdersPanel({ orders, onUpdateOrder, fleet }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginatedOrders = orders.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const availableTrucks = fleet.filter(t => t.availability === 'Available')

  return (
    <section className="mt-8 rounded-[28px] bg-white p-6 shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.25em] text-slate-500">
              <th className="pb-4">Order</th>
              <th className="pb-4">Customer</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Truck</th>
              <th className="pb-4">Route</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-4">
                  <p className="font-semibold text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.cargo}</p>
                </td>
                <td className="py-4 text-sm text-slate-700">{order.customer}</td>
                <td className="py-4">
                  <select
                    value={order.status}
                    onChange={(event) => onUpdateOrder(order.id, 'status', event.target.value)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="py-4">
                  <select
                    value={order.truckNumber}
                    onChange={(event) => onUpdateOrder(order.id, 'truckNumber', event.target.value)}
                    className="rounded-full border border-slate-200 px-3 py-2 text-sm outline-none"
                  >
                    <option value="Awaiting assignment">Awaiting assignment</option>
                    {order.truckNumber !== 'Awaiting assignment' && !availableTrucks.find(t=>t.id===order.truckNumber) && (
                      <option value={order.truckNumber}>{order.truckNumber}</option>
                    )}
                    {availableTrucks.map((truck) => (
                      <option key={truck.id} value={truck.id}>{truck.id}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 text-sm text-slate-700">{order.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </section>
  )
}

function FleetPanel({ fleet, newTruck, setNewTruck, onAddTruck, toggleAvailability, editFleet, deleteFleet, isEditingTruck, setIsEditingTruck }) {
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState(null)
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(fleet.length / itemsPerPage)
  const paginatedFleet = fleet.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2.5fr]">
      <section className="rounded-[28px] bg-white p-6 shadow-soft self-start">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">{isEditingTruck ? 'Edit Fleet Details' : 'Add Fleet'}</h2>
          </div>
        </div>

        <form onSubmit={onAddTruck} className="grid gap-4">
          <input
            value={newTruck.name}
            onChange={(event) => setNewTruck((current) => ({ ...current, name: event.target.value }))}
            required
            placeholder="Truck name"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
          <input
            value={newTruck.type}
            onChange={(event) => setNewTruck((current) => ({ ...current, type: event.target.value }))}
            required
            placeholder="Truck type"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
          <input
            value={newTruck.capacity}
            onChange={(event) => setNewTruck((current) => ({ ...current, capacity: event.target.value }))}
            required
            placeholder="Capacity"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
          />
          <button type="submit" className="rounded-full bg-accent px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
            {isEditingTruck ? 'Update truck details' : 'Save truck'}
          </button>
          {isEditingTruck && (
            <button 
              type="button" 
              onClick={() => {
                setIsEditingTruck(false);
                setNewTruck({ id: '', name: '', type: '', capacity: '' });
              }} 
              className="rounded-full bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-slate-900">Fleet availability</h2>
        <div className="mt-6 space-y-4">
          {paginatedFleet.map((truck) => (
            <div key={truck.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{truck.name}</p>
                <p className="text-sm text-slate-500">
                  {truck.id} - {truck.capacity} - {truck.type}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => toggleAvailability(truck.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${truck.availability === 'Available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                >
                  {truck.availability}
                </button>

                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === truck.id ? null : truck.id)} className="p-2 text-slate-400 transition hover:text-slate-700 rounded-full hover:bg-slate-50 rounded-full">
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === truck.id && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                      <button onClick={() => {
                        setNewTruck(truck)
                        setIsEditingTruck(true)
                        setOpenMenuId(null)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button onClick={() => {
                        deleteFleet(truck.id);
                        setOpenMenuId(null)
                      }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50">
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </section>
    </div>
  )
}

function CustomersPanel({ customers }) {
  return (
    <section className="mt-8 rounded-[28px] bg-white p-6 shadow-soft">
      <h2 className="font-display text-2xl font-bold text-slate-900">Customer management</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-3xl border border-slate-200 p-5">
            <p className="font-display text-xl font-bold text-slate-900">{customer.name}</p>
            <p className="mt-1 text-sm text-slate-500">{customer.company}</p>
            <p className="mt-4 text-sm text-slate-700">{customer.phone}</p>
            <p className="mt-4 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 w-fit">
              Order history: {customer.orders}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MessagesPanel({ messages }) {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(messages.length / itemsPerPage)
  const paginatedMessages = messages.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <section className="mt-8 rounded-[28px] bg-white p-6 shadow-soft">
      <h2 className="font-display text-2xl font-bold text-slate-900">Live Customer Messages</h2>
      <p className="mt-2 text-sm text-slate-500">Messages will appear here instantly as soon as customers submit them.</p>
      
      <div className="mt-6 space-y-4">
        {paginatedMessages.length === 0 && <p className="text-slate-500">No messages yet.</p>}
        {paginatedMessages.map((message) => (
          <div key={message.id} className="rounded-3xl border border-slate-200 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900">{message.topic}</p>
                <p className="text-sm text-slate-500">
                  {message.sender} • {message.email}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{message.excerpt}</p>
          </div>
        ))}
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </section>
  )
}

function ProfilePanel({ settings, setSettings, onSave }) {
  return (
    <section className="mt-8 rounded-[28px] bg-white p-6 shadow-soft max-w-2xl">
      <h2 className="font-display text-2xl font-bold text-slate-900">Company Settings</h2>
      <p className="mt-2 text-sm text-slate-500">Changes here will immediately update the active layout on the Live Home Page.</p>
      
      <form onSubmit={onSave} className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Company Name</label>
          <input
            value={settings.name}
            onChange={e => setSettings({...settings, name: e.target.value})}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone Contact</label>
          <input
            value={settings.phone}
            onChange={e => setSettings({...settings, phone: e.target.value})}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Dispatch Email</label>
          <input
            value={settings.email}
            onChange={e => setSettings({...settings, email: e.target.value})}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Physical Address</label>
          <textarea
            value={settings.address}
            onChange={e => setSettings({...settings, address: e.target.value})}
            rows="3"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
        </div>
        <button type="submit" className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-sky-900">
          Save Settings
        </button>
      </form>
    </section>
  )
}
