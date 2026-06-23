// Cloudflare worker runtime bindings / secrets (set in the Cloudflare dashboard or `.dev.vars`).
interface Env {
  GITHUB_TOKEN: string;
  GITHUB_USERNAME: string;
}

declare module 'cloudflare:workers' {
  export const env: Env;
}
