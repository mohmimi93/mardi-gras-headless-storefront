"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, X } from "lucide-react"

const popularSearches = ["Dresses", "Polos", "Hoodies", "Youth", "Infant", "Rugby"]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    setQuery("")
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50)
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose()
      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const normalizedQuery = query.trim()

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        ref={modalRef}
        className="relative mx-auto mt-[10vh] w-full max-w-2xl px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <div className="overflow-hidden rounded-xl bg-white shadow-2xl">
          <form action="/search" method="get">
            <div className="flex items-center border-b px-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                name="q"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="flex-1 border-0 bg-transparent px-4 py-4 text-lg outline-none placeholder:text-muted-foreground/60"
              />
              {normalizedQuery ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <kbd className="hidden rounded border bg-neutral-100 px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">
                  ESC
                </kbd>
              )}
            </div>
            {normalizedQuery && (
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 p-4 text-sm font-medium hover:bg-neutral-50"
              >
                Search Odoo for &quot;{normalizedQuery}&quot;
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </form>
          {!normalizedQuery && (
            <div className="p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    onClick={handleClose}
                    className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-foreground hover:bg-neutral-50"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
