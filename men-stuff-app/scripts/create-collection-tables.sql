-- Chạy trong Supabase SQL Editor (hoặc migration) một lần để bật quản lý bộ sưu tập.
-- Bảng product phải đã tồn tại (public.product).

create table if not exists public.collection (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.collection_item (
  collection_id uuid not null references public.collection (id) on delete cascade,
  product_id uuid not null references public.product (id) on delete cascade,
  sort_order int not null default 0,
  primary key (collection_id, product_id)
);

create index if not exists idx_collection_item_collection on public.collection_item (collection_id);

alter table public.collection enable row level security;
alter table public.collection_item enable row level security;

-- Service role (API server) bypasses RLS; anon không đọc trực tiếp. Storefront đọc qua /api/collections.
