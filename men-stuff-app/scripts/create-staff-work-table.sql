-- Chạy trong Supabase SQL Editor một lần. Cần bảng public.staff và public.orders.
-- API admin: GET/PATCH /api/admin/staff-work

create table if not exists public.staff_work (
  id uuid primary key default gen_random_uuid(),
  assigned_to uuid references public.staff (id) on delete set null,
  created_by uuid references public.staff (id) on delete set null,
  related_order_id uuid references public.orders (id) on delete set null,
  title text not null default '',
  description text,
  status text not null default 'pending',
  task_type text,
  created_at timestamptz not null default now()
);

create index if not exists idx_staff_work_assigned on public.staff_work (assigned_to);
create index if not exists idx_staff_work_status on public.staff_work (status);
create index if not exists idx_staff_work_created on public.staff_work (created_at desc);

alter table public.staff_work enable row level security;
