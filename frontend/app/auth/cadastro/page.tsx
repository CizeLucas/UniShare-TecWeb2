'use client';

import { useState } from 'react';
import Link from 'next/link';

type TipoChavePix = 'CPF' | 'Email' | 'Telefone' | 'Aleatória';

const TIPOS_PIX: { label: TipoChavePix; placeholder: string }[] = [
  { label: 'CPF', placeholder: '000.000.000-00' },
  { label: 'Email', placeholder: 'seu@email.com' },
  { label: 'Telefone', placeholder: '+55 (11) 99999-9999' },
  { label: 'Aleatória', placeholder: 'Cole sua chave aleatória' },
];

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [tipoChave, setTipoChave] = useState<TipoChavePix>('CPF');

  const placeholderAtual = TIPOS_PIX.find((t) => t.label === tipoChave)?.placeholder ?? '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // depois: chamar API de cadastro (Dev BE 01)
  };

  return (
    <main className="w-full max-w-[440px] flex flex-col gap-lg">
      {/* Header / Branding */}
      <header className="flex flex-col items-center text-center mb-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center mb-md shadow-sm">
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            account_balance_wallet
          </span>
        </div>
        <h1 className="font-display-title text-display-title text-on-surface">Criar Conta</h1>
        <p className="font-body-main text-body-main text-on-surface-variant mt-unit">Bem-vindo ao UniShare.</p>
      </header>

      {/* Card do formulário */}
      <div className="bg-surface-container-lowest rounded-xl level-1-shadow p-lg flex flex-col gap-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          {/* Dados pessoais */}
          <section className="flex flex-col gap-md">
            <div>
              <label htmlFor="name" className="block font-body-metadata text-body-metadata text-on-surface-variant mb-unit">
                Nome Completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-body-metadata text-body-metadata text-on-surface-variant mb-unit">
                E-mail Universitário
              </label>
              <input
                id="email"
                type="email"
                placeholder="joao@universidade.edu.br"
                className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-body-metadata text-body-metadata text-on-surface-variant mb-unit">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] pr-xl font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
          </section>

          <hr className="border-t border-outline-variant/30" />

          {/* PIX */}
          <section className="flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                payments
              </span>
              <h2 className="font-card-title text-card-title text-on-surface">Recebimentos (PIX)</h2>
            </div>

            <div>
              <label className="block font-body-metadata text-body-metadata text-on-surface-variant mb-sm">
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

            <div>
              <label htmlFor="pix-key" className="block font-body-metadata text-body-metadata text-on-surface-variant mb-unit">
                Sua Chave
              </label>
              <input
                id="pix-key"
                type="text"
                placeholder={placeholderAtual}
                className="w-full bg-surface-container-highest border-2 border-transparent rounded-lg px-md py-[12px] font-body-main text-body-main text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-start gap-sm p-sm bg-error-container/40 rounded-lg border border-error-container">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-[2px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <p className="font-body-metadata text-body-metadata text-on-error-container">
                Sem uma chave cadastrada, você não poderá gerar cobranças automáticas.
              </p>
            </div>
          </section>

          <button
            type="submit"
            className="w-full h-[48px] bg-primary text-on-primary font-card-title text-card-title rounded-lg flex items-center justify-center hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Concluir Cadastro
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="pt-sm pb-lg text-center">
        <p className="font-body-metadata text-body-metadata text-on-surface-variant">
          Já possui conta?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}