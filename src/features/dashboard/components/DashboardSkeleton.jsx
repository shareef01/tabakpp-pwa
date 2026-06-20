import React from 'react';
import { cn } from '../../../utils/system';
import { UI } from '../../../constants/ui';

const HEIGHT = {
  SMALL: 'min-h-[calc(var(--gauge-h)+8.5rem)]',
  MEDIUM: 'min-h-[calc(var(--gauge-h)+10rem)]',
  LARGE: 'min-h-[calc(var(--gauge-h)+11.5rem)]',
};

export const DashboardSkeleton = React.memo(({ widgetSize }) => (
  <div className="track-dashboard animate-pulse w-full">
    <div className={UI.TRACKER_GRID}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            UI.TRACKER_CARD,
            HEIGHT[widgetSize] || HEIGHT.MEDIUM
          )}
        />
      ))}
    </div>
    <div className="w-full max-w-[min(100%,64rem)] h-[clamp(4.5rem,14vw,7rem)] bg-neutral-800/10 border border-white/5 rounded-[24px] xs:rounded-[32px]" />
  </div>
));
