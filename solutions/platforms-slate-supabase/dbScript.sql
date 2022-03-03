create table site (
  id bigint not null primary key,
  name text,
  description text,
  logo json,
  image text,
  imageBlurhash text,
  subdomain text,
  createdAt timestamp default now(),
  updatedAt timestamp default now(),
  customDomain text,
  userId text,
  posts json
);

create table post (
  id bigint not null primary key,
  title text,
  description text,
  content json,
  slug text,
  image text,
  imageBlurhash text,
  createdAt timestamp default now(),
  updatedAt timestamp default now(),
  published boolean,
  siteId bigint references site (id)
);