'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();
  const isDashboard = pathname === `/workspaces/${id}`;
  const isNovaDespesa = pathname === `/workspaces/${id}/despesas/nova`;
  const isAcertos = pathname === `/workspaces/${id}/acertos`;

  if (isNovaDespesa) {
    return <>{children}</>;
  }

  const hideGlobalHeader = isAcertos;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-0">
      {!hideGlobalHeader && (
        <>
          {/* Cabeçalho desktop */}
          <header className="hidden md:flex justify-between items-center w-full px-5 py-3 h-16 bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <span className="text-lg font-black text-primary font-display-title">UniShare</span>
            </div>
            <nav className="flex gap-6">
              <Link
                href={`/workspaces/${id}`}
                className={isDashboard ? 'text-primary font-body-main font-semibold' : 'text-on-surface-variant font-body-main hover:bg-slate-50 transition-colors px-2 rounded'}
              >
                Dashboard
              </Link>
              <Link href="/workspaces" className="text-on-surface-variant font-body-main hover:bg-slate-50 transition-colors px-2 rounded">
                Workspaces
              </Link>
              <Link href="/profile" className="text-on-surface-variant font-body-main hover:bg-slate-50 transition-colors px-2 rounded">
                Profile
              </Link>
            </nav>
            <Link href={`/workspaces/${id}/acertos`} className="text-on-surface-variant hover:bg-slate-50 p-2 rounded-full transition-colors active:opacity-70">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
          </header>

          {/* Cabeçalho mobile */}
          <header className="md:hidden flex justify-between items-center w-full px-5 py-3 h-16 bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
              <span className="text-lg font-black text-primary font-display-title">UniShare</span>
            </div>
            <Link href={`/workspaces/${id}/acertos`} className="text-on-surface-variant p-2 rounded-full active:opacity-70 transition-opacity">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
          </header>
        </>
      )}

      <div className={hideGlobalHeader ? '' : 'pt-[88px]'}>{children}</div>

      {/* Navegação inferior (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl">
        <Link
          href={`/workspaces/${id}`}
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-transform duration-150 ${
            isDashboard ? 'text-primary bg-primary-fixed-dim/20' : 'text-outline hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={isDashboard ? { fontVariationSettings: "'FILL' 1" } : undefined}>
            grid_view
          </span>
          <span className="text-[11px] font-medium font-body-main mt-1">Dashboard</span>
        </Link>
        <Link href="/workspaces" className="flex flex-col items-center justify-center text-outline px-3 py-1 hover:text-primary transition-transform duration-150">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[11px] font-medium font-body-main mt-1">Workspaces</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center justify-center text-outline px-3 py-1 hover:text-primary transition-transform duration-150">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[11px] font-medium font-body-main mt-1">Profile</span>
        </Link>
      </nav>

      {/* Botão flutuante: nova despesa */}
      <Link
        href={`/workspaces/${id}/despesas/nova`}
        className="fixed bottom-28 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 z-[60] group"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
          Lançar Despesa
        </span>
      </Link>
    </div>
  );
}