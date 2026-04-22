import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeRange } from './utils';

export interface PlaceholderCardProps {
  id?: string;
  title?: string;
  startTime?: string | null;
  durationMinutes: number;
  variant?: 'plain' | 'slot';
  className?: string;
}

export function PlaceholderCard({
  id,
  title = 'TBA',
  startTime,
  durationMinutes,
  variant = 'slot',
  className,
}: PlaceholderCardProps) {
  const timeRange = formatTimeRange(startTime, durationMinutes);

  if (variant === 'plain') {
    return (
      <article id={id} className={cn('rounded-2xl px-3 py-2', className)}>
        {timeRange ? <p className="text-sm text-brand-gray-medium">{timeRange}</p> : null}
        <h3 className="mt-1 text-lg font-bold leading-tight text-brand-black">{title}</h3>
      </article>
    );
  }

  return (
    <article
      id={id}
      className={cn('rounded-2xl border border-brand-gray-lightest bg-brand-gray-lightest p-5', className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {timeRange ? <p className="text-sm text-brand-gray-medium">{timeRange}</p> : null}
          <h3 className="mt-1 text-lg font-bold leading-tight text-brand-black">{title}</h3>
        </div>
        <ChevronRight className="mt-1 size-5 shrink-0 text-brand-black" />
      </div>
    </article>
  );
}
