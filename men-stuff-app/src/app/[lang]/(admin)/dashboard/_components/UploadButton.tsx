'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

type UploadButtonProps = {
  onUploadSuccess?: (url: string) => void
  /** Optional: accept attribute for file input (default: image/*) */
  accept?: string
}

export default function UploadButton({ onUploadSuccess, accept = 'image/*' }: UploadButtonProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/admin/create-file', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.url) {
        onUploadSuccess?.(result.url)
      } else {
        alert('Lỗi: ' + (result.error ?? 'Upload thất bại'))
      }
    } catch {
      alert('Đã có lỗi xảy ra khi kết nối server.')
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="inline-block">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        aria-hidden
      />
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        variant="default"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang tải...
          </span>
        ) : (
          'Tải ảnh lên'
        )}
      </Button>
    </div>
  )
}
