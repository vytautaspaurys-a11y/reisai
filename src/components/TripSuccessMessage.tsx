type TripSuccessMessageProps = {
  tripNumber: string
  onNewTrip: () => void
}

export function TripSuccessMessage({ tripNumber, onNewTrip }: TripSuccessMessageProps) {
  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Reisas išsaugotas</h1>
        <p className="mt-3 text-base text-slate-600">
          Reisas <span className="font-semibold text-slate-900">{tripNumber}</span> sėkmingai
          išsaugotas.
        </p>

        <button
          type="button"
          onClick={onNewTrip}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Registruoti naują reisą
        </button>
      </main>
    </div>
  )
}
