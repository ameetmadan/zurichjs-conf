import { describe, expect, it } from 'vitest';
import {
  getCfpCloseDate,
  isCfpClosed,
  isSubmissionReopenActive,
  isCfpClosedForSubmission,
} from '../closure';

describe('CFP closure timing', () => {
  it('is open just before close and closed at close timestamp', () => {
    const closeDate = getCfpCloseDate();
    const justBeforeClose = new Date(closeDate.getTime() - 1);

    expect(isCfpClosed(justBeforeClose)).toBe(false);
    expect(isCfpClosed(closeDate)).toBe(true);
  });
});

describe('submission reopen window', () => {
  it('treats reopen window as active only when now is strictly before reopen_until', () => {
    const now = new Date('2026-04-10T12:00:00.000Z');
    const metadata = { reopen_until: '2026-04-10T12:30:00.000Z' };

    expect(isSubmissionReopenActive(metadata, now)).toBe(true);
    expect(isSubmissionReopenActive(metadata, new Date('2026-04-10T12:30:00.000Z'))).toBe(false);
  });

  it('marks submission as closed when CFP is closed and no active reopen window', () => {
    const now = new Date('2026-04-10T12:00:00.000Z');

    expect(isCfpClosedForSubmission({}, now)).toBe(true);
    expect(
      isCfpClosedForSubmission({ reopen_until: '2026-04-10T12:30:00.000Z' }, now)
    ).toBe(false);
  });
});

