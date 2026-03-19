import { useMutation } from "@tanstack/react-query"

type RegisterRequestDTO = {
  email: string
  password: string
  full_name: string
  phone: string
}

async function fetchRegister(body: RegisterRequestDTO) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export function useRegister() {
  return useMutation({
    mutationFn: fetchRegister,
  })
}