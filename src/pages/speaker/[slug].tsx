import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Button, Heading, SocialIcon } from "@/components/atoms";
import { DayTabs } from "@/components/molecules";
import {
  SectionContainer,
  ShapedSection,
  SiteFooter,
} from "@/components/organisms";
import {
  addPublicConferenceToCalendar,
  addPublicEngineeringDayToCalendar,
} from "@/lib/calendar/public-events";
import {
  addPublicSessionToCalendar,
  getPublicSessionGoogleCalendarUrl,
} from "@/lib/calendar/public-session";
import { shareNatively } from "@/lib/native-share";
import { fetchPublicSpeakers } from "@/lib/queries/speakers";
import type { PublicSession, PublicSpeaker } from "@/lib/types/cfp";
import { BellPlus, CalendarPlus, Globe, Share2 } from "lucide-react";

interface SpeakerDetailPageProps {
  speaker: PublicSpeaker;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://conf.zurichjs.com";

function formatSessionDate(date: string | null) {
  if (!date) {
    return "Date TBA";
  }

  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatSessionDateTime(session: PublicSession) {
  const date = session.schedule?.date;
  const startTime = session.schedule?.start_time;

  if (!date) {
    return "Date TBA";
  }

  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );

  if (!startTime) {
    return formattedDate;
  }

  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date(`${date}T00:00:00`);
  startDate.setHours(hours, minutes, 0, 0);

  const duration = session.schedule?.duration_minutes ?? 0;
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate}, ${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)}`;
}

function formatDuration(durationMinutes: number | null) {
  if (!durationMinutes) {
    return "TBA";
  }

  return `${durationMinutes} minutes`;
}

function formatExpertise(level: PublicSession["level"]) {
  return `${level.charAt(0).toUpperCase()}${level.slice(1)}`;
}

function getSpeakerSocialLinks(speaker: PublicSpeaker) {
  const links: Array<{
    href?: string;
    label: string;
    icon: "linkedin" | "x" | "bluesky" | "instagram" | "website";
  }> = [];

  if (speaker.socials.linkedin_url) {
    links.push({
      href: speaker.socials.linkedin_url,
      label: "LinkedIn",
      icon: "linkedin",
    });
  } else {
    links.push({ label: "LinkedIn", icon: "linkedin" });
  }
  if (speaker.socials.twitter_handle) {
    links.push({
      href: `https://x.com/${speaker.socials.twitter_handle.replace(/^@/, "")}`,
      label: "X",
      icon: "x",
    });
  } else {
    links.push({ label: "X", icon: "x" });
  }
  if (speaker.socials.bluesky_handle) {
    links.push({
      href: `https://bsky.app/profile/${speaker.socials.bluesky_handle.replace(/^@/, "")}`,
      label: "Bluesky",
      icon: "bluesky",
    });
  } else {
    links.push({ label: "Bluesky", icon: "bluesky" });
  }
  links.push({ label: "Instagram", icon: "instagram" });
  links.push({ label: "Website", icon: "website" });

  return links;
}

