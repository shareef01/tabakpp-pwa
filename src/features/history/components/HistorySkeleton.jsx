import React from 'react';
import { UI } from '../../../constants/ui';
import { cn } from '../../../utils/system';

export const HistorySkeleton = () => (
  <div className="space-y-6 md:space-y-8 w-full max-w-6xl mx-auto pb-10 animate-pulse" aria-hidden="true">
    <div className={cn(UI.CARD, 'h-[280px] md:h-[320px]')} />
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
      <div className="lg:col-span-4 space-y-4">
        <div className={cn(UI.CARD, 'h-28')} />
        <div className={cn(UI.CARD, 'h-28')} />
        <div className={cn(UI.CARD, 'h-28')} />
      </div>
      <div className={cn(UI.CARD, 'lg:col-span-8 h-80')} />
    </div>
  </div>
);
