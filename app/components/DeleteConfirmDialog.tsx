'use client'

import { useEffect, useRef } from 'react'

type DeleteConfirmDialogProps = {
  title: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmDialog({ title, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirm delete"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="w-full max-w-sm border border-neutral-200 bg-white p-6 shadow-2xl shadow-black/10">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center border border-neutral-200 bg-neutral-50">
          <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="mb-1 text-base font-black text-black">Delete post?</h3>
        <p className="mb-6 text-sm leading-relaxed text-neutral-500">
          <span className="font-semibold text-black">&ldquo;{title}&rdquo;</span> will be permanently
          removed. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            id="delete-cancel"
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 border border-neutral-200 bg-white py-2.5 text-sm font-semibold text-neutral-600 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
          >
            Cancel
          </button>
          <button
            id="delete-confirm"
            onClick={onConfirm}
            className="flex-1 border border-black bg-black py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
