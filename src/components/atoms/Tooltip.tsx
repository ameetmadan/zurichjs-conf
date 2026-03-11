/**
 * Tooltip Component
 * CSS-only tooltip using group-hover, no JS state needed
 * Works on desktop (hover) and is accessible
 */

import { type ReactNode } from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: TooltipPosition;
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`absolute ${positionClasses[position]} px-3 py-2 bg-gray-900 text-xs text-white rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-normal w-48 max-w-[calc(100vw-2rem)] pointer-events-none z-50 shadow-lg`}
      >
        {content}
      </span>
    </span>
  );
}
