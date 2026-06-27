'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TipoAmbiente = 'RESIDENCIA' | 'UNIVERSIDADE';

const TIPOS: { value: TipoAmbiente; label: string; icon: string }[] = [
  { value: 'RESIDENCIA', label: 'Residência', icon: 'home' },
  { value: 'UNIVERSIDADE', label: 'Atividade Universitária', icon: 'school' },
];

interface Participante {
  email: string;
}

export default function NovoAmbientePage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<TipoAmbiente>('RESIDENCIA');
  const [emailInput, setEmailInput] = useState('');
  const [participantes, setParticipantes] = useState<Participante[]>([
    { email: 'lucas.silva@uni.edu' },
    { email: 'mariana.costa@uni.edu' },
  ]);

  const handleAdicionarParticipante = () => {
    const email = emailInput.trim();
    if (!email || participantes.some((p) => p.email === email)) return;
    setParticipantes((atual) => [...atual, { email }]);
    setEmailInput('');
  };

  const handleRemoverParticipante = (email: string) => {
    setParticipantes((atual) => atual.filter((p) => p.email !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdicionarParticipante();
    }
  };

  const handleCriar = () => {
    const payload = { nome, tipo, participantes };
    console.log('Criar ambiente:', payload);
    // depois: chamar API (Dev BE 01)
    router.push('/workspaces');
  };

  return (
    <div className="bg-background text-on-background font-body-main min-h-screen antialiased flex flex-col">
      {/* Header mobile */}
      <header className="md:hidden flex justify-between items-center w-full px-5 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-on-surface-variant hover:bg-slate-50 p-1 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-lg font-black text-primary font-display-title">UniShare</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-container-padding pt-md pb-xl md:pt-lg">
        <h2 className="font-display-title text-display-title text-on-background mb-lg">
          Novo Ambiente
        </h2>

        <div className="flex flex-col gap-lg">
          {/* Nome */}
          <div className="flex flex-col gap-sm">
            <label htmlFor="env-title" className="font-card-title text-card-title text-on-background">
              Nome do Ambiente
            </label>
            <input
              id="env-title"
              type="text"
              placeholder="e.g. República Central"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-lg p-md focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-outline font-body-main text-body-main shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-sm">
            <span className="font-card-title text-card-title text-on-background">Tipo de Ambiente</span>
            <div className="grid grid-cols-2 gap-gutter">
              {TIPOS.map((t) => {
                const isActive = tipo === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTipo(t.value)}
                    className={`rounded-xl p-md flex flex-col items-start gap-sm cursor-pointer active:scale-95 transition-all text-left ${
                      isActive
                        ? 'bg-primary-fixed border-2 border-primary shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
                        : 'bg-surface-container-lowest border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-primary/50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {t.icon}
                      </span>
                    </div>
                    <span className="font-card-title text-[16px] leading-[20px] font-bold text-on-background mt-xs">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Participantes */}
          <div className="flex flex-col gap-sm pt-sm border-t border-surface-variant mt-sm">
            <span className="font-card-title text-card-title text-on-background">Participantes</span>
            <p className="font-body-metadata text-body-metadata text-on-surface-variant -mt-xs">
              Convide membros para dividir as despesas.
            </p>

            <div className="flex gap-sm mt-xs">
              <input
                type="email"
                placeholder="Email do participante"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-surface-container-low text-on-surface border border-outline-variant rounded-lg px-md py-[12px] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-outline font-body-main text-body-main"
              />
              <button
                type="button"
                onClick={handleAdicionarParticipante}
                className="bg-primary-container text-on-primary rounded-lg px-md font-card-title text-[15px] font-bold flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.2)]"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-col gap-xs mt-md">
              {participantes.map((p) => (
                <div
                  key={p.email}
                  className="flex items-center justify-between bg-surface-container-lowest p-sm rounded-lg border border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  <div className="flex items-center gap-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {p.email[0].toUpperCase()}
                    </div>
                    <span className="font-body-metadata text-body-metadata text-on-surface">
                      {p.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoverParticipante(p.email)}
                    className="w-8 h-8 flex items-center justify-center text-error hover:bg-error-container rounded-full transition-colors active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCriar}
            className="w-full bg-primary text-on-primary h-[48px] rounded-lg font-card-title text-card-title flex items-center justify-center shadow-[0_4px_12px_rgba(53,37,205,0.25)] mt-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Criar Ambiente
          </button>
        </div>
      </main>
    </div>
  );
}