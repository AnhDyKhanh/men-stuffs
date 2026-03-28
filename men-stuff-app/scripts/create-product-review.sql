-- Chạy một lần trên Supabase SQL Editor.
-- Bảng đánh giá sản phẩm sau khi mua (sao + bình luận + ảnh URL).

create table if not exists public.product_review (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.product (id) on delete cascade,
  customer_id uuid not null references public.customer (id) on delete cascade,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text,
  image_urls text[] not null default '{}',
  unique (order_id, product_id, customer_id)
);

create index if not exists product_review_order_id_idx on public.product_review (order_id);
create index if not exists product_review_product_id_idx on public.product_review (product_id);

comment on table public.product_review is 'Đánh giá của khách cho từng sản phẩm trong một đơn (một lần / dòng đơn).';
