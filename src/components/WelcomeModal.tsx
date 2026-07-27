/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession } from '../types';
import { CheckCircle2, Copy, Sparkles, ShieldCheck, Flame, ArrowRight, Bookmark } from 'lucide-react';

interface WelcomeModalProps {
  session: UserSession;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ session, onClose }) => {
  const [copied, setCopied] = useState(false);
  const isVip = session.tier === 'vip_upsell';

  const handleCopy = () => {
    navigator.clipboard.writeText(session.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#121214] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-gray-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-600" />
        
        {/* Success Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-500/20 shadow-lg shadow-orange-600/20">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute -bottom-1 -right-1 bg-[#121214] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            ✓ PAGAMENTO CONFIRMADO PELA PARADISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Bem-vindo ao Antes da <span className="text-orange-500">Explosão</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
            Seu acesso exclusivo à Área de Membros foi gerado e validado com sucesso!
          </p>
        </div>

        {/* Token Access Display Box */}
        <div className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              Seu Token Único de Acesso:
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">100% Funcional</span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-[#07080a] p-3.5 rounded-xl border border-white/5">
            <code className="font-mono text-base sm:text-lg font-bold text-orange-500 tracking-wider">
              {session.token}
            </code>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 text-xs font-bold border border-orange-500/30 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Tier Unlocked Indicator */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Plano Desbloqueado:</span>
            {isVip ? (
              <span className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Audiobook + 3 Bônus Black Edition
              </span>
            ) : (
              <span className="font-semibold text-orange-400 bg-orange-600/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                Audiobook Padrão (Antes da Explosão)
              </span>
            )}
          </div>
        </div>

        {/* Tip / Reminder */}
        <div className="flex items-start space-x-2.5 bg-white/5 p-3.5 rounded-2xl border border-white/5 text-xs text-gray-400 mb-6">
          <Bookmark className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p>
            Guarde este token ou salve o link desta página nos seus favoritos! Você poderá retornar e continuar de onde parou a qualquer momento.
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2"
        >
          <span>Acessar Conteúdo Agora</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
