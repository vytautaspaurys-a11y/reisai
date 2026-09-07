import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Reisai</h1>
        <p className="mt-3 text-slate-600">
          Projektas su Vite, React, TypeScript ir Tailwind CSS.
        </p>
        <button
          type="button"
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
          onClick={() => setCount((value) => value + 1)}
        >
          Skaitiklis: {count}
        </button>
      </main>
    </div>
  )
}

export default App
