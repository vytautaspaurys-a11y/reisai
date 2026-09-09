type AdminPlaceholderPageProps = {
  title: string
}

export function AdminPlaceholderPage({ title }: AdminPlaceholderPageProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">
        Šis sąrašas bus kitame žingsnyje. Dabar svarbu, kad prisijungimas ir meniu veikia.
      </p>
    </section>
  )
}
