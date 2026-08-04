/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSession } from '../types';
import { computePermissions } from '../lib/tokenAuth';
import { CheckCircle2, Copy, Sparkles, ShieldCheck, Flame, ArrowRight, Bookmark, Lock } from 'lucide-react';

interface WelcomeModalProps {
  session: UserSession;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ session, onClose }) => {
  const [copied, setCopied] = useState(false);

  const permissions = session.permissions || computePermissions(session.token, session.tier);

  const handleCopy = () => {
    navigator.clipboard.writeText(session.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-[#121214] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-gray-200">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
        
        {/* Success Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600/10 border border-orange-500/20 shadow-lg shadow-orange-600/20">
            <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
            <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute -bottom-1 -right-1 bg-[#121214] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            ✓ LINK E TOKEN VALIDADOS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Bem-vindo ao Antes da <span className="text-orange-500">Explosão</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
            Olá, <strong className="text-amber-300">{session.customerName || 'Aluno'}</strong>! Seu acesso foi ativado com sucesso!
          </p>
        </div>

        {/* Token Access Display Box */}
        <div className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              Seu Token Único de Acesso:
            </span>
            <span className="text-[11px] text-emerald-400 font-mono font-bold">Autenticado</span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-[#07080a] p-3 rounded-xl border border-white/5">
            <code className="font-mono text-sm sm:text-base font-bold text-orange-400 tracking-wider truncate">
              {session.token}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 text-xs font-bold border border-orange-500/30 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copiado!' : 'Copiar Token'}</span>
            </button>
          </div>

          {/* Detailed Unlocked Checklist */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2">
              Status do Seu Acesso Contratado:
            </span>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Produto Principal (Ebook + Audiobook)</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">Liberado</span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${
                permissions.bonus1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/5 border-white/5 text-gray-500'
              }`}>
                <span className="flex items-center gap-1.5 font-medium">
                  {permissions.bonus1 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  <span>Bônus 1: Protocolo 100 BPM</span>
                </span>
                <span className={`text-[10px] uppercase font-mono font-bold ${permissions.bonus1 ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {permissions.bonus1 ? 'Liberado' : 'Não Contratado'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${
                permissions.bonus2 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/5 border-white/5 text-gray-500'
              }`}>
                <span className="flex items-center gap-1.5 font-medium">
                  {permissions.bonus2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  <span>Bônus 2: Raio-X do Gatilho</span>
                </span>
                <span className={`text-[10px] uppercase font-mono font-bold ${permissions.bonus2 ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {permissions.bonus2 ? 'Liberado' : 'Não Contratado'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${
                permissions.bonus3 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-white/5 border-white/5 text-gray-500'
              }`}>
                <span className="flex items-center gap-1.5 font-medium">
                  {permissions.bonus3 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  <span>Bônus 3: Blindagem do Vínculo</span>
                </span>
                <span className={`text-[10px] uppercase font-mono font-bold ${permissions.bonus3 ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {permissions.bonus3 ? 'Liberado' : 'Não Contratado'}
                </span>
              </div>

              <div className={`flex items-center justify-between p-2 rounded-lg border ${
                permissions.vipCommunity ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-bold' : 'bg-white/5 border-white/5 text-gray-500'
              }`}>
                <span className="flex items-center gap-1.5 font-medium">
                  {permissions.vipCommunity ? <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  <span>Comunidade VIP Black</span>
                </span>
                <span className={`text-[10px] uppercase font-mono font-bold ${permissions.vipCommunity ? 'text-amber-400' : 'text-gray-500'}`}>
                  {permissions.vipCommunity ? 'VIP LIBERADO' : 'Não Contratado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium text-center leading-snug">
          ⚠️ <strong>Aviso:</strong> Checar e-mail para recebimento do token caso tenha adquirido nosso bônus, confira o spam!
        </div>

        {/* Start Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2"
        >
          <span>Acessar Minha Área de Membros</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
