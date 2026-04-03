import { describe, expect, it } from 'vitest';
import { updateSubmissionStatusSchema } from '@/lib/validations/cfp';
import { buildSubmissionMetadataForStatusUpdate } from '../admin-status';

describe('admin reopen status payload', () => {
  it('accepts draft + reopen_until', () => {
    const result = updateSubmissionStatusSchema.safeParse({
      status: 'draft',
      reopen_until: '2026-04-20T12:00:00.000Z',
    });

    expect(result.success).toBe(true);
  });

  it('rejects reopen_until for non-draft statuses', () => {
    const result = updateSubmissionStatusSchema.safeParse({
      status: 'submitted',
      reopen_until: '2026-04-20T12:00:00.000Z',
    });

    expect(result.success).toBe(false);
  });
});

describe('admin metadata merge for status updates', () => {
  it('stores reopen_until for draft status', () => {
    const metadata = buildSubmissionMetadataForStatusUpdate(
      { source: 'admin' },
      'draft',
      '2026-04-20T12:00:00.000Z'
    );

    expect(metadata).toMatchObject({
      source: 'admin',
      reopen_until: '2026-04-20T12:00:00.000Z',
    });
  });

  it('removes reopen_until when status is not draft', () => {
    const metadata = buildSubmissionMetadataForStatusUpdate(
      { reopen_until: '2026-04-20T12:00:00.000Z', source: 'admin' },
      'under_review',
      null
    );

    expect(metadata).toMatchObject({ source: 'admin' });
    expect('reopen_until' in metadata).toBe(false);
  });
});
