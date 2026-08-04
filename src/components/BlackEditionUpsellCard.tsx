import React from 'react';
import { Lock, ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';

export const BONUS_PURCHASE_URL = 'https://mente.centraldealivio.com.br/';

interface BlackEditionUpsellCardProps {
  /** Optional callback if clicking button should navigate to bonus tab */
  onNavigateToBonuses?: () => void;
}

export const BlackEditionUpsellCard: React.FC<BlackEditionUpsellCardProps> = ({
  onNavigateToBonuses,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      
      {/* Lacuna 1: Área Black Edition VIP */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121116] border border-amber-500/30 p-5 sm:p-6 shadow-2xl shadow-amber-500/5 group transition-all duration-300 hover:border-amber-500/50 flex flex-col justify-between">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header with Lock Icon */}
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-amber-400 font-sans">
              ÁREA BLACK EDITION VIP
            </span>
          </div>

          {/* Description Text */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
            Você possui o plano Padrão. Quer acessar o Protocolo 100 BPM, Raio-X do Gatilho e Blindagem do Vínculo?
          </p>
        </div>

        {/* Purchase Button */}
        <div>
          <a
            href={BONUS_PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all flex items-center justify-center space-x-2 group-hover:border-amber-400 cursor-pointer shadow-md text-center"
          >
            <span>Ver Área Black Edition</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0" />
          </a>
        </div>
      </div>

      {/* Lacuna 2: Pacote de Bônus Exclusivos */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121116] border border-orange-500/30 p-5 sm:p-6 shadow-2xl shadow-orange-500/5 group transition-all duration-300 hover:border-orange-500/50 flex flex-col justify-between">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header with Sparkles Icon */}
          <div className="flex items-center space-x-2 text-orange-400 mb-2">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="font-bold text-xs sm:text-sm uppercase tracking-wider text-orange-400 font-sans">
              PACOTE DE BÔNUS EXCLUSIVOS
            </span>
          </div>

          {/* Description Text */}
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
            Ainda não adquiriu os bônus? Adquira a oferta especial para desbloquear todas as ferramentas complementares do curso.
          </p>
        </div>

        {/* Purchase Button */}
        <div>
          <a
            href={BONUS_PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 font-bold text-xs sm:text-sm border border-orange-500/40 transition-all flex items-center justify-center space-x-2 group-hover:border-orange-400 cursor-pointer shadow-md text-center"
          >
            <span>Adquirir Oferta Especial dos Bônus</span>
            <ArrowUpRight className="w-4 h-4 text-orange-400 shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
};

