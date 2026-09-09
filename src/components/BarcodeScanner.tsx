import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'

type BarcodeScannerProps = {
  onDetected: (value: string) => void
  onClose: () => void
}

export function BarcodeScanner({ onDetected, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onDetectedRef = useRef(onDetected)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastScanned, setLastScanned] = useState('')

  onDetectedRef.current = onDetected

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()
    const videoElement = videoRef.current
    let controls: IScannerControls | undefined
    let cancelled = false
    let cooldownUntil = 0

    async function startCamera() {
      if (!videoElement) {
        return
      }

      try {
        const startedControls = await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: 'environment' },
            },
          },
          videoElement,
          (result) => {
            if (!result || cancelled) {
              return
            }

            const now = Date.now()
            // Trumpa pauzė, kad tas pats kodas nebūtų pridėtas kelis kartus iš eilės
            if (now < cooldownUntil) {
              return
            }

            const text = result.getText().trim()
            if (!text) {
              return
            }

            cooldownUntil = now + 1500
            setLastScanned(text)
            onDetectedRef.current(text)
          },
        )

        if (cancelled) {
          startedControls.stop()
          return
        }

        controls = startedControls
      } catch {
        if (!cancelled) {
          setErrorMessage(
            'Nepavyko įjungti kameros. Suteikite leidimą kamerai ir bandykite dar kartą.',
          )
        }
      }
    }

    void startCamera()

    return () => {
      cancelled = true
      controls?.stop()

      if (videoElement?.srcObject instanceof MediaStream) {
        for (const track of videoElement.srcObject.getTracks()) {
          track.stop()
        }
        videoElement.srcObject = null
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-slate-900">
        <video
          ref={videoRef}
          className="h-64 w-full bg-slate-900 object-cover"
          muted
          playsInline
          autoPlay
        />
      </div>

      {lastScanned && (
        <p className="text-sm font-medium text-green-700">Pridėta: {lastScanned}</p>
      )}

      {errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Uždaryti kamerą
      </button>
    </div>
  )
}
