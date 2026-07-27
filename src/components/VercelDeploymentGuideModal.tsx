/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Server, CheckCircle2, ExternalLink, X, Code, Globe, ShieldCheck } from 'lucide-react';

interface VercelDeploymentGuideModalProps {
  onClose: () => void;
}

export const VercelDeploymentGuideModal: React.FC<VercelDeploymentGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1017] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.25)] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <Server className="w-6 h-6 text-amber-400" />
          <h3 className="font-serif text-2xl font-bold text-slate-100">
            Guia de Implantação Vercel (Ativo 24h)
          </h3>
        </div>

        <p className="text-xs text-slate-400 mb-6">
          Siga os passos abaixo para publicar sua Área de Membros do "Antes da Explosão" na Vercel e integrar com a Paradise Checkout.
        </p>

        <div className="space-y-5 text-xs text-slate-300">
          
          {/* Step 1 */}
          <div className="bg-[#121522] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                Passo 1: Exportar ou Enviar para o GitHub
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">
                Código Pronto
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Exporte o código desta aplicação via menu de opções ou envie os arquivos para um repositório no seu GitHub.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#121522] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                Passo 2: Importar no Painel da Vercel
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                Preset Vite
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No site vercel.com, clique em "Add New Project", selecione seu repositório do GitHub e configure:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-amber-200">
              <li>Framework Preset: Vite</li>
              <li>Build Command: npm run build</li>
              <li>Output Directory: dist</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-[#121522] p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Passo 3: Configurar o Redirecionamento na Paradise
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono">
                https://multi.paradisepags.com
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              No painel da Paradise Checkout (multi.paradisepags.com), configure a URL de Obrigado / Pós-Compra para redirecionar o cliente para:
            </p>
            <div className="bg-[#08090e] p-3 rounded-lg border border-amber-500/30 font-mono text-amber-300 text-[11px] break-all">
              https://sua-area-de-membros.vercel.app/?token=PARADISE-VIP-&#123;transaction_id&#125;
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/30 text-emerald-200 space-y-1">
            <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Sua Área de Membros estará Ativa 24h por dia!
            </span>
            <p className="text-[11px] text-slate-300">
              Qualquer cliente que realizar a compra receberá o token e acesso direto à área de membros com os bônus liberados de acordo com o plano.
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
