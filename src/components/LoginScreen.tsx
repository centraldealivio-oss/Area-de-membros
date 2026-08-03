/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { validateTokenOnlineOrLocal, PARADISE_CHECKOUT_URL } from '../lib/tokenAuth';
import { UserSession } from '../types';
import { MAIN_COVER_IMAGE, FALLBACK_COVER_IMAGE } from '../data/bonusData';
import { KeyRound, ShieldAlert, ArrowRight, ExternalLink, Sparkles, CheckCircle2, Flame, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession, isFirstTime: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [inputToken, setInputToken] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async (tokenToTest?: string) => {
    const token = (tokenToTest || inputToken).trim();
    if (!token) {
      setErrorMsg('Por favor, informe seu token de acesso.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const session = await validateTokenOnlineOrLocal(token);
      if (session) {
        onLoginSuccess(session, true);
      } else {
        setErrorMsg('Token de acesso não encontrado. Verifique a chave enviada no seu e-mail.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão ao validar token. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 bg-[#121214] border border-white/5 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Left Book Graphic Showcase */}
        <div className="md:col-span-5 bg-[#0d0d0f] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Área de Membros Restrita</span>
            </div>

            <div className="relative mx-auto my-2 w-36 sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={MAIN_COVER_IMAGE}
                alt="Livro Antes da Explosão"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-center">
              Antes da <span className="text-orange-500">Explosão</span>
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed text-center">
              O audiobook & ebook completo sobre a neurociência dos relacionamentos. Entenda o cérebro no conflito e evite a explosão.
            </p>
          </div>

          <div className="text-[11px] text-gray-500 text-center font-mono relative z-10 my-auto py-6">
            Acesso exclusivo para alunos — Central de Alívio
          </div>
        </div>

        {/* Right Token Entry Form */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#121214]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                Validação de Token
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Insira seu Token de Acesso
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Digite a chave enviada para seu e-mail ou gerada na confirmação da sua compra.
            </p>

            {/* Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleValidate(); }} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="w-4 h-4 text-orange-500" />
                </div>
                <input
                  type="text"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="Cole aqui o seu token de acesso"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#0d0d0f] border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 font-mono text-sm tracking-wide transition-all"
                />
              </div>

              {errorMsg && (
                <div className="flex items-start space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Validando Token...</span>
                ) : (
                  <>
                    <span>Entrar na Área de Membros</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Token Selector */}
            <div className="mt-6 p-4 rounded-2xl bg-[#08090d] border border-white/5 space-y-2.5">
              <span className="text-[11px] font-mono text-gray-400 block font-semibold uppercase tracking-wider">
                ⚡ Testar Tokens Rápidos de Acesso:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleValidate('PARADISE-SUPREMO-9999')}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                  title="Libera TUDO: Ebook + Bônus 1, 2 e 3 + Comunidade VIP"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>👑 Token Supremo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleValidate('TOKEN-BONUS1-BPM100')}
                  className="px-2.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-mono text-[11px] font-medium transition-all"
                  title="Libera Ebook + Apenas Bônus 1 (Protocolo 100 BPM)"
                >
                  <span>⚡ Bônus 1 (100 BPM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleValidate('TOKEN-BONUS2-GATILHO')}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-mono text-[11px] font-medium transition-all"
                  title="Libera Ebook + Apenas Bônus 2 (Raio-X do Gatilho)"
                >
                  <span>🎯 Bônus 2 (Raio-X)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleValidate('TOKEN-BONUS3-VINCULO')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-medium transition-all"
                  title="Libera Ebook + Apenas Bônus 3 (Blindagem do Vínculo)"
                >
                  <span>🛡️ Bônus 3 (Blindagem)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleValidate('PARADISE-STD-1234')}
                  className="px-2.5 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-300 font-mono text-[11px] font-medium transition-all"
                  title="Apenas Ebook / Audiobook Base"
                >
                  <span>📘 Plano Padrão</span>
                </button>
              </div>
            </div>
          </div>

          {/* Direct Website Link */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <a
              href="https://mente.centraldealivio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors"
            >
              <span>Ainda não possui acesso? Adquirir em mente.centraldealivio.com.br</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
