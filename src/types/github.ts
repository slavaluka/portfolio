export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE';
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: GitHubContributionCalendar;
      };
    };
  };
}

export interface GitHubActivityResponse {
  totalContributions: number;
  weeks: {
    days: {
      date: string;
      count: number;
      level: 0 | 1 | 2 | 3 | 4;
    }[];
  }[];
}
