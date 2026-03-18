import { useMutation } from "@tanstack/react-query"

type LoginDTO = {
  email: string
  password: string
}

async function fetchLogin(body: LoginDTO) {
  const { email, password } = body
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export function useLogin() {
  return useMutation({
    mutationFn: fetchLogin,
  })
}
