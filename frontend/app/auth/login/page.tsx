'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // depois: chamar API de auth (Dev BE 01)
  };

  return (
    <main className="w-full max-w-[420px]">
      <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-variant p-lg flex flex-col gap-lg relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-unit mt-sm z-10">
          <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shadow-sm mb-sm">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <h1 className="font-display-title text-display-title text-on-surface tracking-tight">UniShare</h1>
          <p className="font-body-main text-body-main text-on-surface-variant text-center mt-xs">
            Gestão financeira transparente para repúblicas.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md z-10 w-full mt-sm">
          {/* Email — floating label */}
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email"
              className="peer w-full h-[56px] px-md pt-[18px] pb-1 bg-surface-container rounded-lg font-body-main text-body-main text-on-surface border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-md top-[16px] text-on-surface-variant font-body-metadata transition-all pointer-events-none
                peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-[16px]
                peer-focus:top-[6px] peer-focus:text-[11px] peer-focus:text-primary peer-focus:font-medium
                peer-valid:top-[6px] peer-valid:text-[11px] peer-valid:font-medium"
            >
              Email
            </label>
          </div>

          {/* Senha — floating label */}
          <div className="relative w-full">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              className="peer w-full h-[56px] px-md pt-[18px] pb-1 pr-xl bg-surface-container rounded-lg font-body-main text-body-main text-on-surface border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all placeholder-transparent"
            />
            <label
              htmlFor="password"
              className="absolute left-md top-[16px] text-on-surface-variant font-body-metadata transition-all pointer-events-none
                peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-[16px]
                peer-focus:top-[6px] peer-focus:text-[11px] peer-focus:text-primary peer-focus:font-medium
                peer-valid:top-[6px] peer-valid:text-[11px] peer-valid:font-medium"
            >
              Senha
            </label>
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

          <div className="flex justify-end mt-xs">
            <a href="#" className="font-body-metadata text-body-metadata text-primary font-medium hover:underline transition-colors">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-[48px] mt-xs bg-primary text-on-primary font-body-main font-semibold rounded-lg shadow-sm hover:bg-on-primary-fixed-variant focus:ring-4 focus:ring-primary-container/50 active:scale-[0.98] transition-all flex justify-center items-center gap-xs"
          >
            <span>Entrar</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {/* Footer */}
        <div className="flex justify-center mt-md mb-sm z-10">
          <p className="font-body-metadata text-body-metadata text-on-surface-variant">
            Não tem uma conta?{' '}
            <Link href="/auth/cadastro" className="text-primary font-semibold hover:underline ml-1">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}