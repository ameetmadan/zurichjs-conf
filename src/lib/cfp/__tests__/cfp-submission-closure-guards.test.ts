import { describe, expect, it } from 'vitest';
import { canCreateSubmissionNow, canSubmitOrEditSubmission, getCfpCloseDate } from '../closure';

describe('submission closure guards', () => {
  it('blocks create after CFP close', () => {
    const closeDate = getCfpCloseDate();
    expect(canCreateSubmissionNow(new Date(closeDate.getTime() - 1))).toBe(true);
    expect(canCreateSubmissionNow(closeDate)).toBe(false);
  });

  it('blocks submit/edit after close without reopen window', () => {
    expect(canSubmitOrEditSubmission({}, new Date('2026-04-10T10:00:00.000Z'))).toBe(false);
  });

  it('allows submit/edit after close when reopen window is active', () => {
    const metadata = { reopen_until: '2026-04-10T12:00:00.000Z' };

    expect(canSubmitOrEditSubmission(metadata, new Date('2026-04-10T11:00:00.000Z'))).toBe(true);
    expect(canSubmitOrEditSubmission(metadata, new Date('2026-04-10T12:00:00.000Z'))).toBe(false);
  });
});
