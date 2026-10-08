-- Schema for the Neon multi-tenant platform example.
-- Apply once: `psql "$DATABASE_URL" -f db/schema.sql` (or the Neon SQL Editor).
--
-- Two data paths: the dashboard uses the Data API as the `authenticated` role
-- (RLS scopes rows to `auth.user_id()`, the JWT `sub`); public tenant pages use
-- the serverless driver as the table owner and read only published rows.

-- JWT subject for the current Data API request. SECURITY DEFINER so
-- `authenticated` can use this as a column default without USAGE on schema
-- `auth` (see stamp_owner_id below). Returns null when there is no JWT.
create or replace function public.current_owner_id()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return auth.user_id();
end;
$$;

revoke all on function public.current_owner_id() from public;
grant execute on function public.current_owner_id() to authenticated;

-- A "site" is a tenant: it has a unique subdomain and belongs to one user.
create table if not exists sites (
  id          bigint generated always as identity primary key,
  owner_id    text        not null default (public.current_owner_id()),
  name        text        not null,
  subdomain   text        not null unique,
  description text        not null default '',
  created_at  timestamptz not null default now()
);

-- Authors belong to a site so a tenant can publish under several bylines.
create table if not exists authors (
  id          bigint generated always as identity primary key,
  site_id     bigint      not null references sites (id) on delete cascade,
  owner_id    text        not null default (public.current_owner_id()),
  name        text        not null,
  -- Object key of the author's photo in Neon Object Storage (nullable).
  image_key   text,
  image_alt   text        not null default '',
  created_at  timestamptz not null default now()
);

