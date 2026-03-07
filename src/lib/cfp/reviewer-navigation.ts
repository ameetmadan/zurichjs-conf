interface ReviewerNavigationSnapshot {
  dashboardParams: string;
  submissionIds: string[];
}

const REVIEWER_NAVIGATION_STORAGE_KEY = 'cfp-reviewer-navigation';

function normalizeDashboardParams(dashboardParams?: string | null) {
  return (dashboardParams ?? '').replace(/^\?/, '');
}

export function saveReviewerNavigationSnapshot({
  dashboardParams,
  submissionIds,
}: ReviewerNavigationSnapshot) {
  if (typeof window === 'undefined') return;

  try {
    const snapshot: ReviewerNavigationSnapshot = {
      dashboardParams: normalizeDashboardParams(dashboardParams),
      submissionIds,
    };

    window.sessionStorage.setItem(REVIEWER_NAVIGATION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Silently fail if sessionStorage is unavailable.
  }
}

export function getNextReviewerSubmissionId(
  currentSubmissionId: string,
  dashboardParams?: string | null
) {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.sessionStorage.getItem(REVIEWER_NAVIGATION_STORAGE_KEY);
    if (!stored) return null;

    const snapshot = JSON.parse(stored) as ReviewerNavigationSnapshot;
    if (normalizeDashboardParams(snapshot.dashboardParams) !== normalizeDashboardParams(dashboardParams)) {
      return null;
    }

    const currentIndex = snapshot.submissionIds.indexOf(currentSubmissionId);
    if (currentIndex === -1) return null;

    return snapshot.submissionIds[currentIndex + 1] ?? null;
  } catch {
    return null;
  }
}
