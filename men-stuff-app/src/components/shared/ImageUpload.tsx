'use client'

import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

export function ImageUpload({ onChange }: { onChange: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0]
      if (file) {
        setPreview(URL.createObjectURL(file))
        onChange(file)
      }
    },
  })

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
  }

  return (
    <div
      {...getRootProps()}
      className="relative border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors min-h-[200px] w-full max-w-[300px] flex flex-col items-center justify-center bg-muted/30"
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="relative w-full h-full">
          <Image
            src={preview}
            alt="Preview"
            className="rounded-md object-cover w-full h-48"
            width={100}
            height={100}
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md hover:bg-destructive/90"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground gap-2">
          <Upload className="w-8 h-8" />
          {isDragActive ? (
            <p className="text-sm text-center">Thả ảnh vào đây...</p>
          ) : (
            <p className="text-sm text-center">Kéo thả hoặc click để chọn ảnh</p>
          )}
        </div>
      )}
    </div>
  )
}