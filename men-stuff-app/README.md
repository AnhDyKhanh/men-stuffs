# Men Stuffs — Next.js App

E-commerce (storefront + admin). Chạy dev:

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

---

## Routing — route được “handle” ở đâu?

### 1. Middleware (bảo vệ route)

| File        | Vai trò |
|------------|---------|
| `middleware.ts` (root project) | Chạy **trước** mọi request trang (trừ `api`, `_next`, static). Không đổi URL, chỉ **redirect** hoặc **cho qua** + gắn header. |

**Logic hiện tại:**

- **Route admin** (prefix khớp một trong): `/admin`, `/dashboard`, `/products-management`, `/categories-management`  
  - Đọc cookie `account_id` → gọi `isStaffByAccountId()` (`src/lib/auth-server.ts`, bảng Supabase `staff`).  
  - Không phải staff → redirect `/login?redirect=<pathname đang truy cập>`.

- **Route cần đăng nhập user** (chuỗi path chứa): `/checkout`, `/account`  
  - Đọc cookie `role`: nếu không phải `user` hoặc `admin` (tức coi như **guest**) → redirect `/login?redirect=...`.

- Mọi request qua được: response có header **`x-user-role`**: `guest` | `user` | `admin` (để Server Component có thể đọc qua `headers()` nếu cần).

**Matcher:** xem `export const config.matcher` trong `middleware.ts` (loại trừ API, static, ảnh).

### 2. App Router (UI theo URL)

Nhóm route (folder trong `src/app/`) — **không** có prefix ngôn ngữ:

| Nhóm | Thư mục | Ví dụ URL |
|------|---------|-----------|
| Store | `(store)/` | `/`, `/products`, `/product/[id]`, `/cart`, `/checkout`, `/account`, `/new-in` |
| Admin | `(admin)/` | `/dashboard`, `/products-management`, `/categories-management`, … |
| Public | `(public)/` | `/login`, `/register` |
| Trang tĩnh | `pages/` | `/pages/about`, `/pages/contact`, `/pages/policies/delivery` (nếu có file tương ứng) |
| Demo | `demo/` | `/demo` |

`(store)`, `(admin)`, `(public)` là **route groups** — không xuất hiện trong URL.

### 3. Hằng số path (tránh hardcode string rải rác)

| File | Nội dung |
|------|----------|
| `src/app/_constants/menu.ts` | `STORE_ROUTES`, `ADMIN_ROUTES`, `AUTH_ROUTES`, `PAGES_ROUTES`, `ROUTE_PATHS` — dùng khi cần path chuẩn trong code. |

### 4. API routes (REST)

| Prefix | Mục đích (tóm tắt) |
|--------|---------------------|
| `src/app/api/auth/*` | `login`, `logout`, `register`, `me` |
| `src/app/api/guest/*` | cart, add-to-cart, payment, feedback, … |
| `src/app/api/admin/*` | products, category, create-file |

Middleware **không** chặn `api/*` (theo matcher).

---

## Đăng nhập — lưu & lấy thông tin (chi tiết)

Auth hiện tại là **cookie-based**, không dùng JWT trong localStorage.

### Cookie do server set (sau login thành công)

| Tên cookie | HttpOnly | Max-Age | Nội dung | Set ở đâu |
|------------|----------|---------|----------|-----------|
| `account_id` | Có | 24h | UUID bản ghi `account.id` (Supabase) | `POST /api/auth/login` → `src/app/api/auth/login/route.ts` |
| `role` | Có | 24h | `"admin"` hoặc `"user"` | Cùng file trên |

**Cách gán role:**

1. Login: email/password → bảng `account`, verify bcrypt.
2. `isStaffByAccountId(account.id)` → có dòng trong bảng `staff` với `account_id` đó → **`admin`**, không thì **`user`**.

### Xóa session (logout)

| Bước | File / hành động |
|------|------------------|
| API | `POST /api/auth/logout` — `src/app/api/auth/logout/route.ts` — set `account_id` và `role` rỗng, `maxAge: 0`. |
| Client | `logout()` trong `src/lib/auth.ts` — gọi API logout + xóa thêm cookie `role` phía client (phần dư nếu có bản non-httpOnly). |

### Đọc “ai đang đăng nhập” ở đâu?

| Ngữ cảnh | Cách đọc |
|----------|----------|
| **Middleware** (mỗi request trang) | `request.cookies.get('role')`, `request.cookies.get('account_id')` — `middleware.ts` |
| **Server Component / Route Handler** | `cookies()` từ `next/headers` + `getUserRole()`, `getAccountIdFromCookie()` — `src/lib/auth.ts` |
| **Client / hook** | `GET /api/auth/me` — `src/app/api/auth/me/route.ts` → JSON `{ user: { id } \| null, role }` |

**Lưu ý:**

- `role` và `account_id` là **httpOnly** → JavaScript trình duyệt **không** đọc được trực tiếp; client muốn biết role phải gọi **`/api/auth/me`** hoặc dữ liệu từ response login.
- Phân quyền **admin thật** (vào dashboard, CRUD admin) dựa trên **staff + account_id** ở middleware, không chỉ tin cookie `role` một cách tách rời DB (login đã set role khớp với staff).

### Đăng ký

- UI: `(public)/register`.
- API: `src/app/api/auth/register/route.ts` (tạo tài khoản; chi tiết xem file).

---

## Cấu trúc thư mục (rút gọn)

```text
src/app/
├── (store)/          # Khách: home, products, cart, checkout, account, …
├── (admin)/          # Admin: dashboard, products-management, categories-management
├── (public)/         # login, register
├── pages/            # about, contact, policies (nếu có)
├── api/              # auth, guest, admin
├── _constants/       # menu.ts (routes)
├── _hooks/
└── _components/      # ví dụ admin LogoutButton

middleware.ts         # Bảo vệ route + x-user-role
src/lib/auth.ts       # Đọc role/account_id từ cookie (server)
src/lib/auth-server.ts # isStaffByAccountId (Supabase staff)
```

---

Tài liệu Next.js: [nextjs.org/docs](https://nextjs.org/docs).
