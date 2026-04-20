import { analytics } from '@/lib/analytics';
import { addPublicConferenceToCalendar, addPublicEngineeringDayToCalendar } from '@/lib/calendar/public-events';
import { addPublicSessionToCalendar, getPublicSessionGoogleCalendarUrl } from '@/lib/calendar/public-session';
import { shareNatively } from '@/lib/native-share';
import type { PublicSession } from '@/lib/types/cfp';

export type SessionCalendarProvider = 'google' | 'outlook' | 'ics';

export function getCurrentSessionDetailUrl() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return `${window.location.origin}${window.location.pathname}`;
}

export function getSessionShareUrl(resolvedId?: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  const url = new URL(window.location.href);

  if (resolvedId) {
    url.hash = resolvedId;
  }

  return url.toString();
}

export function hasSessionCalendar(session: PublicSession, speakerDetailUrl?: string) {
  return Boolean(getPublicSessionGoogleCalendarUrl(session, { speakerDetailUrl }));
}

export function trackCalendarSelection(
  session: PublicSession,
  calendar: SessionCalendarProvider,
  entryType: 'session' | 'conference_day'
) {
  try {
    analytics.getInstance().capture('speaker_calendar_added', {
      calendar_provider: calendar,
      entry_type: entryType,
      session_id: session.id,
      session_title: session.title,
      session_type: session.type,
    });
  } catch {
    // Ignore analytics failures.
  }
}

export function addSessionOrEngineeringDayToCalendar(
  session: PublicSession,
  calendar: SessionCalendarProvider,
  speakerDetailUrl?: string
) {
  if (hasSessionCalendar(session, speakerDetailUrl)) {
    const added = addPublicSessionToCalendar(session, calendar, { speakerDetailUrl });
    if (added) {
      trackCalendarSelection(session, calendar, 'session');
    }
    return;
  }

  if (calendar === 'google') {
    const added = addPublicEngineeringDayToCalendar();
    if (added) {
      trackCalendarSelection(session, calendar, 'conference_day');
    }
  }
}

export function addConferenceReminder() {
  addPublicConferenceToCalendar();
}

export async function shareSession(session: PublicSession, resolvedId?: string) {
  const shareUrl = getSessionShareUrl(resolvedId);

  if (!shareUrl) {
    return;
  }

  await shareNatively({
    title: session.title,
    text: session.abstract,
    url: shareUrl,
  });
}
