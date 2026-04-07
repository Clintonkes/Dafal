export default function Footer({ settings }) {
  return (
    <footer className="bg-slate-950 py-8 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>{settings?.name || 'Dafal LLC'} ? Premium cargo logistics and transportation</p>
        <p className="whitespace-pre-line">{settings?.address}</p>
      </div>
    </footer>
  )
}
