'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMembers } from '../../mock-data';

type Categoria = 'ESSENCIAL' | 'LAZER';
type TipoDivisao = 'IGUALITARIO' | 'PERCENTUAL';

export default function NovaDespesaPage() {
  const router = useRouter();

  const [valorCentavos, setValorCentavos] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('ESSENCIAL');
  const [tipoDivisao, setTipoDivisao] = useState<TipoDivisao>('IGUALITARIO');
  const [selecionados, setSelecionados] = useState<string[]>(mockMembers.map((m) => m.id));
  const [percentuais, setPercentuais] = useState<Record<string, number>>({});

  const valorFormatado = (valorCentavos / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setValorCentavos(Number(apenasNumeros));
  };

  const toggleMembro = (id: string) => {
    setSelecionados((atual) =>
      atual.includes(id) ? atual.filter((m) => m !== id) : [...atual, id]
    );
  };

  const handlePercentualChange = (id: string, valor: string) => {
    setPercentuais((atual) => ({ ...atual, [id]: Number(valor) || 0 }));
  };

  const totalPercentual = selecionados.reduce((soma, id) => soma + (percentuais[id] ?? 0), 0);

  const handleSalvar = () => {
    const despesa = {
      titulo,
      valor: valorCentavos / 100,
      categoria,
      tipoDivisao,
      participantes: selecionados,
      percentuais: tipoDivisao === 'PERCENTUAL' ? percentuais : undefined,
    };
    console.log('Despesa a salvar:', despesa);
    // Depois: chamada real pra API do backend (Dev BE 02)
    router.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-md w-full px-5 py-3 h-16 sticky top-0 z-50">
        <button
          onClick={() => router.back()}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center w-10 h-10 rounded-full"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="font-card-title text-on-surface">Novo Gasto</span>
      </header>

      <main className="flex-grow flex flex-col px-container-padding py-lg gap-lg max-w-2xl mx-auto w-full pb-32">
        {/* Valor total */}
        <section className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col items-center justify-center gap-sm">
          <label htmlFor="valor_total" className="font-body-metadata text-on-surface-variant">
            Valor Total
          </label>
          <div className="flex items-baseline gap-xs">
            <span className="font-currency-lg text-on-surface">R$</span>
            <input
              id="valor_total"
              type="text"
              inputMode="numeric"
              dir="rtl"
              value={valorFormatado}
              onChange={handleValorChange}
              className="font-currency-lg text-4xl leading-[48px] font-bold text-center text-primary bg-transparent border-none focus:ring-0 p-0 w-full max-w-[200px]"
            />
          </div>
        </section>

        {/* Título e categoria */}
        <section className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col gap-md">
          <div className="flex flex-col gap-unit">
            <label htmlFor="titulo" className="font-body-metadata text-on-surface-variant">
              Título da despesa
            </label>
            <input
              id="titulo"
              type="text"
              placeholder="Ex: Conta de Luz"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="rounded-lg border border-transparent px-md py-sm font-body-main text-on-surface w-full h-12 bg-[#F3F4F6] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:bg-surface-container-lowest transition-all"
            />
          </div>

          <div className="flex flex-col gap-unit pt-sm">
            <span className="font-body-metadata text-on-surface-variant">Categoria</span>
            <div className="flex gap-sm">
              <button
                type="button"
                onClick={() => setCategoria('ESSENCIAL')}
                className={`flex-1 rounded-lg px-md py-sm text-center border transition-all font-body-metadata font-medium ${
                  categoria === 'ESSENCIAL'
                    ? 'bg-primary-fixed border-primary text-primary'
                    : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                ESSENCIAL
              </button>
              <button
                type="button"
                onClick={() => setCategoria('LAZER')}
                className={`flex-1 rounded-lg px-md py-sm text-center border transition-all font-body-metadata font-medium ${
                  categoria === 'LAZER'
                    ? 'bg-tertiary-fixed border-tertiary text-tertiary'
                    : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                LAZER
              </button>
            </div>
          </div>
        </section>

        {/* Envolvidos */}
        <section className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col gap-md">
          <div className="flex justify-between items-center">
            <h3 className="font-card-title text-on-surface">Envolvidos</h3>
            <span className="font-body-metadata text-on-surface-variant">{mockMembers.length} pessoas</span>
          </div>

          <div className="bg-surface-container-high rounded-lg p-unit flex relative">
            <div
              className={`absolute w-1/2 h-[calc(100%-8px)] bg-surface-container-lowest rounded shadow-sm left-1 transition-transform duration-300 ${
                tipoDivisao === 'PERCENTUAL' ? 'translate-x-full' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setTipoDivisao('IGUALITARIO')}
              className={`relative z-10 flex-1 py-xs text-center font-body-metadata font-medium ${
                tipoDivisao === 'IGUALITARIO' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Igualitário
            </button>
            <button
              type="button"
              onClick={() => setTipoDivisao('PERCENTUAL')}
              className={`relative z-10 flex-1 py-xs text-center font-body-metadata font-medium ${
                tipoDivisao === 'PERCENTUAL' ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              Percentual
            </button>
          </div>

          <div className="flex overflow-x-auto gap-md pb-sm no-scrollbar mt-sm snap-x">
            {mockMembers.map((membro) => {
              const isSelected = selecionados.includes(membro.id);
              return (
                <button
                  type="button"
                  key={membro.id}
                  onClick={() => toggleMembro(membro.id)}
                  className="flex flex-col items-center gap-xs min-w-[72px] snap-start"
                >
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-card-title text-on-surface-variant bg-surface-container-high border-2 transition-colors ${
                        isSelected ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      {membro.initials}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                  </div>
                  <span className="font-body-metadata text-on-surface text-center truncate w-full">
                    {membro.name}
                  </span>
                </button>
              );
            })}
          </div>

          {tipoDivisao === 'PERCENTUAL' && (
            <div className="flex flex-col gap-sm pt-sm border-t border-surface-variant">
              {mockMembers
                .filter((m) => selecionados.includes(m.id))
                .map((membro) => (
                  <div key={membro.id} className="flex items-center justify-between gap-md">
                    <span className="font-body-main text-on-surface">{membro.name}</span>
                    <div className="flex items-center gap-xs">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={percentuais[membro.id] ?? ''}
                        onChange={(e) => handlePercentualChange(membro.id, e.target.value)}
                        className="w-16 text-right rounded-lg border border-outline-variant px-sm py-xs font-body-main text-on-surface"
                      />
                      <span className="font-body-metadata text-on-surface-variant">%</span>
                    </div>
                  </div>
                ))}
              <p className={`font-body-metadata text-right ${totalPercentual === 100 ? 'text-primary' : 'text-error'}`}>
                Total: {totalPercentual}%
              </p>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full px-container-padding pb-lg pt-md bg-gradient-to-t from-background via-background to-transparent z-40 max-w-2xl mx-auto right-0">
        <button
          onClick={handleSalvar}
          className="w-full h-12 bg-primary text-on-primary font-body-main font-semibold rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}