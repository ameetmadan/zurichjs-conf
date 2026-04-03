import type { CfpSubmissionStatus } from '@/lib/types/cfp';

export function buildSubmissionMetadataForStatusUpdate(
  existingMetadata: unknown,
  status: CfpSubmissionStatus,
  reopenUntil: string | null = null
): Record<string, unknown> {
  const metadata =
    existingMetadata && typeof existingMetadata === 'object'
      ? { ...(existingMetadata as Record<string, unknown>) }
      : {};

  if (status === 'draft' && reopenUntil) {
    metadata.reopen_until = reopenUntil;
  } else {
    delete metadata.reopen_until;
  }

  return metadata;
}

