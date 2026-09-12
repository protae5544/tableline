-- ไลน์โต๊ะ shared workspace for two people

create table if not exists profiles (
  user_id text primary key,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists workspaces (
  id text primary key,
  name text not null,
  invite_code text not null unique,
  owner_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists workspace_members (
  workspace_id text not null,
  user_id text not null,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index if not exists workspace_members_user_idx on workspace_members (user_id);

create table if not exists messages (
  id serial primary key,
  workspace_id text not null,
  user_id text not null,
  body text not null,
  kind text not null default 'text',
  ref_id text,
  created_at timestamptz not null default now()
);
create index if not exists messages_ws_idx on messages (workspace_id, id);

create table if not exists folders (
  id serial primary key,
  workspace_id text not null,
  name text not null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id serial primary key,
  workspace_id text not null,
  folder_id int,
  title text not null,
  kind text not null,
  content text not null default '',
  mime text,
  created_by text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists documents_ws_idx on documents (workspace_id, updated_at);

create table if not exists reports (
  id serial primary key,
  workspace_id text not null,
  title text not null,
  work_date date not null,
  summary text not null default '',
  next_plan text not null default '',
  hours text,
  items text not null default '[]',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists boards (
  workspace_id text primary key,
  strokes text not null default '[]',
  notes text not null default '[]',
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists activities (
  id serial primary key,
  workspace_id text not null,
  user_id text not null,
  action text not null,
  detail text not null,
  created_at timestamptz not null default now()
);
create index if not exists activities_ws_idx on activities (workspace_id, id);
