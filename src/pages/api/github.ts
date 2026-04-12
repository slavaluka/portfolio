import type { APIRoute } from 'astro';

import type { GitHubActivityResponse, GitHubGraphQLResponse } from '@/types/github';

export const prerender = false;

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const GITHUB_USERNAME = 'slavaluka';

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const query = `
  query ($userName: String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const cacheHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
};

export const GET: APIRoute = async () => {
  const token = import.meta.env.GITHUB_TOKEN;

  if (!token) {
    console.error('Missing GITHUB_TOKEN environment variable.');
    return new Response(JSON.stringify({ totalContributions: 0, weeks: [] }), {
      status: 200,
      headers: cacheHeaders,
    });
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { userName: GITHUB_USERNAME } }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('GitHub GraphQL error:', res.status, error);
      return new Response(JSON.stringify({ totalContributions: 0, weeks: [] }), {
        status: 200,
        headers: cacheHeaders,
      });
    }

    const json = (await res.json()) as GitHubGraphQLResponse;

    if (!json.data) {
      console.error('GitHub GraphQL error:', JSON.stringify(json));
      return new Response(JSON.stringify({ totalContributions: 0, weeks: [] }), {
        status: 200,
        headers: cacheHeaders,
      });
    }

    const calendar = json.data!.user.contributionsCollection.contributionCalendar;

    const response: GitHubActivityResponse = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVEL_MAP[day.contributionLevel] ?? 0,
        })),
      })),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: cacheHeaders,
    });
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    return new Response(JSON.stringify({ totalContributions: 0, weeks: [] }), {
      status: 200,
      headers: cacheHeaders,
    });
  }
};
