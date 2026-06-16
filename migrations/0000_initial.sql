CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  github_repo TEXT NOT NULL,
  cf_project_name TEXT NOT NULL,
  deploy_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  theme TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
