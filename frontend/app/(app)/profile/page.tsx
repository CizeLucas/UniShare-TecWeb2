'use client';

import { useState } from 'react';

type TipoChavePix = 'CPF' | 'Email' | 'Telefone' | 'Aleatória';

const TIPOS_PIX: { label: TipoChavePix; placeholder: string }[] = [
  { label: 'CPF', placeholder: '000.000.000-00' },
  { label: 'Email', placeholder: 'seu@email.com' },
  { label: 'Telefone', placeholder: '+55 (11) 99999-9999' },
  { label: 'Aleatória', placeholder: 'Cole sua chave aleatória' },
];

const mockUser = {
  name: 'João Silva',
  email: 'joao@universidade.edu.br',
  initials: 'JS',
  pixKey: '000.000.000-00',
  pixType: 'CPF' as TipoChavePix,
};

export default function ProfilePage() {
  const [name, setName] = useState(mockUser.name);
  const [tipoChave, setTipoChave] = useState<TipoChavePix>(mockUser.pixType);
  const [pixKey, setPixKey] = useState(mockUser.pixKey);
  const [saved, setSaved] = useState(false);

  const placeholder = TIPOS_PIX.find((t) => t.label === tipoChave)?.placeholder ?? '';

  const handleSave = () => {
    console.log('Salvar perfil:', { name, tipoChave, pixKey });
    // depois: chamar API (Dev BE 01)
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="px-container-padding py-lg max-w-2xl mx-auto flex flex-col gap-lg">
      {/* Avatar + nome */}
      <section className="flex flex-col items-center gap-md pt-sm">
        <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[32px] font-bold level-1-shadow">
          {mockUser.initials}
        </div>
        <div className="text-center">
          <p className="font-card-title text-card-title text-on-surface">{mockUser.name}</p>
          <p className="font-body-metadata text-body-metadata text-on-surface-variant">{mockUser.email}</p>
        </div>
      </section>

      {/* Dados pessoais */}
      <section className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col gap-md">
        <h2 className="font-card-title text-card-title text-on-surface">Dados pessoais</h2>

        <div className="flex flex-col gap-unit">
          <label htmlFor="name" className="font-body-metadata text-body-metadata text-on-surface-variant">
            Nome completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-unit">
          <label className="font-body-metadata text-body-metadata text-on-surface-variant">
            E-mail
          </label>
          <div className="w-full bg-surface-container-highest rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface-variant select-none cursor-not-allowed">
            {mockUser.email}
          </div>
          <p className="font-body-metadata text-[12px] text-on-surface-variant">
            O e-mail não pode ser alterado.
          </p>
        </div>
      </section>

      {/* Chave PIX */}
      <section className="bg-surface-container-lowest rounded-xl level-1-shadow p-md flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            payments
          </span>
          <h2 className="font-card-title text-card-title text-on-surface">Chave PIX</h2>
        </div>

        <div className="flex flex-col gap-unit">
          <label className="font-body-metadata text-body-metadata text-on-surface-variant">
            Tipo de Chave
          </label>
          <div className="flex flex-nowrap gap-xs">
            {TIPOS_PIX.map((tipo) => (
              <button
                key={tipo.label}
                type="button"
                onClick={() => setTipoChave(tipo.label)}
                className={`py-sm px-sm rounded-full font-body-metadata text-[13px] border transition-colors ${
                  tipoChave === tipo.label
                    ? 'bg-primary-container text-on-primary-container border-transparent'
                    : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-highest'
                }`}
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-unit">
          <label htmlFor="pix-key" className="font-body-metadata text-body-metadata text-on-surface-variant">
            Sua chave
          </label>
          <input
            id="pix-key"
            type="text"
            placeholder={placeholder}
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-start gap-sm p-sm bg-inverse-on-surface rounded-lg">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-[2px]">info</span>
          <p className="font-body-metadata text-body-metadata text-on-surface-variant">
            Sua chave PIX é compartilhada com outros membros quando eles precisam te pagar.
          </p>
        </div>
      </section>

      {/* Botão salvar */}
      <button
        onClick={handleSave}
        className="w-full h-12 bg-primary text-on-primary font-body-main font-semibold rounded-lg flex items-center justify-center gap-sm active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(53,37,205,0.25)] hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[20px]">
          {saved ? 'check' : 'save'}
        </span>
        {saved ? 'Salvo!' : 'Salvar alterações'}
      </button>

      {/* Sair */}
      <button
        onClick={() => console.log('logout')}
        className="w-full h-12 border-2 border-error text-error font-body-main font-semibold rounded-lg flex items-center justify-center gap-sm active:scale-[0.98] transition-all hover:bg-error-container/30"
      >
        <span className="material-symbols-outlined text-[20px]">logout</span>
        Sair da conta
      </button>
    </main>
  );
}