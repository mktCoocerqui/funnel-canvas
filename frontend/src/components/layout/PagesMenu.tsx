import { useEffect, useRef, useState } from 'react'
import * as Icons from 'lucide-react'
import { useCanvasStore } from '../../store/canvasStore'
import { parseImportPayload, validateImportTree } from '../../lib/jsonImport'

export default function PagesMenu() {
  const projectPath = useCanvasStore((s) => s.projectPath)
  const pages = useCanvasStore((s) => s.pages)
  const activeProjectId = useCanvasStore((s) => s.activeProjectId)
  const createPage = useCanvasStore((s) => s.createPage)
  const switchToPage = useCanvasStore((s) => s.switchToPage)
  const importJsonTree = useCanvasStore((s) => s.importJsonTree)
  const loadPages = useCanvasStore((s) => s.loadPages)

  const [open, setOpen] = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentPageName = projectPath[0]?.name ?? 'Página'

  useEffect(() => {
    if (!open) return
    loadPages()
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleCreatePage = async () => {
    const name = newPageName.trim()
    if (!name) return
    setBusy(true)
    setError(null)
    try {
      await createPage(name)
      setNewPageName('')
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setBusy(true)
    setError(null)
    try {
      const text = await file.text()
      const raw = JSON.parse(text)
      const fallbackName = file.name.replace(/\.json$/i, '')
      const { pageName, roots } = parseImportPayload(raw, fallbackName)

      const validationErrors = validateImportTree(roots)
      if (validationErrors.length > 0) {
        setError(`JSON inválido:\n${validationErrors.slice(0, 5).join('\n')}`)
        return
      }

      await importJsonTree(pageName, roots)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao importar o arquivo')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-zinc-100 hover:bg-white/5"
      >
        {currentPageName}
        <Icons.ChevronDown size={13} className="text-zinc-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-white/10 bg-[#1a1b22] p-1.5 shadow-2xl">
          <div className="max-h-64 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  switchToPage(page.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] ${
                  page.id === activeProjectId ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Icons.FileText size={13} className="shrink-0 text-zinc-500" />
                <span className="truncate">{page.name}</span>
              </button>
            ))}
            {pages.length === 0 && <div className="px-2.5 py-2 text-[12px] text-zinc-500">Nenhuma página ainda.</div>}
          </div>

          <div className="mt-1.5 border-t border-white/10 pt-1.5">
            <div className="flex items-center gap-1.5 px-1">
              <input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePage()}
                placeholder="Nome da nova página"
                disabled={busy}
                className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:border-violet-400/50 focus:outline-none"
              />
              <button
                onClick={handleCreatePage}
                disabled={busy || !newPageName.trim()}
                className="rounded-md bg-white/10 px-2 py-1 text-[12px] font-medium text-zinc-100 hover:bg-white/15 disabled:opacity-40"
              >
                Criar
              </button>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="mt-1 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-zinc-300 hover:bg-white/5 disabled:opacity-40"
            >
              <Icons.Upload size={13} className="shrink-0 text-zinc-500" />
              Importar JSON (cria página nova)
            </button>
            <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
          </div>

          {error && (
            <div className="mt-1.5 whitespace-pre-wrap rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1.5 text-[11px] text-red-300">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
