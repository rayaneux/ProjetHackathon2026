import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

export function showToast(message: string, type: ToastType = "info") {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type } }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent<{ message: string; type: ToastType }>).detail
      const id = Date.now().toString() + Math.random().toString(36).slice(2)
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 4000)
    }
    window.addEventListener("show-toast", handler)
    return () => window.removeEventListener("show-toast", handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-300 min-w-[280px] max-w-sm ${
            toast.type === "success" ? "bg-white border-green-200" :
            toast.type === "error"   ? "bg-white border-red-200"   :
            toast.type === "warning" ? "bg-white border-amber-200" :
                                       "bg-white border-slate-200"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === "error"   && <AlertCircle  className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />}
          {toast.type === "info"    && <Info          className="w-5 h-5 text-slate-500 shrink-0" />}
          <p className={`text-sm font-medium flex-1 ${
            toast.type === "success" ? "text-green-800" :
            toast.type === "error"   ? "text-red-800"   :
            toast.type === "warning" ? "text-amber-800" :
                                       "text-slate-800"
          }`}>{toast.message}</p>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
