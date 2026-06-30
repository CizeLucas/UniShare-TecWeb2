'use client';

import { useState } from 'react';
import { mockBalances, mockExpenses } from './mock-data';
import { Expense } from './types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CATEGORIES: { value: Expense['tag']; label: string; icon: string }[] = [
  { value: 'ESSENCIAL', label: 'Essencial', icon: 'bolt' },
  { value: 'LAZER', label: 'Lazer', icon: 'shopping_bag' },
  { value: 'ALIMENTACAO', label: 'Alimentação', icon: 'restaurant' },
];

const TAG_STYLES: Record<Expense['tag'], { textClass: string; bgClass: string }> = {
  ESSENCIAL: { textClass: 'text-primary', bgClass: 'bg-primary/10' },
  LAZER: { textClass: 'text-tertiary-container', bgClass: 'bg-tertiary-container/10' },
  ALIMENTACAO: { textClass: 'text-tertiary-container', bgClass: 'bg-tertiary-container/10' },
};

export default function DashboardPage() {
    const params = useParams<{ id: string }>();
  const [tagFilter, setTagFilter] = useState<'ALL' | Expense['tag']>('ALL');

  const myBalance = mockBalances.find((b) => b.userId === '1');
  const isOwing = (myBalance?.balance ?? 0) < 0;

  const filteredExpenses = mockExpenses.filter(
    (e) => tagFilter === 'ALL' || e.tag === tagFilter
  );

  const handleFilterClick = (tag: Expense['tag']) => {
    setTagFilter((current) => (current === tag ? 'ALL' : tag));
  };

  return (
    <main className="px-container-padding max-w-4xl mx-auto space-y-lg pb-24">
      {/* Saldo */}
      <section className="bg-surface-container-lowest rounded-xl p-md level-1-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-bl-full pointer-events-none" />
        <div className="flex flex-col gap-sm">
          <span className="font-body-metadata text-on-surface-variant uppercase tracking-wider text-xs font-semibold">
            Saldo
          </span>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-md mt-sm">
            <div>
              <p className={`font-body-metadata mb-1 font-medium ${isOwing ? 'text-error' : 'text-on-surface-variant'}`}>
                {isOwing ? 'Você deve' : 'Você tem a receber'}
              </p>
              <h2 className={`font-currency-lg text-[32px] leading-tight ${isOwing ? 'text-error' : 'text-on-surface'}`}>
                R$ {Math.abs(myBalance?.balance ?? 0).toFixed(2).replace('.', ',')}
              </h2>
            </div>
            {isOwing && (
              <Link
                href={`/workspaces/${params.id}/acertos`}
                className="h-12 bg-primary text-on-primary font-body-main font-medium rounded-lg px-6 flex items-center justify-center gap-2 hover:bg-primary-container transition-colors w-full md:w-auto active:scale-95 duration-150"
              >                
                Pagar via PIX
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="flex gap-gutter overflow-x-auto pb-unit no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleFilterClick(cat.value)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-body-metadata font-medium border active:scale-95 transition-transform ${
              tagFilter === cat.value
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-surface-container-highest text-on-surface border-transparent hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </section>

      {/* Atividade recente */}
      <section className="bg-surface-container-lowest rounded-xl level-1-shadow overflow-hidden">
        <div className="p-md border-b border-surface-variant flex justify-between items-center">
          <h3 className="font-card-title text-on-surface">Atividade recente</h3>
          <a className="font-body-metadata text-primary font-medium hover:underline" href="#">
            Ver tudo
          </a>
        </div>
        <div className="flex flex-col">
          {filteredExpenses.map((expense, index) => {
            const tagStyle = TAG_STYLES[expense.tag];
            const categoryInfo = CATEGORIES.find((c) => c.value === expense.tag);
            const icon = expense.icon ?? categoryInfo?.icon;
            const isLast = index === filteredExpenses.length - 1;

            return (
              <div
                key={expense.id}
                className={`flex items-center justify-between p-md hover:bg-surface-container-low transition-colors group cursor-pointer ${
                  isLast ? '' : 'border-b border-surface-variant'
                }`}
              >
                <div className="flex items-center gap-md">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${tagStyle.bgClass} ${tagStyle.textClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>
                  <div>
                    <p className="font-body-main text-on-surface font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-sm ${tagStyle.bgClass} ${tagStyle.textClass}`}>
                        {categoryInfo?.label}
                      </span>
                      <span className="font-body-metadata text-on-surface-variant text-[12px]">{expense.timeLabel}</span>
                    </div>
                  </div>
                </div>
                <p className="font-currency-sm text-error font-medium">
                  - R$ {expense.amount.toFixed(2).replace('.', ',')}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}