import { useDropzone } from 'react-dropzone'

export function ImageUpload({ onChange }: { onChange: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => onChange(files[0]),
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary"
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Thả ảnh vào đây...</p> : <p>Kéo thả hoặc click để chọn ảnh</p>}
    </div>
  )
}