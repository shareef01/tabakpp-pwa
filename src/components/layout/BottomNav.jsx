import React from 'react';
import { LayoutDashboard, ChartColumn, Settings2 } from 'lucide-react';
import { cn } from '../../utils/system';
import { UI } from '../../constants/ui';
import { ROUTES } from '../../constants/routes';

const TABS = [
  { id: 'track', path: ROUTES.TRACK, label: 'Track', icon: LayoutDashboard },
  { id: 'history', path: ROUTES.HISTORY, label: 'History', icon: ChartColumn },
  { id: 'control', path: ROUTES.SETTINGS, label: 'Settings', icon: Settings2 },
];

const NavItem = React.memo(({ icon: Icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-current={active ? 'page' : undefined}
    className={cn(
      'nav-dock-btn relative z-10 flex flex-1 items-center justify-center h-11 rounded-full transition-all duration-200 active:scale-90',
      active ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'
    )}
  >
    <Icon
      size={22}
      strokeWidth={active ? 2.5 : 2}
      className={cn(
        'shrink-0 transition-all duration-200',
        active && 'drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.45)]'
      )}
    />
  </button>
));

export const BottomNav = React.memo(({ activeTab, onNavigate }) => {
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  return (
    <div className={UI.NAV_BAR_DOCK}>
      <nav className={UI.NAV_BAR_INNER} aria-label="Main navigation">
        <div
          className="nav-dock-indicator absolute top-1 bottom-1 rounded-full bg-accent/10 ring-1 ring-accent/20 shadow-[0_0_16px_-4px_rgba(var(--accent-rgb),0.35)] transition-[left,width] duration-300 ease-out pointer-events-none"
          style={{
            width: `calc((100% - 0.5rem) / ${TABS.length})`,
            left: `calc(0.25rem + ${activeIndex} * ((100% - 0.5rem) / ${TABS.length}))`,
          }}
          aria-hidden="true"
        />
        {TABS.map((tab) => (
          <NavItem
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onNavigate(tab.path)}
          />
        ))}
      </nav>
    </div>
  );
});