export default function SpeakerDetailPage({ speaker }: SpeakerDetailPageProps) {
  const speakerName = [speaker.first_name, speaker.last_name]
    .filter(Boolean)
    .join(" ");
  const socialLinks = getSpeakerSocialLinks(speaker);
  const talkSessions = speaker.sessions.filter(
    (session) => session.type !== "workshop"
  );
  const workshopSessions = speaker.sessions.filter(
    (session) => session.type === "workshop"
  );
  const tabs = [
    ...(workshopSessions.length > 0
      ? [
          {
            id: "workshops",
            label: `${speakerName} Workshops`,
            date: formatSessionDate(
              workshopSessions[0]?.schedule?.date ?? null
            ),
          },
        ]
      : []),
    ...(talkSessions.length > 0
      ? [
          {
            id: "talks",
            label: `${speakerName} Talks`,
            date: formatSessionDate(talkSessions[0]?.schedule?.date ?? null),
          },
        ]
      : []),
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "talks");

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

  const visibleSessions =
    activeTab === "workshops" ? workshopSessions : talkSessions;
  const profileUrl = `${BASE_URL}/speaker/${speaker.slug}`;
  const handleReminder = () => {
    if (activeTab === "workshops") {
      addPublicEngineeringDayToCalendar();
      return;
    }

    addPublicConferenceToCalendar();
  };
  const handleShare = async () => {
    await shareNatively({
      title: `${speakerName} at ZurichJS Conference`,
      text: speaker.bio || `${speakerName} is speaking at ZurichJS Conference.`,
      url: profileUrl,
    });
  };
  const handleSessionCalendar = (session: PublicSession) => {
    const added = addPublicSessionToCalendar(session, "google", {
      speakerDetailUrl: profileUrl,
    });

    if (!added) {
      if (session.type === "workshop") {
        addPublicEngineeringDayToCalendar();
        return;
      }

      addPublicConferenceToCalendar();
    }
  };
  const handleSessionShare = async (session: PublicSession) => {
    await shareNatively({
      title: session.title,
      text: session.abstract,
      url: `${profileUrl}#session-${session.id}`,
    });
  };

  return (
    <>
      <SEO
        title={speakerName}
        description={`Speaker details for ${speakerName}.`}
        canonical={`/speaker/${speaker.slug}`}
        keywords={`zurichjs speaker, ${speakerName}`}
      />

      <main className="min-h-screen bg-brand-white">
        <section className="relative overflow-hidden pt-16 md:pt-20">
          <div className="absolute inset-0 bg-[#d9ddda]" aria-hidden="true" />
          <div
            className="absolute inset-y-0 right-0 w-full bg-brand-yellow-main md:w-[58%]"
            style={{ clipPath: "polygon(32% 0, 100% 0, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          />

          <SectionContainer className="relative pt-12 pb-0 md:pt-16 md:pb-0">
            <div className="grid px-[40px] items-end md:min-h-[520px] md:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] md:gap-12">
              <div className="relative flex min-h-[260px] items-end justify-center md:min-h-[440px] md:justify-start">
                <div className="relative left-10 top-[1px] z-10 h-[280px] w-[260px] md:translate-x-6 md:h-[430px] md:w-[400px]">
                  {speaker.profile_image_url ? (
                    <Image
                      src={speaker.profile_image_url}
                      alt={speakerName}
                      fill
                      className="object-contain object-bottom"
                      sizes="(max-width: 768px) 260px, 400px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-brand-gray-light text-6xl font-bold text-brand-black/70">
                      {speaker.first_name.charAt(0)}
                      {speaker.last_name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 flex flex-col items-center justify-end pb-6 text-center md:items-end md:pb-10 md:text-right">
                {speaker.company ? (
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-black/80">
                    {speaker.company}
                  </p>
                ) : null}
                <Heading
                  level="h1"
                  variant="light"
                  className="text-[48px] font-bold leading-none text-black"
                >
                  {speakerName}
                </Heading>
                {speaker.job_title ? (
                  <p className="mt-5 text-[34px] font-bold leading-tight text-black">
                    {speaker.job_title}
                  </p>
                ) : null}
                {speaker.company ? (
                  <p className=" text-[24px] leading-tight text-black">
                    @{speaker.company}
                  </p>
                ) : null}
                {socialLinks.length > 0 ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center pb-2 md:justify-end">
                    {socialLinks.map((social) => (
                      <span
                        key={`${social.icon}-${social.href}`}
                        className={`inline-flex items-center justify-center ${
                          social.href
                            ? "transition-opacity hover:opacity-65"
                            : ""
                        }`}
                      >
                        {social.icon === "website" ? (
                          social.href ? (
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              className="inline-flex h-10 w-10 items-center justify-center text-black"
                            >
                              <Globe className="size-5" />
                            </a>
                          ) : (
                            <span
                              className="inline-flex h-10 w-10 items-center justify-center text-black"
                              aria-hidden="true"
                            >
                              <Globe className="size-5" />
                            </span>
                          )
                        ) : (
                          <SocialIcon
                            kind={social.icon}
                            href={social.href || "#"}
                            label={social.label}
                            tone="dark"
                            className={social.href ? "" : "pointer-events-none"}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </SectionContainer>
        </section>

        <ShapedSection shape="straight" variant="light">
          <SectionContainer className="pb-16 md:pb-20">
            <div className="mx-auto max-w-screen-lg min-w-0 px-[40px]">
              {tabs.length > 0 ? (
                <>
                  <p className="text-base leading-8 text-brand-gray-darkest">
                    {speaker.bio ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. åDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum."}
                  </p>

                  <DayTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    color="yellow"
                    className="pt-10"
                  />
                </>
              ) : null}

              <section className="mt-8 space-y-6">
                <div className="space-y-4">
                  {visibleSessions.map((session) => (
                    <article
                      key={session.id}
                      className="rounded-3xl bg-brand-gray-lightest px-5 py-5 sm:px-6 sm:py-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-medium text-brand-gray-medium">
                          {formatSessionDateTime(session)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSessionCalendar(session)}
                          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-brand-gray-medium transition-colors hover:text-brand-black"
                          disabled={
                            !getPublicSessionGoogleCalendarUrl(session, {
                              speakerDetailUrl: profileUrl,
                            }) && !session.schedule?.date
                          }
                        >
                          <CalendarPlus className="size-4" />
                          Add to calendar
                        </button>
                      </div>
                      <h2 className="mt-2 text-[24px] font-bold leading-tight text-brand-black">
                        {session.title}
                      </h2>
                      <p className="mt-4 text-sm leading-6 text-brand-gray-darkest sm:text-base">
                        <strong className="font-semibold text-brand-black">
                          Duration:
                        </strong>{" "}
                        {formatDuration(
                          session.schedule?.duration_minutes ?? null
                        )}
                        <span className="mx-2 text-brand-black">&bull;</span>
                        <strong className="font-semibold text-brand-black">
                          Expertise:
                        </strong>{" "}
                        {formatExpertise(session.level)}
                        <span className="mx-2 text-brand-black">&bull;</span>
                        <strong className="font-semibold text-brand-black">
                          Stage:
                        </strong>{" "}
                        {session.schedule?.room || "TBA"}
                      </p>
                      <p className="mt-6 text-base leading-8 text-brand-gray-darkest">
                        {session.abstract}
                      </p>

                      {session.tags.length > 0 ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {session.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-brand-white px-3 py-1 text-sm text-brand-gray-medium "
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {session.type === "workshop" ? (
                        <div className="mt-6 flex flex-col-reverse gap-4 pt-6 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSessionCalendar(session)}
                              forceDark
                            >
                              <BellPlus className="size-4" />
                              <span className="font-bold">Set reminder</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSessionShare(session)}
                              forceDark
                            >
                              <Share2 className="size-4" />
                              <span className="font-bold">Share with...</span>
                            </Button>
                          </div>

                          <Button
                            variant="blue"
                            size="sm"
                            asChild
                            href="/workshops"
                          >
                            Book the workshop
                          </Button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>

              <section className="mt-14 rounded-3xl bg-brand-white px-6 py-8 text-center sm:px-8 sm:py-10">
                <h2 className="text-[24px] font-bold leading-tight text-brand-black">
                  Wanna make sure you get to talk to {speakerName}?
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-brand-gray-darkest">
                  VIP ticket holders get exclusive goodies, and get to join the
                  speaker activities, such as the city tour!
                </p>
                <p className="mt-8 text-base font-semibold leading-8 text-brand-black">
                  There are still 13 VIP tickets available, grab yours now!
                </p>
                <div className="mt-8 flex flex-col items-center gap-4">
                  <Button variant="primary" size="md" asChild href="/#tickets">
                    Get VIP
                  </Button>
                  <p className="text-sm text-brand-gray-darkest">...or?</p>
                  <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReminder}
                      forceDark
                    >
                      <BellPlus className="size-4" />
                      <span className="font-bold">Set reminder</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      forceDark
                    >
                      <Share2 className="size-4" />
                      <span className="font-bold">Share with...</span>
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </SectionContainer>
        </ShapedSection>

        <ShapedSection shape="straight" variant="dark" compactTop>
          <SiteFooter showContactLinks />
        </ShapedSection>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  SpeakerDetailPageProps
> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const { speakers } = await fetchPublicSpeakers();
  const speaker = speakers.find((entry) => entry.slug === slug);

  if (!speaker) {
    return { notFound: true };
  }

  return {
    props: {
      speaker,
    },
  };
};
