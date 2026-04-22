/**
 * Speakers Section
 * Displays featured speakers with clean, simple cards
 * Always horizontally scrollable on all screen sizes
 */

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { publicSpeakersQueryOptions } from '@/lib/queries/speakers';

export interface SpeakersSectionProps {
  className?: string;
}

interface SpeakerCardProps {
  name: string;
  title: string;
  avatarUrl: string;
  href: string;
}

function SpeakerCard({ name, title, avatarUrl, href }: SpeakerCardProps) {
  const hasTextContent = name.trim() || title.trim();

  return (
    <Link
      href={href}
      aria-label={name ? `View ${name}'s speaker profile` : 'View speaker profile'}
      className="group flex-shrink-0 w-[240px] sm:w-[220px] md:w-[240px] lg:w-[230px] xl:w-[260px] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-black focus-visible:ring-offset-2 focus-visible:ring-offset-brand-white"
    >
      <div className="relative rounded-2xl overflow-hidden bg-brand-primary">
        {/* Image container */}
        <div className="aspect-[3/4] relative">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt={name ? `${name} avatar` : 'Speaker avatar'}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 240px, (max-width: 768px) 220px, (max-width: 1024px) 240px, (max-width: 1280px) 230px, 260px"
              draggable={false}
            />
          )}
          {/* Gradient overlay for text readability - only show when there's text content */}
          {hasTextContent && (
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
          )}
        </div>

        {/* Text content - only show when name or title exists */}
        {hasTextContent && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
            {name.trim() && <h3 className="text-white font-bold text-base leading-tight mb-1">{name}</h3>}
            {title.trim() && <p className="text-brand-primary text-sm opacity-90 leading-tight line-clamp-2 min-h-[2.5em]">{title}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}

function SpeakerCardSkeleton() {
  return (
    <div
      className="flex-shrink-0 w-[240px] sm:w-[220px] md:w-[240px] lg:w-[230px] xl:w-[260px] rounded-2xl"
      aria-hidden="true"
    >
      <div className="relative rounded-2xl overflow-hidden bg-brand-primary">
        <div className="aspect-[3/4] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-[#f7ec96] to-[#d9c856]" />
          <div className="absolute inset-0 animate-pulse bg-white/20" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mx-auto mb-2 h-4 w-28 rounded-full bg-white/80" />
          <div className="mx-auto h-3 w-36 rounded-full bg-white/45" />
        </div>
      </div>
    </div>
  );
}

function SpeakerCardsSkeleton() {
  return (
    <div className="w-full" aria-label="Loading featured speakers">
      <div className="overflow-x-auto overscroll-x-contain scrollbar-hide">
        <div className="flex gap-4 md:gap-6 pb-4 px-4 md:px-8 w-max min-w-full justify-start lg:justify-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <SpeakerCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SpeakersSection({ className = '' }: SpeakersSectionProps) {
  const { data, isLoading } = useQuery(publicSpeakersQueryOptions({ featured: true }));

  const speakers = (data?.speakers || []).filter((speaker) => speaker.is_featured);

  // Sort speakers so those with names come first
  const sortedSpeakers = [...speakers].sort((a, b) => {
    const aHasName = Boolean(a.first_name?.trim() || a.last_name?.trim());
    const bHasName = Boolean(b.first_name?.trim() || b.last_name?.trim());
    if (aHasName && !bHasName) return -1;
    if (!aHasName && bHasName) return 1;
    return 0;
  });

  if (isLoading && speakers.length === 0) {
    return <SpeakerCardsSkeleton />;
  }

  if (speakers.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Always horizontally scrollable */}
      <div className="overflow-x-auto overscroll-x-contain scrollbar-hide">
        <div className="flex gap-4 md:gap-6 pb-4 px-4 md:px-8 w-max min-w-full justify-start lg:justify-center">
          {sortedSpeakers.slice(0, 5).map((speaker) => {
            const fullName = [speaker.first_name, speaker.last_name].filter(Boolean).join(' ');
            const titleWithCompany = [speaker.job_title, speaker.company].filter(Boolean).join(' @ ');

            return (
              <SpeakerCard
                key={speaker.id}
                name={fullName}
                title={titleWithCompany}
                avatarUrl={speaker.profile_image_url || ''}
                href={`/speakers/${speaker.slug}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
