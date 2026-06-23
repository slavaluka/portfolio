import { env } from 'cloudflare:workers';
import type { APIRoute } from 'astro';

export const prerender = false;

// TEMPORARY diagnostic endpoint. Reports binding presence + live GitHub status (no secret values). Remove after debugging.
export const GET: APIRoute = async () => {
  const token = env.GITHUB_TOKEN ?? import.meta.env.GITHUB_TOKEN;
  const username = env.GITHUB_USERNAME ?? import.meta.env.GITHUB_USERNAME;

  let githubStatus: number | null = null;
  let githubBody: string | null = null;

  if (token && username) {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': username,
      },
      body: JSON.stringify({ query: '{ viewer { login } }' }),
    });
    githubStatus = res.status;
    githubBody = (await res.text()).slice(0, 200);
  }

  return new Response(
    JSON.stringify({
      hasToken: Boolean(token),
      tokenLength: token ? String(token).length : 0,
      hasUsername: Boolean(username),
      username: username ?? null,
      githubStatus,
      githubBody,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
