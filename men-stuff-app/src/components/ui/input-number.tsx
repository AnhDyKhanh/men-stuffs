// components/ui/input-number.tsx
import { Input } from '@/components/ui/input'
import type { ComponentProps } from 'react'

type InputNumberProps = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & {
  onChange?: (value: number | '') => void
}

export function InputNumber({ onChange, ...props }: InputNumberProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"   // ← mobile keyboard số
      pattern="[0-9]*"      // ← hint cho browser
      onKeyDown={(e) => {
        // Cho phép: số, backspace, delete, arrow, tab, ctrl+a/c/v
        const allowed = [
          'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
        ]
        if (allowed.includes(e.key)) return
        if (e.ctrlKey || e.metaKey) return
        if (!/^\d$/.test(e.key)) e.preventDefault() // ← chặn ký tự không phải số
      }}
      onChange={(e) => {
        const raw = e.target.value.replace(/\D/g, '') // strip mọi thứ không phải số
        onChange?.(raw === '' ? '' : Number(raw))
      }}
    />
  )
}