/**
 * Status Actions Section Component
 * Displays status update buttons for submissions
 */

import { Star, Check, Clock, X, Eye } from 'lucide-react';
import { STATUS_ACTIONS } from '@/lib/types/cfp-admin';
import { isCfpClosed } from '@/lib/cfp/closure';

interface StatusActionsSectionProps {
  currentStatus: string;
  onUpdateStatus: (status: string, reopenUntil?: string | null) => void;
  isUpdating: boolean;
  reopenUntilInput: string;
  onReopenUntilInputChange: (value: string) => void;
}

const PRIMARY_ACTIONS = [
  {
    status: 'shortlisted',
    icon: Star,
    activeClass: 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500',
    defaultClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
  {
    status: 'accepted',
    icon: Check,
    activeClass: 'bg-green-100 text-green-800 border-2 border-green-500',
    defaultClass: 'bg-green-600 hover:bg-green-700 text-white',
  },
  {
    status: 'waitlisted',
    icon: Clock,
    activeClass: 'bg-orange-100 text-orange-800 border-2 border-orange-500',
    defaultClass: 'bg-orange-600 hover:bg-orange-700 text-white',
  },
  {
    status: 'rejected',
    icon: X,
    activeClass: 'bg-red-100 text-red-800 border-2 border-red-500',
    defaultClass: 'bg-red-600 hover:bg-red-700 text-white',
  },
  {
    status: 'under_review',
    icon: Eye,
    activeClass: 'bg-purple-100 text-purple-800 border-2 border-purple-500',
    defaultClass: 'border border-gray-300 hover:bg-gray-50 text-black',
  },
];

export function StatusActionsSection({
  currentStatus,
  onUpdateStatus,
  isUpdating,
  reopenUntilInput,
  onReopenUntilInputChange,
}: StatusActionsSectionProps) {
  const cfpClosed = isCfpClosed();

  const handleReopenWithWindow = () => {
    if (!reopenUntilInput) return;

    const reopenDate = new Date(reopenUntilInput);
    if (Number.isNaN(reopenDate.getTime())) return;

    onUpdateStatus('draft', reopenDate.toISOString());
  };

  return (
    <>
      {/* Primary Status Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-4">Update Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRIMARY_ACTIONS.map(({ status, icon: Icon, activeClass, defaultClass }) => {
            const isActive = currentStatus === status;
            const action = STATUS_ACTIONS[status];
            return (
              <div key={status} className="flex flex-col">
                <button
                  onClick={() => onUpdateStatus(status)}
                  disabled={isUpdating || isActive}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center cursor-pointer ${
                    isActive ? activeClass : defaultClass
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {action?.action || status}
                </button>
                <p className="text-xs text-gray-500 mt-1.5 text-center">{action?.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-xs font-bold text-black uppercase tracking-wide mb-4">Other Actions</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentStatus !== 'draft' && (
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <h5 className="text-sm font-semibold text-black">Reopen for Speaker Edits</h5>
              <p className="text-xs text-gray-600">
                Set a temporary edit window, then move this submission back to draft so the speaker can edit and re-submit.
              </p>
              <div>
                <label htmlFor="reopen-until" className="text-xs text-gray-700 font-medium block mb-1">
                  Reopen Until
                </label>
                <input
                  id="reopen-until"
                  type="datetime-local"
                  value={reopenUntilInput}
                  onChange={(e) => onReopenUntilInputChange(e.target.value)}
                  className="px-2 py-1.5 text-sm border border-gray-300 rounded-md text-black w-full"
                />
              </div>
              <button
                onClick={handleReopenWithWindow}
                disabled={isUpdating || !reopenUntilInput}
                className="w-full px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Revert to Draft + Reopen Window
              </button>
              <p className="text-xs text-gray-500">
                Recommended when CFP is closed.
              </p>

              {!cfpClosed && (
                <div className="pt-3 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => onUpdateStatus('draft', null)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-gray-300 hover:bg-gray-50 text-black text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Revert to Draft (No Reopen Window)
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    {STATUS_ACTIONS.draft?.description}
                  </p>
                </div>
              )}
              {cfpClosed && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                  Plain draft revert is hidden while CFP is closed to avoid locking the speaker out.
                </p>
              )}
            </div>
          )}
          {currentStatus !== 'withdrawn' && (
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <h5 className="text-sm font-semibold text-black">Mark as Withdrawn</h5>
              <p className="text-xs text-gray-600">{STATUS_ACTIONS.withdrawn?.description}</p>
              <button
                onClick={() => onUpdateStatus('withdrawn')}
                disabled={isUpdating}
                className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Mark as Withdrawn
              </button>
            </div>
          )}
          {currentStatus === 'draft' && (
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-600">
                Submission is already in draft. Use the status buttons above to move it forward.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
