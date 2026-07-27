/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, CheckCircle2, ExternalLink, ArrowRight, X, Sparkles, Copy } from 'lucide-react';

interface ParadiseSimulatorModalProps {
  onClose: () => void;
  onSimulateRedirect: (token: string) => void;
}

export const ParadiseSimulatorModal: React.FC<ParadiseSimulatorModalProps> = ({
  onClose,
  onSimulateRedirect
}) => {
  const [buyerName, setBuyerName] = useState('Juliana Silva');
  const [buyerEmail, setBuyerEmail] = useState('juliana.silva@exemplo.com');
  const [isUpsell, setIsUpsell] = useState(true);
  const [generatedResult, setGeneratedResult] = useState<{
    token: string;
    redirectUrl: string;
    tier: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleRunSimulation = async () => {
    try {
      const response = await fetch('/api/webhooks/paradise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          customer: {
            name: buyerName,
            email: buyerEmail
          },
          upsell_purchased: isUpsell,
          product_id: isUpsell ? 'ADE-PRO-UPS' : 'ADE-STD'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedResult({
          token: data.access_token,
          redirectUrl: data.redirect_url,
          tier: data.tier
        });
      }
    } catch {
      // Fallback
      const token = isUpsell
        ? `PARADISE-VIP-${Math.floor(100000 + Math.random() * 900000)}`
        : `PARADISE-STD-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedResult({
        token,
        redirectUrl: `${window.location.origin}/?token=${token}`,
        tier: isUpsell ? 'vip_upsell' : 'standard'
      });
    }
  };

  const handleCopyLink = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult.redirectUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-xl font-bold text-slate-100">
            Simulador de Checkout Paradise
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Simule uma compra finalizada na <code className="text-amber-300 font-mono">multi.paradisepags.com</code> e teste o envio automático do webhook com a geração do token.
        </p>

        <div className="space-y-4 bg-[#08090e] p-4 rounded-xl border border-slate-800">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nome do Comprador:
            </label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full px-3 py-2 bg-[#101320] border border-slate-800 rounded-lg text-xs text-amber-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              E-mail do Comprador:
            </label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#101320] border border-slate-800 rounded-lg text-xs text-amber-200"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Tipo de Compra Realizada:
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsUpsell(false)}
                className={`p-2.5 rounded-lg text-xs text-center border font-medium transition-all ${
                  !isUpsell
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Audiobook Padrão
              </button>

              <button
                type="button"
                onClick={() => setIsUpsell(true)}
                className={`p-2.5 rounded-lg text-xs text-center border font-medium transition-all ${
                  isUpsell
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                Padrão + 3 Bônus VIP
              </button>
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs hover:from-amber-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          >
            Disparar Webhook Paradise Simulada
          </button>
        </div>

        {/* Generated Token Result */}
        {generatedResult && (
          <div className="mt-6 bg-[#121522] border border-emerald-500/40 p-4 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Webhook Processado & Token Gerado!
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {generatedResult.tier === 'vip_upsell' ? 'VIP UPSELL' : 'PADRÃO'}
              </span>
            </div>

            <div className="bg-[#080a10] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <code className="text-xs text-amber-300 font-mono font-bold">
                {generatedResult.token}
              </code>
              <button
                onClick={handleCopyLink}
                className="text-[10px] text-amber-400 font-medium px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20"
              >
                {isCopied ? 'Copiado!' : 'Copiar URL'}
              </button>
            </div>

            <button
              onClick={() => {
                onSimulateRedirect(generatedResult.token);
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center space-x-1"
            >
              <span>Testar Redirecionamento Imediato</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
