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
      <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-200 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <Server className="w-6 h-6 text-orange-500" />
          <h3 className="text-2xl font-bold text-white">
            Guia de Implantação Vercel (Ativo 24h)
          </h3>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Siga os passos abaixo para publicar sua Área de Membros do "Antes da Explosão" na Vercel e integrar com a Paradise Checkout.
        </p>

        <div className="space-y-5 text-xs text-gray-300">
          
          {/* Step 1 */}
          <div className="bg-[#0d0d0f] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-500" />
                Passo 1: Enviar para o GitHub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600/10 text-orange-500 text-[10px] font-mono font-bold">
                Código Pronto
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              No topo da tela do AI Studio, clique na aba <strong className="text-white">GitHub</strong> e depois no botão <strong className="text-white">Stage and commit all changes</strong> para enviar todos os arquivos direto para o seu repositório no GitHub.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#0d0d0f] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-500" />
                Passo 2: Importar no Painel da Vercel
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                Preset Vite
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              No site <strong className="text-white">vercel.com</strong>, clique em "Add New Project", selecione seu repositório do GitHub e confirme os campos:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-orange-300">
              <li>Framework Preset: Vite</li>
              <li>Build Command: npm run build</li>
              <li>Output Directory: dist</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="bg-[#0d0d0f] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                Passo 3: Redirecionamentos na Paradise Checkout
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-600/10 text-orange-500 text-[10px] font-mono font-bold">
                URLs de Obrigado
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              No painel da Paradise Checkout (multi.paradisepags.com), configure as URLs de Obrigado pós-compra:
            </p>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold text-gray-300">1. Oferta Principal (Acesso Padrão):</span>
                <div className="bg-[#07080a] p-2.5 rounded-xl border border-white/10 font-mono text-gray-300 text-[11px] break-all select-all">
                  https://area.centraldealivio.com.br/?token=PARADISE-STD-&#123;transaction_id&#125;
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-400">2. Oferta de Upsell (Área Fantasma / VIP):</span>
                <div className="bg-[#07080a] p-2.5 rounded-xl border border-amber-500/30 font-mono text-amber-300 text-[11px] break-all select-all">
                  https://area.centraldealivio.com.br/?token=PARADISE-VIP-&#123;transaction_id&#125;
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#0d0d0f] p-4.5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-400 text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-orange-500" />
                Passo 4: Webhook da Paradise (Opcional)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold">
                POST API
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Para registrar vendas diretamente no backend via HTTP POST:
            </p>
            <div className="bg-[#07080a] p-3 rounded-xl border border-blue-500/30 font-mono text-blue-300 text-[11px] break-all select-all">
              https://area.centraldealivio.com.br/api/webhooks/paradise
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-emerald-500/10 p-4.5 rounded-2xl border border-emerald-500/20 text-emerald-300 space-y-1">
            <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Sua Área de Membros Ativa 24/7 sem Limites!
            </span>
            <p className="text-[11px] text-gray-300">
              Todos os clientes que comprarem na Paradise receberão o token e entrarão direto na área com áudio e bônus desbloqueados de acordo com o plano adquirido.
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/30"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
