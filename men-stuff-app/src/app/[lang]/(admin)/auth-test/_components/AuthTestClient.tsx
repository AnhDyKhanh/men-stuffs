'use client'

import { useState, useEffect } from 'react'

type ApiResult = {
  ok: boolean
  url?: string
  error?: string
}

export default function AuthTestClient() {
  const [apiRole, setApiRole] = useState<{ role: string; user: { id: string } | null } | null>(null)
  const [uploadResult, setUploadResult] = useState<ApiResult | null>(null)
  const [uploading, setUploading] = useState(false)
  const [xUserRole, setXUserRole] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(window.location.pathname, { method: 'GET' })
        const role = res.headers.get('x-user-role')
        setXUserRole(role)
      } catch {
        setXUserRole('(failed to read)')
      }
    }
    run()
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        const data = await res.json()
        setApiRole({ role: data.role, user: data.user })
      } catch {
        setApiRole({ role: '(error)', user: null })
      }
    }
    run()
  }, [])

  const handleTestUpload = async () => {
    setUploading(true)
    setUploadResult(null)
    try {
      const blob = new Blob(['dummy image content'], { type: 'image/png' })
      const file = new File([blob], 'test.png', { type: 'image/png' })
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/admin/create-file', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        setUploadResult({ ok: true, url: data.url })
      } else {
        setUploadResult({
          ok: false,
          error: data.error ?? res.statusText ?? `HTTP ${res.status}`,
        })
      }
    } catch (e) {
      setUploadResult({
        ok: false,
        error: e instanceof Error ? e.message : 'Request failed',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Kiểm tra Middleware (header x-user-role)
      </h3>
      <p className="text-sm text-gray-600">
        Header <code className="rounded bg-gray-100 px-1">x-user-role</code> do middleware set trên response khi load trang.
      </p>
      {xUserRole !== null ? (
        <p className="font-mono text-sm">
          x-user-role = <strong>{xUserRole || '(rỗng)'}</strong>
        </p>
      ) : (
        <p className="text-gray-500">Đang đọc...</p>
      )}

      <h3 className="text-lg font-semibold text-gray-900">
        Kiểm tra API & Upload (cookie + staff)
      </h3>
      <button
        type="button"
        onClick={handleTestUpload}
        disabled={uploading}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {uploading ? 'Đang gửi...' : 'Test Upload & RLS'}
      </button>
      {uploadResult && (
        <div className={`rounded-md p-3 text-sm ${uploadResult.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {uploadResult.ok ? (
            <p>Thành công. URL ảnh: <a href={uploadResult.url} target="_blank" rel="noreferrer" className="underline">{uploadResult.url}</a></p>
          ) : (
            <p>Lỗi: {uploadResult.error}</p>
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900">
        API /api/auth/me (cookie gửi kèm request)
      </h3>
      {apiRole ? (
        <div className="text-sm">
          <p><span className="font-medium text-black">Role:</span> <span className="text-black">{apiRole.role}</span></p>
          {apiRole.user && (
            <p><span className="font-medium text-black">account_id:</span> <span className="text-black">{apiRole.user.id}</span>  </p>
          )}
        </div>
      ) : (
        <p className="">Đang tải...</p>
      )}
    </div>
  )
}
