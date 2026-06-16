/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  DB: D1Database;
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  TEMPLATE_REPO: string;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
