/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, CheckCircle2, ExternalLink, ArrowRight, X, Sparkles, Copy, Share2, Lock, ShieldCheck } from 'lucide-react';

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

  // Selected Offer Features
  const [incBonus1, setIncBonus1] = useState(false);
  const [incBonus2, setIncBonus2] = useState(false);
  const [incBonus3, setIncBonus3] = useState(false);
  const [incVipCommunity, setIncVipCommunity] = useState(false);

  const [generatedResult, setGeneratedResult] = useState<{
    token: string;
    redirectUrl: string;
    summary: string[];
  } | null>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [isMessageCopied, setIsMessageCopied] = useState(false);

  // Quick Preset Handlers
  const handleSelectPreset = (type: 'standard' | 'b1' | 'b2' | 'b3' | 'all_bonuses' | 'supremo') => {
    switch (type) {
      case 'standard':
        setIncBonus1(false);
        setIncBonus2(false);
        setIncBonus3(false);
        setIncVipCommunity(false);
        break;
      case 'b1':
        setIncBonus1(true);
        setIncBonus2(false);
        setIncBonus3(false);
        setIncVipCommunity(false);
        break;
      case 'b2':
        setIncBonus1(false);
        setIncBonus2(true);
        setIncBonus3(false);
        setIncVipCommunity(false);
        break;
      case 'b3':
        setIncBonus1(false);
        setIncBonus2(false);
        setIncBonus3(true);
        setIncVipCommunity(false);
        break;
      case 'all_bonuses':
        setIncBonus1(true);
        setIncBonus2(true);
        setIncBonus3(true);
        setIncVipCommunity(false);
        break;
      case 'supremo':
        setIncBonus1(true);
        setIncBonus2(true);
        setIncBonus3(true);
        setIncVipCommunity(true);
        break;
    }
  };

  const handleGenerateLink = async () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    let token = `PARADISE-STD-${randomSuffix}`;

    const summary: string[] = ['Ebook Principal (Antes da Explosão)', 'Audiobook Narração Guiada MP3'];

    if (incVipCommunity) {
      token = `PARADISE-SUPREMO-${randomSuffix}`;
      summary.push('Bônus 1 (Protocolo 100 BPM)');
      summary.push('Bônus 2 (Raio-X do Gatilho)');
      summary.push('Bônus 3 (Blindagem do Vínculo)');
      summary.push('👑 Comunidade VIP Black');
    } else if (incBonus1 && incBonus2 && incBonus3) {
      token = `TOKEN-ALL-BONUSES-${randomSuffix}`;
      summary.push('Bônus 1 (Protocolo 100 BPM)');
      summary.push('Bônus 2 (Raio-X do Gatilho)');
      summary.push('Bônus 3 (Blindagem do Vínculo)');
    } else {
      const parts = [];
      if (incBonus1) {
        parts.push('B1');
        summary.push('Bônus 1 (Protocolo 100 BPM)');
      }
      if (incBonus2) {
        parts.push('B2');
        summary.push('Bônus 2 (Raio-X do Gatilho)');
      }
      if (incBonus3) {
        parts.push('B3');
        summary.push('Bônus 3 (Blindagem do Vínculo)');
      }

      if (parts.length > 0) {
        token = `TOKEN-BONUS-${parts.join('-')}-${randomSuffix}`;
      }
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://area.centraldealivio.com.br';
    const redirectUrl = `${origin}/?token=${token}`;

    // Try server API for webhook tracking
    try {
      await fetch('/api/webhooks/paradise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          customer: { name: buyerName, email: buyerEmail },
          token,
          has_b1: incBonus1,
          has_b2: incBonus2,
          has_b3: incBonus3,
          has_vip: incVipCommunity
        })
      });
    } catch {
      // Fallback local
    }

    setGeneratedResult({
      token,
      redirectUrl,
      summary
    });
  };

  const handleCopyLink = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult.redirectUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyWhatsAppMsg = () => {
    if (generatedResult) {
      const msg = `Olá, ${buyerName}! 🚀\n\nSeu acesso à Área de Membros Oficial foi liberado com sucesso!\n\nClique no link direto abaixo para acessar todo o seu conteúdo:\n${generatedResult.redirectUrl}\n\nSeu Token de Acesso Privado: ${generatedResult.token}\n\nBons estudos e excelente transformação!`;
      navigator.clipboard.writeText(msg);
      setIsMessageCopied(true);
      setTimeout(() => setIsMessageCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0e1017] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(212,175,55,0.25)] text-slate-100 my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 rounded-full bg-white/5 hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Gerador de Links Específicos de Acesso
            </h3>
            <p className="text-xs text-amber-300 font-mono">
              Para Checkout Paradise, Kirvano, Hotmart, Eduzz ou Envio Manual
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-3 mb-5 leading-relaxed bg-[#161420] p-3.5 rounded-2xl border border-white/10">
          Escolha exatamente o que o cliente comprou no checkout. O sistema gerará um link direto exclusivo que desbloqueará automaticamente apenas as áreas contratadas!
        </p>

        {/* Preset Selector */}
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
              ⚡ Ofertas Rápidas (Selecione o Plano Comprado):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('standard')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  !incBonus1 && !incBonus2 && !incBonus3 && !incVipCommunity
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-semibold text-white">1. Somente Principal</span>
                <span className="text-[10px] text-gray-400 mt-1">Ebook + Áudio</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('b1')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  incBonus1 && !incBonus2 && !incBonus3 && !incVipCommunity
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-semibold text-white">2. Principal + Bônus 1</span>
                <span className="text-[10px] text-gray-400 mt-1">100 BPM</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('b2')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  !incBonus1 && incBonus2 && !incBonus3 && !incVipCommunity
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-semibold text-white">3. Principal + Bônus 2</span>
                <span className="text-[10px] text-gray-400 mt-1">Raio-X Gatilho</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('b3')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  !incBonus1 && !incBonus2 && incBonus3 && !incVipCommunity
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-semibold text-white">4. Principal + Bônus 3</span>
                <span className="text-[10px] text-gray-400 mt-1">Blindagem Vínculo</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('all_bonuses')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  incBonus1 && incBonus2 && incBonus3 && !incVipCommunity
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-semibold text-white">5. Principal + 3 Bônus</span>
                <span className="text-[10px] text-amber-300 mt-1">Combo Completo</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('supremo')}
                className={`p-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  incVipCommunity
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border-amber-400 text-amber-200 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-[#121018] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>6. SUPREMO</span>
                </span>
                <span className="text-[10px] text-amber-400 mt-1">Tudo + Comunidade</span>
              </button>
            </div>
          </div>

          {/* Form Checkboxes */}
          <div className="space-y-3 bg-[#09070e] p-4 sm:p-5 rounded-2xl border border-white/10">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
              Selecione o Conteúdo Adquirido:
            </h4>

            <label className="flex items-center space-x-3 text-xs text-amber-200 font-semibold p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 cursor-not-allowed">
              <input type="checkbox" checked disabled className="rounded text-amber-500 w-4 h-4" />
              <span>✓ Produto Principal (Ebook + Narração MP3) - [Obrigatório]</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer p-2.5 rounded-xl bg-[#121018] border border-white/5 hover:border-amber-500/30">
              <input
                type="checkbox"
                checked={incBonus1}
                onChange={(e) => setIncBonus1(e.target.checked)}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span>⚡ Bônus 1: Protocolo 100 BPM (Bio-Feedback & SOS Audio)</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer p-2.5 rounded-xl bg-[#121018] border border-white/5 hover:border-amber-500/30">
              <input
                type="checkbox"
                checked={incBonus2}
                onChange={(e) => setIncBonus2(e.target.checked)}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span>🎯 Bônus 2: Raio-X do Gatilho (Diagnosticador Neuro-Comportamental)</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer p-2.5 rounded-xl bg-[#121018] border border-white/5 hover:border-amber-500/30">
              <input
                type="checkbox"
                checked={incBonus3}
                onChange={(e) => setIncBonus3(e.target.checked)}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span>🛡️ Bônus 3: Blindagem do Vínculo (Gerador de Acordo)</span>
            </label>

            <label className="flex items-center space-x-3 text-xs text-amber-300 cursor-pointer p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400">
              <input
                type="checkbox"
                checked={incVipCommunity}
                onChange={(e) => setIncVipCommunity(e.target.checked)}
                className="rounded text-amber-500 w-4 h-4"
              />
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Comunidade VIP Black (Área Fantasma Exclusiva)</span>
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nome do Cliente:
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2 bg-[#121018] border border-white/10 rounded-xl text-xs text-amber-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                E-mail do Cliente:
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#121018] border border-white/10 rounded-xl text-xs text-amber-200"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateLink}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-300 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Gerar Link de Acesso Exclusivo para o Cliente</span>
          </button>
        </div>

        {/* Output Link Display */}
        {generatedResult && (
          <div className="mt-6 bg-[#121522] border-2 border-emerald-500/40 p-5 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Link Personalizado Gerado com Sucesso!</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                TOKEN ATIVO
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">
                Link de Redirecionamento Direto:
              </span>
              <div className="bg-[#080a10] p-3 rounded-xl border border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
                <code className="text-xs text-amber-300 font-mono font-bold truncate">
                  {generatedResult.redirectUrl}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 text-xs text-slate-950 font-bold px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1 shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>
            </div>

            <div className="bg-[#0b0910] p-3.5 rounded-xl border border-white/5 space-y-1.5">
              <span className="text-[11px] font-mono text-amber-300 font-bold block">
                Conteúdos Desbloqueados por este Link:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-300 font-sans">
                {generatedResult.summary.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyWhatsAppMsg}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>{isMessageCopied ? 'Mensagem Copiada!' : 'Copiar Texto P/ WhatsApp'}</span>
              </button>

              <button
                onClick={() => {
                  onSimulateRedirect(generatedResult.token);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md"
              >
                <span>Testar e Logar Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