-- Posts belong to a site, and are removed with it.
create table if not exists posts (
  id           bigint generated always as identity primary key,
  site_id      bigint      not null references sites (id) on delete cascade,
  owner_id     text        not null default (public.current_owner_id()),
  title        text        not null,
  author       text        not null default '',
  author_id    bigint      references authors (id) on delete set null,
  -- Markdown source; rendered on the public tenant blog when published.
  content      text        not null default '',
  -- Object key of a cover image in Neon Object Storage (nullable).
  image_key    text,
  image_alt    text        not null default '',
  is_published boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists authors_site_id_idx on authors (site_id);
create index if not exists authors_owner_id_idx on authors (owner_id);
create index if not exists posts_site_id_idx on posts (site_id);
create index if not exists posts_owner_id_idx on posts (owner_id);
create index if not exists posts_author_id_idx on posts (author_id);
create index if not exists sites_owner_id_idx on sites (owner_id);

-- Additive for databases created before authors existed.
alter table posts add column if not exists author text not null default '';
alter table posts add column if not exists author_id bigint references authors (id) on delete set null;
alter table posts add column if not exists image_alt text not null default '';
alter table authors add column if not exists image_alt text not null default '';

alter table sites alter column owner_id set default public.current_owner_id();
alter table authors alter column owner_id set default public.current_owner_id();
alter table posts alter column owner_id set default public.current_owner_id();

alter table sites enable row level security;
alter table authors enable row level security;
alter table posts enable row level security;

-- Apply RLS even to the table owner (neondb_owner). Public SSR uses that role
-- via DATABASE_URL; without FORCE, a missing `is_published` filter would leak
-- drafts. Owner SELECT policies below allow only public data. Draft cover
-- images are authorized in /api/file by JWT + `posts/<userId>/` key prefix,
-- not by reading unpublished rows as the owner.
alter table sites force row level security;
alter table authors force row level security;
alter table posts force row level security;

-- Data API: signed-in requests run as `authenticated`. Unauthenticated Data API
-- requests run as `anonymous`, which must not read or write app tables.
revoke all on table sites, authors, posts from public;
revoke all on table sites, authors, posts from anonymous;
revoke all on all sequences in schema public from anonymous;

grant usage on schema public to authenticated;
grant select, insert, update, delete on sites, authors, posts to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Stamp owner_id from the JWT. SECURITY DEFINER is required: the Data API
-- role `authenticated` cannot USAGE schema `auth`, so an invoker trigger
-- that calls auth.user_id() fails with "permission denied for schema auth"
-- on INSERT/UPDATE. The JWT is still read from the session. When there is
-- no JWT (seed via DATABASE_URL), auth.user_id() is null and owner_id is left
-- as supplied.
create or replace function public.stamp_owner_id()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uid text;
begin
  uid := public.current_owner_id();
  if uid is not null then
    new.owner_id := uid;
  end if;
  return new;
end;
$$;

revoke all on function public.stamp_owner_id() from public;
grant execute on function public.stamp_owner_id() to authenticated;

drop trigger if exists sites_stamp_owner_id on sites;
create trigger sites_stamp_owner_id
  before insert or update on sites
  for each row execute function public.stamp_owner_id();

drop trigger if exists authors_stamp_owner_id on authors;
create trigger authors_stamp_owner_id
  before insert or update on authors
  for each row execute function public.stamp_owner_id();

drop trigger if exists posts_stamp_owner_id on posts;
create trigger posts_stamp_owner_id
  before insert or update on posts
  for each row execute function public.stamp_owner_id();

-- A post can only reference an author that belongs to the same site.
create or replace function public.posts_author_same_site()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.author_id is null then
    return new;
  end if;
  if not exists (
    select 1 from authors
    where authors.id = new.author_id
      and authors.site_id = new.site_id
  ) then
    raise exception 'author must belong to the same site as the post';
  end if;
  return new;
end;
$$;

drop trigger if exists posts_author_same_site on posts;
create trigger posts_author_same_site
  before insert or update on posts
  for each row execute function public.posts_author_same_site();

-- (select auth.user_id()) is an InitPlan so the JWT sub is read once per query.
drop policy if exists "users manage their own sites" on sites;
create policy "users manage their own sites"
  on sites
  for all
  to authenticated
  using (owner_id = (select auth.user_id()))
  with check (owner_id = (select auth.user_id()));

drop policy if exists "users manage their own authors" on authors;
create policy "users manage their own authors"
  on authors
  for all
  to authenticated
  using (
    owner_id = (select auth.user_id())
    and exists (
      select 1 from sites
      where sites.id = authors.site_id
        and sites.owner_id = (select auth.user_id())
    )
  )
  with check (
    owner_id = (select auth.user_id())
    and exists (
      select 1 from sites
      where sites.id = authors.site_id
        and sites.owner_id = (select auth.user_id())
    )
  );

-- Own rows only, and only under a site the user owns. WITH CHECK also requires
-- that author_id (when set) is one of that user's authors on the same site, so
-- a post cannot be attached to another tenant's byline.
drop policy if exists "users manage their own posts" on posts;
create policy "users manage their own posts"
  on posts
  for all
  to authenticated
  using (
    owner_id = (select auth.user_id())
    and exists (
      select 1 from sites
      where sites.id = posts.site_id
        and sites.owner_id = (select auth.user_id())
    )
  )
  with check (
    owner_id = (select auth.user_id())
    and exists (
      select 1 from sites
      where sites.id = posts.site_id
        and sites.owner_id = (select auth.user_id())
    )
    and (
      author_id is null
      or exists (
        select 1 from authors
        where authors.id = posts.author_id
          and authors.site_id = posts.site_id
          and authors.owner_id = (select auth.user_id())
      )
    )
  );

-- Table owner (public SSR + seed). SELECT is published-only on posts so drafts
-- are invisible to DATABASE_URL. Writes stay available for `scripts/seed.mjs`.
drop policy if exists "owner reads sites" on sites;
create policy "owner reads sites"
  on sites for select to neondb_owner
  using (true);

drop policy if exists "owner writes sites" on sites;
create policy "owner writes sites"
  on sites for insert to neondb_owner
  with check (true);

drop policy if exists "owner updates sites" on sites;
create policy "owner updates sites"
  on sites for update to neondb_owner
  using (true) with check (true);

drop policy if exists "owner deletes sites" on sites;
create policy "owner deletes sites"
  on sites for delete to neondb_owner
  using (true);

drop policy if exists "owner reads authors" on authors;
create policy "owner reads authors"
  on authors for select to neondb_owner
  using (true);

drop policy if exists "owner writes authors" on authors;
create policy "owner writes authors"
  on authors for insert to neondb_owner
  with check (true);

drop policy if exists "owner updates authors" on authors;
create policy "owner updates authors"
  on authors for update to neondb_owner
  using (true) with check (true);

drop policy if exists "owner deletes authors" on authors;
create policy "owner deletes authors"
  on authors for delete to neondb_owner
  using (true);

drop policy if exists "owner reads published posts" on posts;
create policy "owner reads published posts"
  on posts for select to neondb_owner
  using (is_published);

drop policy if exists "owner writes posts" on posts;
create policy "owner writes posts"
  on posts for insert to neondb_owner
  with check (true);

drop policy if exists "owner updates posts" on posts;
create policy "owner updates posts"
  on posts for update to neondb_owner
  using (true) with check (true);

drop policy if exists "owner deletes posts" on posts;
create policy "owner deletes posts"
  on posts for delete to neondb_owner
  using (true);
