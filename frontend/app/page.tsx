'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [mainVisible, setMainVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setMainVisible(true), 100);
    const t2 = setTimeout(() => setFooterVisible(true), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="font-body-main text-on-surface min-h-screen flex flex-col justify-between overflow-hidden bg-background">
      {/* Glow decorativo superior */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary-container/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Conteúdo central */}
      <main
        className={`flex-grow flex flex-col items-center justify-center px-container-padding text-center relative z-10 transition-all duration-1000 ${
          mainVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        {/* Logo */}
        <div className="mb-xl">
          <div className="w-24 h-24 rounded-3xl bg-primary-container text-on-primary flex items-center justify-center mx-auto shadow-lg shadow-primary-container/20 hover:scale-105 transition-transform duration-700">
            <span
              className="material-symbols-outlined text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
          </div>
        </div>

        {/* Título */}
        <div className="max-w-[320px] mx-auto space-y-md">
          <h1 className="font-display-title text-display-title text-on-surface tracking-tight">
            Bem-vindo ao UniShare
          </h1>
          <p className="font-body-main text-body-main text-on-surface-variant leading-relaxed">
            Gestão financeira colaborativa e transparente para estudantes.
          </p>
        </div>

        {/* Linhas decorativas */}
        <div className="mt-xl grid grid-cols-2 gap-gutter w-full max-w-sm opacity-60">
          <div className="h-1 bg-primary-container/20 rounded-full" />
          <div className="h-1 bg-outline-variant/30 rounded-full w-2/3" />
        </div>
      </main>

      {/* Footer com botões */}
      <footer
        className={`p-container-padding w-full max-w-2xl mx-auto space-y-md pb-[48px] transition-all duration-700 ${
          footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <button
          onClick={() => router.push('/auth/cadastro')}
          className="w-full h-[48px] bg-primary-container text-on-primary font-bold rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-sm"
        >
          Começar agora
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>

        <button
          onClick={() => router.push('/auth/login')}
          className="w-full h-[48px] border-2 border-primary-container text-primary-container font-bold rounded-xl active:scale-[0.98] transition-all bg-white/50 backdrop-blur-sm"
        >
          Já tenho uma conta
        </button>

        <div className="text-center pt-sm">
          <p className="font-body-metadata text-body-metadata text-outline">
            Ao continuar, você concorda com nossos Termos.
          </p>
        </div>
      </footer>

      {/* Glow decorativo inferior */}
      <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[20%] bg-tertiary-container/5 rounded-full blur-[80px] pointer-events-none" />
    </div>
  );
}