/**
 * CFP closure and reopen window helpers.
 */

import { timelineData } from '@/data/timeline';

// take over from shared dates.
const CFP_ENDS_DATE_ISO =
  timelineData.entries.find((entry) => entry.id === 'cfp-ends')?.dateISO ?? '2026-04-03';
// end of that date in CEST
const CFP_CLOSES_AT_UTC = `${CFP_ENDS_DATE_ISO}T21:59:59.000Z`;
// time in ms
const CFP_CLOSES_AT_MS = new Date(CFP_CLOSES_AT_UTC).getTime();

export const CFP_MEETUP_CFP_URL = 'https://www.zurichjs.com/cfp?utm_source=conf&utm_medium=confwebsite';
export const CFP_CLOSED_ERROR_CODE = 'CFP_CLOSED';

export interface CfpSubmissionMetadata {
  reopen_until?: string;
  [key: string]: unknown;
}

export function getCfpCloseDate(): Date {
  return new Date(CFP_CLOSES_AT_UTC);
}

export function isCfpClosed(now: Date = new Date()): boolean {
  return now.getTime() >= CFP_CLOSES_AT_MS;
}

export function getReopenUntilFromMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object') {
    return null;
  }

  const reopenUntil = (metadata as CfpSubmissionMetadata).reopen_until;
  if (typeof reopenUntil !== 'string' || reopenUntil.trim().length === 0) {
    return null;
  }

  return reopenUntil;
}

export function isSubmissionReopenActive(metadata: unknown, now: Date = new Date()): boolean {
  const reopenUntil = getReopenUntilFromMetadata(metadata);
  if (!reopenUntil) {
    return false;
  }

  const reopenAt = new Date(reopenUntil);
  if (Number.isNaN(reopenAt.getTime())) {
    return false;
  }

  return now.getTime() < reopenAt.getTime();
}

function hasBeenSubmitted(submission: { submitted_at?: string | null }): boolean {
  return typeof submission.submitted_at === 'string' && submission.submitted_at.length > 0;
}

export function isCfpClosedForSubmission(metadata: unknown, now: Date = new Date()): boolean {
  if (!isCfpClosed(now)) {
    return false;
  }

  return !isSubmissionReopenActive(metadata, now);
}

export function canCreateSubmissionNow(now: Date = new Date()): boolean {
  return !isCfpClosed(now);
}

export function canSubmitOrEditSubmission(
  submission: { metadata?: unknown; submitted_at?: string | null },
  now: Date = new Date()
): boolean {
  if (!isCfpClosed(now)) {
    return true;
  }

  // After close: only previously submitted talks can be temporarily reopened.
  if (!hasBeenSubmitted(submission)) {
    return false;
  }

  return isSubmissionReopenActive(submission.metadata, now);
}

export function isSubmissionClosedForSpeaker(
  submission: { metadata?: unknown; submitted_at?: string | null },
  now: Date = new Date()
): boolean {
  return !canSubmitOrEditSubmission(submission, now);
}
