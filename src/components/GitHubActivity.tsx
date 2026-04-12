import { Fragment, useState } from 'react';
import useSWR from 'swr';

import type { GitHubActivityResponse } from '@/types/github';

const LEVEL_COLORS: Record<number, string> = {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = [
  { index: 1, label: 'Mon' },
  { index: 3, label: 'Wed' },
  { index: 5, label: 'Fri' },
];

const fetcher = async (...args: Parameters<typeof fetch>): Promise<GitHubActivityResponse> => {
  const res = await fetch(...args);
  if (!res.ok) throw new Error(`Failed to fetch GitHub activity. Status: ${res.status}`);
  return res.json();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  const month = MONTH_LABELS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const GitHubActivity = () => {
  const { data } = useSWR<GitHubActivityResponse>('/api/github', fetcher, {
    refreshInterval: 3600000,
    onError: (error: Error) => {
      console.error('Error fetching GitHub data:', error);
    },
  });

  if (!data || data.weeks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="caption">
        {data.totalContributions.toLocaleString()} contributions in the last year
      </p>
      <HeatmapGrid weeks={data.weeks} />
    </div>
  );
};

export default GitHubActivity;

const HeatmapGrid = ({ weeks }: { weeks: GitHubActivityResponse['weeks'] }) => {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="relative overflow-x-auto">
      <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(${weeks.length}, 1fr)` }}>
        {/* Month labels row */}
        <div />
        {weeks.map((_, weekIndex) => {
          const label = monthLabels.get(weekIndex);
          return (
            <div key={`month-${weekIndex}`} className="text-xs text-zinc-500 h-4 leading-4">
              {label ?? ''}
            </div>
          );
        })}

        {/* Day rows (0=Sun, 1=Mon, ..., 6=Sat) */}
        {Array.from({ length: 7 }, (_, dayIndex) => (
          <Fragment key={`row-${dayIndex}`}>
            <div className="text-xs text-zinc-500 pr-2 h-[13px] leading-[13px] flex items-center">
              {DAY_LABELS.find((d) => d.index === dayIndex)?.label ?? ''}
            </div>
            {weeks.map((week, weekIndex) => {
              const day = week.days[dayIndex];
              if (!day) return <div key={`empty-${weekIndex}-${dayIndex}`} />;
              return (
                <div
                  key={`${day.date}`}
                  className="w-[13px] h-[13px] rounded-sm cursor-pointer"
                  style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      text: `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${formatDate(day.date)}`,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-zinc-100 bg-zinc-800 rounded shadow-lg pointer-events-none whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

const getMonthLabels = (weeks: GitHubActivityResponse['weeks']): Map<number, string> => {
  const labels = new Map<number, string>();
  let lastMonth = -1;

  for (let i = 0; i < weeks.length; i++) {
    const firstDay = weeks[i].days[0];
    if (!firstDay) continue;
    const month = new Date(firstDay.date + 'T00:00:00').getMonth();
    if (month !== lastMonth) {
      labels.set(i, MONTH_LABELS[month]);
      lastMonth = month;
    }
  }

  return labels;
};
