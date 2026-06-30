'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/workspaces', label: 'Workspaces', icon: 'group' },
  { href: '/profile', label: 'Profile', icon: 'person' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-background min-h-screen pb-32 md:pb-0">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 flex justify-between items-center w-full px-5 py-3 h-16 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
          <span className="text-lg font-black text-primary font-display-title">UniShare</span>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-slate-50 cursor-pointer transition-colors">
          notifications
        </span>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-16 bg-surface-container-lowest border-r border-outline-variant/30 pt-lg px-md gap-2 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-body-main text-body-main ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </aside>

      {/* Conteúdo com margem da sidebar no desktop */}
      <div className="md:ml-64">{children}</div>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl text-[11px] font-medium transition-transform duration-150 scale-95 active:scale-90 ${
                isActive ? 'text-primary bg-primary/5' : 'text-outline hover:text-primary'
              }`}
            >
              <span
                className="material-symbols-outlined mb-1"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}