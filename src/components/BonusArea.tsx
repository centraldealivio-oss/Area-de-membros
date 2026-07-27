/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UPSELL_BONUSES } from '../data/bonusData';
import { Heart, Activity, Shield, Sparkles, Play, Pause, CheckCircle2, RotateCcw, Copy, FileText, Send } from 'lucide-react';

export const BonusArea: React.FC = () => {
  const [activeBonusTab, setActiveBonusTab] = useState<'b1' | 'b2' | 'b3'>('b1');

  // --- BONUS 1 STATE (Breathing Protocol) ---
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [breathTimer, setBreathTimer] = useState(4);
  const [simulatedBpm, setSimulatedBpm] = useState(122);
  const [breathCycleCount, setBreathCycleCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (breathPhase === 'inspire') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('expire');
              return 8;
            } else {
              setBreathPhase('inspire');
              setBreathCycleCount(c => c + 1);
              setSimulatedBpm(bpm => Math.max(68, bpm - 9));
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathTimer(4);
      setBreathPhase('inspire');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathPhase]);

  // --- BONUS 2 STATE (Quiz Raio-X do Gatilho) ---
  const quizQuestions = [
    {
      id: 1,
      q: '1. O que você sente fisicamente quando percebe um tom de voz ríspido no parceiro?',
      options: [
        { label: 'Aperto imediato no peito e vontade urgente de exigir explicação', type: 'ansioso' },
        { label: 'Tensão nos ombros, estômago fechado e vontade de se isolar', type: 'evitativo' },
        { label: 'Onda de raiva seguida de vontade de se aproximar e afastar', type: 'desorganizado' },
        { label: 'Mente entra em parafuso tentando analisar todas as causas possíveis', type: 'trava' }
      ]
    },
    {
      id: 2,
      q: '2. Qual é sua reação automática quando uma briga começa no WhatsApp?',
      options: [
        { label: 'Mando mensagens longas seguidas tentando fazer o outro entender agora', type: 'ansioso' },
        { label: 'Paro de responder ou desligo o celular para não ler mais nada', type: 'evitativo' },
        { label: 'Digito textos duros, depois apago, peço desculpas e sumo em seguida', type: 'desorganizado' },
        { label: 'Releio a conversa 20 vezes sem conseguir decidir o que responder', type: 'trava' }
      ]
    },
    {
      id: 3,
      q: '3. Diante de um momento de ciúmes, qual é seu maior medo inconsciente?',
      options: [
        { label: 'Ser trocado ou abandonado por alguém melhor', type: 'ansioso' },
        { label: 'Perder minha liberdade e ser sufocado/controlado', type: 'evitativo' },
        { label: 'Ser enganado e passar por ingênuo/tolo', type: 'desorganizado' },
        { label: 'Tomar uma atitude errada e estragar tudo sem querer', type: 'trava' }
      ]
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const handleSelectQuizOption = (qId: number, type: string) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: type }));
  };

  const handleFinishQuiz = () => {
    const counts: Record<string, number> = { ansioso: 0, evitativo: 0, desorganizado: 0, trava: 0 };
    Object.values(quizAnswers).forEach((type: string) => {
      counts[type] = (counts[type] || 0) + 1;
    });
    let topType = 'ansioso';
    let max = -1;
    Object.entries(counts).forEach(([t, val]) => {
      if (val > max) {
        max = val;
        topType = t;
      }
    });

    const resultDescriptions: Record<string, string> = {
      ansioso: 'Perfil Hiper-Vigilante (Ansioso): Seu sistema límbico responde com medo de abandono. Seu gatilho ativa cobrança imediata. Ação: Usar o Protocolo de Pausa de 20 min antes de enviar mensagens.',
      evitativo: 'Perfil Desconectado (Evitativo): Seu sistema límbico responde com medo de sufocamento. Seu gatilho ativa a fuga. Ação: Avisar antes de se afastar: "Preciso de 20 min, mas não estou te abandonando".',
      desorganizado: 'Perfil Oscilante (Desorganizado): Seu cérebro alterna entre busca urgente por afeto e repulsa imediata por medo de traição. Ação: Nomear o conflito em voz baixa.',
      trava: 'Perfil Trava por Análise: Você gasta tanta energia no córtex racional tentando entender que congela a ação. Ação: Focar na sensação somática do corpo.'
    };

    setQuizResult(resultDescriptions[topType] || resultDescriptions.ansioso);
  };

  // --- BONUS 3 STATE (Agreement Builder) ---
  const [partnerName, setPartnerName] = useState('');
  const [rulePausa, setRulePausa] = useState(true);
  const [ruleSemGritos, setRuleSemGritos] = useState(true);
  const [copiedAgreement, setCopiedAgreement] = useState(false);

  const generatedAgreementText = `CONTRATO DE SEGURANÇA EMOCIONAL & BLINDAGEM DE VÍNCULO

Partes: Eu e ${partnerName || '[Nome do Parceiro(a)]'}

Acordos Inquebráveis em Momentos de Tensão:
1. ${rulePausa ? '✓ Regra dos 20 Minutos: Se o coração passar dos 100 BPM, qualquer um pode solicitar a pausa sagrada de 20 min sem ser acusado de fuga.' : '✓ Comunicação clara sem interrupção.'}
2. ${ruleSemGritos ? '✓ Fim do Tom de Ameaça: Nenhum dos dois usará ameaças de término no calor da discussão.' : '✓ Respeito ao tom de voz.'}
3. ✓ Foco no Problema, Não na Pessoa: Trocar "Você é irresponsável" por "Eu me senti inseguro com essa atitude".

Assinado e Válido para a Vida Toda.`;

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(generatedAgreementText);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* VIP Header Banner */}
      <div className="bg-gradient-to-r from-[#171306] via-[#221c08] to-[#120f06] border border-amber-500/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_40px_rgba(212,175,55,0.2)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Área Fantasma VIP • Liberada com Sucesso</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 bg-clip-text text-transparent">
              Ferramentas Exclusivas de Proteção do Vínculo
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Estes bônus contêm aplicadores práticos bio-feedback e mapeadores neuro-comportamentais projetados para uso em momentos de emergência emocional.
            </p>
          </div>

          {/* Bonus Navigation Tabs */}
          <div className="flex bg-[#0b0c12] p-1.5 rounded-2xl border border-amber-500/30 shrink-0">
            <button
              onClick={() => setActiveBonusTab('b1')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeBonusTab === 'b1'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Bônus 1: 100 BPM</span>
            </button>

            <button
              onClick={() => setActiveBonusTab('b2')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeBonusTab === 'b2'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Bônus 2: Raio-X</span>
            </button>

            <button
              onClick={() => setActiveBonusTab('b3')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeBonusTab === 'b3'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Bônus 3: Blindagem</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- BONUS 1: PROTOCOLO 100 BPM (Breathing Trainer) --- */}
      {activeBonusTab === 'b1' && (
        <div className="bg-[#0b0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Bônus 1 • Treinador Bio-Feedback Fisiológico
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-100">
                Protocolo 100 BPM: Desativação Fisiológica do Flooding
              </h3>
            </div>

            <div className="bg-[#121522] px-4 py-2 rounded-xl border border-amber-500/20 text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Frequência Cardíaca Simulação</span>
              <span className={`font-mono text-xl font-bold ${simulatedBpm > 100 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                {simulatedBpm} BPM {simulatedBpm > 100 ? '⚠️ (FLOODING)' : '✓ (CALMA)'}
              </span>
            </div>
          </div>

          {/* Interactive Breathing Visualizer Circle */}
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div
                className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathPhase === 'inspire'
                    ? 'scale-110 border-amber-400 shadow-[0_0_60px_rgba(212,175,55,0.4)] bg-amber-500/10'
                    : breathPhase === 'hold'
                    ? 'scale-105 border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.3)] bg-indigo-500/10'
                    : 'scale-90 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-emerald-500/10'
                }`}
              >
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                  {isBreathingActive ? 'Fase Atual:' : 'Pronto para iniciar'}
                </span>

                <h4 className="font-serif text-2xl font-bold uppercase text-amber-300 tracking-wide">
                  {isBreathingActive
                    ? breathPhase === 'inspire'
                      ? 'INSPIRE LENTAMENTE'
                      : breathPhase === 'hold'
                      ? 'SEGURE O AR'
                      : 'ESPIRE SOLTANDO A TENSÃO'
                    : 'CLIQUE EM INICIAR'}
                </h4>

                <span className="font-mono text-4xl font-extrabold text-slate-100 my-2">
                  {isBreathingActive ? `${breathTimer}s` : '4-7-8'}
                </span>

                <span className="text-[11px] text-slate-400 font-mono">
                  Ciclos Concluídos: {breathCycleCount}
                </span>
              </div>
            </div>

            {/* Start / Pause Control */}
            <div className="mt-8 flex items-center space-x-4">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center space-x-2"
              >
                {isBreathingActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-slate-950" />
                    <span>Pausar Respiração</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    <span>Iniciar Ritmo 4-7-8</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setSimulatedBpm(122);
                  setBreathCycleCount(0);
                }}
                className="p-3 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BONUS 2: RAIO-X DO GATILHO (Quiz) --- */}
      {activeBonusTab === 'b2' && (
        <div className="bg-[#0b0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Bônus 2 • Diagnóstico Neuro-Comportamental
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-100">
              Raio-X do Gatilho: Teste de Mapeamento de Apego Inconsciente
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Responda às 3 questões abaixo para identificar como a amígdala dispara seu estado de defesa:
            </p>
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q) => (
              <div key={q.id} className="bg-[#0e1018] p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                  {q.q}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, i) => {
                    const isSelected = quizAnswers[q.id] === opt.type;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectQuizOption(q.id, opt.type)}
                        className={`w-full p-3.5 rounded-xl text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50'
                            : 'bg-[#07080e] text-slate-300 border border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleFinishQuiz}
              disabled={Object.keys(quizAnswers).length < 3}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 transition-all disabled:opacity-40"
            >
              Ver Resultado do Raio-X & Script
            </button>

            {quizResult && (
              <div className="bg-amber-500/10 border border-amber-500/40 p-6 rounded-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-serif font-bold text-base">Resultado do Mapeamento</h4>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-sans">
                  {quizResult}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- BONUS 3: BLINDAGEM DO VÍNCULO (Agreement Builder) --- */}
      {activeBonusTab === 'b3' && (
        <div className="bg-[#0b0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Bônus 3 • Gerador de Acordos Inquebráveis
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-100">
              Blindagem do Vínculo: Contrato de Limites Emocionais
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Crie um termo claro com seu parceiro(a) para pausar brigas antes que a explosão destrua a confiança.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Options */}
            <div className="space-y-4 bg-[#0e1018] p-6 rounded-2xl border border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Nome do Parceiro(a):
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Ex: Gabriel / Juliana"
                  className="w-full px-4 py-3 bg-[#07080e] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rulePausa}
                    onChange={(e) => setRulePausa(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Incluir Regra dos 20 Minutos de Pausa Sagrada</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleSemGritos}
                    onChange={(e) => setRuleSemGritos(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span>Proibir Ameaças de Término no Calor do Momento</span>
                </label>
              </div>
            </div>

            {/* Generated Agreement Box */}
            <div className="bg-[#07080d] p-6 rounded-2xl border border-amber-500/30 space-y-4 font-mono text-xs text-amber-200/90 relative">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Pré-visualização do Acordo</span>
                <button
                  onClick={handleCopyAgreement}
                  className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold border border-amber-500/30 flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedAgreement ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-amber-100/90">
                {generatedAgreementText}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
