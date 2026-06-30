'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockSettlement } from '../mock-data';

export default function AcertosPage() {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);

  const handleCopiarPix = async () => {
    await navigator.clipboard.writeText(mockSettlement.pixKeyValue);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 flex justify-between items-center w-full px-5 py-3 h-16 sticky top-0 z-50">
        <button
          onClick={() => router.back()}
          className="text-on-surface-variant hover:bg-slate-50 transition-colors active:opacity-70 flex items-center justify-center p-2 rounded-full"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-lg font-black text-primary-container">UniShare</span>
        <div className="w-10" />
      </header>

      <main className="max-w mx-auto px-container-padding py-lg flex flex-col gap-lg w-full">
        <section className="flex flex-col items-center justify-center text-center py-lg">
          <h1 className="font-display-title text-display-title text-on-surface mb-sm">Realizar Pagamento</h1>
          <p className="font-body-main text-body-main text-on-surface-variant">{mockSettlement.referenceLabel}</p>
        </section>

        <div className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col gap-lg w-full">
          <div className="flex items-center gap-md pb-md border-b border-surface-variant">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-card-title shadow-sm">
              {mockSettlement.creditorInitials}
            </div>
            <div>
              <h2 className="font-card-title text-card-title text-on-surface">{mockSettlement.creditorName}</h2>
              <p className="font-body-metadata text-body-metadata text-on-surface-variant">{mockSettlement.creditorUsername}</p>
            </div>
          </div>

          <div className="flex flex-col items-center py-sm">
            <span className="font-body-metadata text-body-metadata text-on-surface-variant mb-xs">Valor a pagar</span>
            <span className="font-currency-lg text-currency-lg text-primary">
              R$ {mockSettlement.amount.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-md w-full">
            <div className="flex flex-col gap-xs mb-md">
              <span className="font-body-metadata text-body-metadata text-on-surface-variant">{mockSettlement.pixKeyLabel}</span>
              <span className="font-body-main text-body-main text-on-surface font-medium break-all">{mockSettlement.pixKeyValue}</span>
            </div>
            <button
              onClick={handleCopiarPix}
              className="w-full h-12 bg-primary-container text-on-primary font-body-main text-body-main font-semibold rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">{copiado ? 'check' : 'content_copy'}</span>
              {copiado ? 'Copiado!' : 'Copiar Chave PIX'}
            </button>
          </div>
        </div>

        <div className="flex gap-md items-start p-md bg-inverse-on-surface rounded-xl w-full">
          <span className="material-symbols-outlined text-primary-container mt-xs">info</span>
          <p className="font-body-metadata text-body-metadata text-on-surface-variant">
            Depois de fazer a transferência, aguarde alguns minutos para a outra pessoa confirmar o recebimento no app e o saldo ser quitado.
          </p>
        </div>
      </main>
    </div>
  );
}