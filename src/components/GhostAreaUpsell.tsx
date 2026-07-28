/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bonus } from '../types';
import { UPSELL_BONUSES } from '../data/bonusData';
import { PARADISE_CHECKOUT_URL, validateTokenOnlineOrLocal } from '../lib/tokenAuth';
import { Lock, Sparkles, ExternalLink, ShieldCheck, Flame, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

interface GhostAreaUpsellProps {
  onUpgradeSuccess: (newTierToken: string) => void;
}

export const GhostAreaUpsell: React.FC<GhostAreaUpsellProps> = ({ onUpgradeSuccess }) => {
  const [upgradeTokenInput, setUpgradeTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestUpgradeToken = async () => {
    const token = upgradeTokenInput.trim();
    if (!token) {
      setErrorMsg('Insira o token VIP que recebeu no checkout de upsell da Paradise.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const session = await validateTokenOnlineOrLocal(token);
      if (session && session.tier === 'vip_upsell') {
        onUpgradeSuccess(session.token);
      } else {
        setErrorMsg('Este token não possui o plano VIP Diamante ativado. Teste com: PARADISE-VIP-8888');
      }
    } catch {
      setErrorMsg('Erro ao conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Locked Ghost Area Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121214] border border-white/5 p-6 sm:p-10 text-center shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Área Black Edition Restrita • Reservada para Compradores VIP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Desbloqueie os 3 Bônus Exclusivos de <span className="text-orange-500">Proteção Relacional</span>
          </h2>

          <p className="text-sm text-gray-300 leading-relaxed">
            Você está vendo a área reservada para quem adquiriu o pacote VIP no checkout da Paradise. Libere acesso instantâneo às ferramentas práticas de desativação de conflitos.
          </p>

          {/* Paradise Upgrade Direct Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={PARADISE_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center space-x-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Garantir Upgrade em centraldealivio.com.br</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Bonus Teaser Grid with Covers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {UPSELL_BONUSES.map((bonus) => (
          <div
            key={bonus.id}
            className="group relative bg-[#121214] border border-white/5 rounded-3xl p-6 flex flex-col justify-between overflow-hidden hover:border-white/10 transition-all duration-300 shadow-2xl"
          >
            {/* Locked Badge Overlay */}
            <div className="absolute top-4 right-4 z-20 flex items-center space-x-1 px-3 py-1 rounded-full bg-black/80 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>BLACK EDITION</span>
            </div>

            <div>
              {/* Cover Graphic */}
              <div className="relative mb-4 rounded-2xl overflow-hidden aspect-[3/4] max-h-[260px] mx-auto border border-white/10 bg-[#0d0d0f]">
                <img
                  src={bonus.coverImage}
                  alt={bonus.title}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (bonus.id === 'bonus-1') target.src = '/images/cover_protocolo_100_bpm.jpg';
                    if (bonus.id === 'bonus-2') target.src = '/images/cover_raio_x_gatilho.jpg';
                    if (bonus.id === 'bonus-3') target.src = '/images/cover_blindagem_vinculo.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-black/30" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500 block mb-1">
                {bonus.badge}
              </span>
              <h3 className="font-bold text-lg text-white mb-1">
                {bonus.title}
              </h3>
              <p className="text-xs text-amber-400/90 italic mb-3">
                "{bonus.subtitle}"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                {bonus.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2 border-t border-white/5 pt-3 mb-4 text-xs text-gray-300">
                {bonus.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lock Action */}
            <div className="pt-2">
              <a
                href={PARADISE_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl text-xs font-bold bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Desbloquear Bônus {bonus.number}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Manual VIP Token Upgrade Input Box */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-4 shadow-2xl">
        <div className="flex justify-center">
          <div className="p-3.5 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-500">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white">
          Já Adquiriu o Upsell do Módulo Black?
        </h3>
        <p className="text-xs text-gray-400">
          Digite abaixo seu Token VIP ativado para liberar os Bônus imediatamente:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={upgradeTokenInput}
            onChange={(e) => setUpgradeTokenInput(e.target.value)}
            placeholder="Digite seu token VIP"
            className="flex-1 px-4 py-3 bg-[#0d0d0f] border border-white/10 rounded-2xl text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleTestUpgradeToken}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-all shrink-0"
          >
            {isLoading ? 'Verificando...' : 'Ativar VIP'}
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
        )}
      </div>

    </div>
  );
};
