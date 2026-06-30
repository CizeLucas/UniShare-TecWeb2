'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Workspace {
  id: string;
  name: string;
  type: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  balance: number;
  blobColor: string;
}

const mockWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'República Central',
    type: 'Residência',
    icon: 'home',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    balance: -45.5,
    blobColor: 'bg-error-container',
  },
  {
    id: 'ws-2',
    name: 'Projeto Integrador',
    type: 'Universidade',
    icon: 'school',
    iconBg: 'bg-primary-container/10',
    iconColor: 'text-primary',
    balance: 120.0,
    blobColor: 'bg-emerald-100',
  },
  {
    id: 'ws-3',
    name: 'Viagem Fim de Ano',
    type: 'Lazer',
    icon: 'flight_takeoff',
    iconBg: 'bg-surface-container-highest',
    iconColor: 'text-on-surface-variant',
    balance: 0,
    blobColor: '',
  },
];

function formatBalance(balance: number): string {
  const abs = Math.abs(balance).toFixed(2).replace('.', ',');
  if (balance > 0) return `+ R$ ${abs}`;
  if (balance < 0) return `- R$ ${abs}`;
  return `R$ ${abs}`;
}

function balanceColor(balance: number): string {
  if (balance > 0) return 'text-emerald-600';
  if (balance < 0) return 'text-error';
  return 'text-on-surface-variant';
}

export default function WorkspacesPage() {
  const router = useRouter();

  return (
    <main className="pt-lg px-container-padding">
      <div className="flex justify-between items-end mb-lg">
        <h1 className="font-display-title text-display-title text-on-surface">Meus Ambientes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {mockWorkspaces.map((ws) => (
          <div
            key={ws.id}
            onClick={() => router.push(`/workspaces/${ws.id}`)}
            className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.05)]  flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow"
          >
            {ws.blobColor && (
              <div className={`absolute -top-10 -right-10 w-24 h-24 ${ws.blobColor} rounded-full blur-2xl opacity-50`} />
            )}

            <div className="flex justify-between items-start z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${ws.iconBg} flex items-center justify-center ${ws.iconColor}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {ws.icon}
                  </span>
                </div>
                <div>
                  <h2 className="font-card-title text-card-title text-on-surface">{ws.name}</h2>
                  <p className="font-body-metadata text-body-metadata text-on-surface-variant">{ws.type}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-end z-10">
              <div className="text-right">
                <p className="font-body-metadata text-body-metadata text-on-surface-variant mb-xs">Meu Saldo</p>
                <p className={`font-currency-lg text-currency-lg ${balanceColor(ws.balance)}`}>
                  {formatBalance(ws.balance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB — criar/entrar em workspace */}

      <Link
        href="/workspaces/novo"
        className="fixed bottom-[96px] right-container-padding w-14 h-14 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:bg-primary-container hover:scale-105 transition-all z-40"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>
    </main>
  );
}