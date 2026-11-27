-- Sample data baked into the image at build time. Replace with your own schema.
create table products (
  id int primary key,
  name text not null,
  price numeric(10, 2) not null
);

insert into products values
  (1, 'Sticker pack', 4.00),
  (2, 'T-shirt', 25.00),
  (3, 'Hoodie', 60.00),
  (4, 'Mug', 12.50);

create table orders (
  id bigint generated always as identity primary key,
  product_id int not null references products,
  qty int not null,
  created_at timestamptz not null,
  meta jsonb not null
);

insert into orders (product_id, qty, created_at, meta)
select 1 + g % 4, 1 + g % 3, timestamptz '2026-01-01' + g * interval '1 hour',
       jsonb_build_object('channel', (array['web', 'mobile', 'api'])[1 + g % 3])
from generate_series(1, 1000) as g;

create view revenue_by_product as
select p.name, count(*) as orders, sum(o.qty * p.price) as revenue
from orders o
join products p on p.id = o.product_id
group by p.name
order by revenue desc;
