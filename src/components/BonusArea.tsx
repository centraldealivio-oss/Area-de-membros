/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UPSELL_BONUSES } from '../data/bonusData';
import { UserSession, UnlockedPermissions } from '../types';
import { getStoredSession, redeemAdditionalToken, computePermissions, validateTokenOnlineOrLocal, saveSession } from '../lib/tokenAuth';
import { Heart, Activity, Shield, Sparkles, Play, Pause, CheckCircle2, RotateCcw, Copy, FileText, Send, ArrowRight, Clock, Volume2, Sparkle, ShieldCheck, Zap, Lock, KeyRound, ShieldAlert } from 'lucide-react';

interface BonusAreaProps {
  session?: UserSession | null;
  onUpdateSession?: (session: UserSession) => void;
}

export const BonusArea: React.FC<BonusAreaProps> = ({ session: propSession, onUpdateSession }) => {
  const [currentSession, setCurrentSession] = useState<UserSession | null>(
    propSession || getStoredSession()
  );
  const [activeBonusTab, setActiveBonusTab] = useState<'b1' | 'b2' | 'b3'>('b1');

  // Token redemption states inside Bonus Area
  const [bonusTokenInput, setBonusTokenInput] = useState('');
  const [tokenErrorMsg, setTokenErrorMsg] = useState<string | null>(null);
  const [tokenSuccessMsg, setTokenSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propSession) {
      setCurrentSession(propSession);
    }
  }, [propSession]);

  const perms = currentSession?.permissions || computePermissions(currentSession?.token || '', currentSession?.tier);

  const hasB1 = Boolean(perms.bonus1 || perms.isSupremo);
  const hasB2 = Boolean(perms.bonus2 || perms.isSupremo);
  const hasB3 = Boolean(perms.bonus3 || perms.isSupremo);

  // Auto-select tab for unlocked bonus on mount or session change
  useEffect(() => {
    if (hasB1) {
      setActiveBonusTab('b1');
    } else if (hasB2) {
      setActiveBonusTab('b2');
    } else if (hasB3) {
      setActiveBonusTab('b3');
    }
  }, [hasB1, hasB2, hasB3]);

  const handleActivateBonusToken = async (customToken?: string) => {
    const raw = (customToken || bonusTokenInput).trim();
    if (!raw) {
      setTokenErrorMsg('Digite seu token de acesso.');
      return;
    }
    setIsLoading(true);
    setTokenErrorMsg(null);
    setTokenSuccessMsg(null);

    try {
      const validated = await validateTokenOnlineOrLocal(raw);
      let updatedSession: UserSession;

      if (validated) {
        const currentPerms = currentSession?.permissions || computePermissions(currentSession?.token || '', currentSession?.tier);
        const newPerms = validated.permissions || computePermissions(validated.token, validated.tier);

        const mergedPerms: UnlockedPermissions = {
          mainBook: true,
          bonus1: currentPerms.bonus1 || newPerms.bonus1,
          bonus2: currentPerms.bonus2 || newPerms.bonus2,
          bonus3: currentPerms.bonus3 || newPerms.bonus3,
          vipCommunity: currentPerms.vipCommunity || newPerms.vipCommunity,
          isSupremo: currentPerms.isSupremo || newPerms.isSupremo
        };

        const isFullyVip = mergedPerms.bonus1 && mergedPerms.bonus2 && mergedPerms.bonus3;

        updatedSession = {
          ...(currentSession || validated),
          token: validated.token || currentSession?.token || raw,
          tier: isFullyVip ? 'vip_upsell' : (validated.tier !== 'standard' ? validated.tier : currentSession?.tier || 'standard'),
          permissions: mergedPerms
        };
      } else {
        const baseSession = currentSession || {
          token: raw,
          tier: 'standard',
          customerName: 'Membro Paradise',
          customerEmail: 'membro@paradise.com',
          authenticatedAt: new Date().toISOString(),
          permissions: perms
        };

        const res = redeemAdditionalToken(baseSession, raw);
        if (!res) {
          setTokenErrorMsg('Token não reconhecido. Verifique o código e tente novamente.');
          setIsLoading(false);
          return;
        }
        updatedSession = res.updatedSession;
      }

      setCurrentSession(updatedSession);
      saveSession(updatedSession);
      if (onUpdateSession) onUpdateSession(updatedSession);

      setTokenSuccessMsg('Bônus ativado com sucesso! Conteúdo liberado.');
      setBonusTokenInput('');

      // Auto switch to unlocked tab
      if (updatedSession.permissions.bonus1 && activeBonusTab === 'b1') setActiveBonusTab('b1');
      else if (updatedSession.permissions.bonus2) setActiveBonusTab('b2');
      else if (updatedSession.permissions.bonus3) setActiveBonusTab('b3');
      else if (updatedSession.permissions.bonus1) setActiveBonusTab('b1');
    } catch {
      setTokenErrorMsg('Erro ao validar token. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLockedBonusView = (bonusNum: number, bonusTitle: string, defaultToken: string) => (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="bg-[#100e15] border border-amber-500/20 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
            Bônus {bonusNum} Restrito
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">
            {bonusTitle}
          </h3>
          <p className="text-xs text-gray-300 max-w-lg mx-auto leading-relaxed">
            Caso já tenha adquirido seu bônus, insira seu token abaixo para desbloquear este módulo instantaneamente:
          </p>
        </div>

        <div className="bg-[#0b0a0e] border border-white/10 p-5 rounded-2xl max-w-md mx-auto space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-200">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Ativar Bônus {bonusNum} com seu Token</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={bonusTokenInput}
              onChange={(e) => setBonusTokenInput(e.target.value)}
              placeholder="Digite seu token de acesso"
              className="flex-1 px-4 py-3 bg-[#13111a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => handleActivateBonusToken()}
              disabled={isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 transition-all shrink-0 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Ativando...' : 'Ativar'}
            </button>
          </div>

          {tokenErrorMsg && (
            <p className="text-xs text-rose-400 font-medium">{tokenErrorMsg}</p>
          )}
          {tokenSuccessMsg && (
            <p className="text-xs text-emerald-400 font-medium">{tokenSuccessMsg}</p>
          )}
        </div>
      </div>
    </div>
  );

  // --- BONUS 1 STATE (Breathing Protocol & SOS Audio) ---
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'hold' | 'expire'>('inspire');
  const [breathTimer, setBreathTimer] = useState(4);
  const [simulatedBpm, setSimulatedBpm] = useState(122);
  const [breathCycleCount, setBreathCycleCount] = useState(0);

  // Audio SOS Simulation State
  const [isSosAudioPlaying, setIsSosAudioPlaying] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inspire') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('expire');
              return 8;
            } else {
              setBreathPhase('inspire');
              setBreathCycleCount(c => c + 1);
              setSimulatedBpm(bpm => Math.max(65, bpm - 8));
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

  // Handle SOS Audio Player with real soothing voice narration
  const toggleSosAudio = () => {
    if (isSosAudioPlaying) {
      setIsSosAudioPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsSosAudioPlaying(true);
      setSosProgress(0);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const sosText = "Respire fundo. Você está em um ambiente seguro agora. Essa sensação de aperto no peito e essa vontade de reagir no impulso são apenas o seu cérebro em estado de alerta tentando te proteger. Mas você não precisa brigar, chorar ou mandar mensagens no desespero agora. Solte os seus ombros. Deixe o ar sair bem devagar pela sua boca. Lembre-se: qualquer decisão ou resposta tomada com os batimentos acelerados será guiada pela dor, e não pela sua sabedoria. Dê a si mesma vinte minutos de silêncio e calma. Você é dona das suas emoções e é totalmente capaz de proteger o seu coração com paz e serenidade.";

        const utterance = new SpeechSynthesisUtterance(sosText);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.88; // Soothing, warm narrative pace
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(v => v.lang.toLowerCase().includes('pt') || v.lang.toLowerCase().includes('br'));

        const bestVoice = [...ptVoices].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          let scoreA = 0, scoreB = 0;
          if (nameA.includes('maria') || nameA.includes('desktop')) scoreA -= 200;
          if (nameB.includes('maria') || nameB.includes('desktop')) scoreB -= 200;
          if (nameA.includes('natural') || nameA.includes('online') || nameA.includes('neural')) scoreA += 200;
          if (nameB.includes('natural') || nameB.includes('online') || nameB.includes('neural')) scoreB += 200;
          if (nameA.includes('google')) scoreA += 150;
          if (nameB.includes('google')) scoreB += 150;
          if (nameA.includes('francisca') || nameA.includes('luciana') || nameA.includes('camila')) scoreA += 100;
          if (nameB.includes('francisca') || nameB.includes('luciana') || nameB.includes('camila')) scoreB += 100;
          return scoreB - scoreA;
        })[0];

        if (bestVoice) {
          utterance.voice = bestVoice;
        }

        utterance.onend = () => {
          setIsSosAudioPlaying(false);
          setSosProgress(100);
        };

        utterance.onerror = () => {
          setIsSosAudioPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSosAudioPlaying) {
      timer = setInterval(() => {
        setSosProgress(prev => {
          if (prev >= 100) {
            setIsSosAudioPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSosAudioPlaying]);

  // --- BONUS 2 STATE (Quiz Raio-X do Gatilho) ---
  const quizQuestions = [
    {
      id: 1,
      q: '1. O que você sente no corpo quando percebe um tom de voz ríspido ou distante do parceiro?',
      options: [
        { label: 'Aperto imediato no peito, taquicardia e vontade urgente de exigir explicações', type: 'ansioso' },
        { label: 'Tensão nos ombros, nó na garganta e vontade de se isolar e calar', type: 'evitativo' },
        { label: 'Onda de raiva súbita seguida de confusão e vontade de brigar e fugir ao mesmo tempo', type: 'desorganizado' },
        { label: 'Mente em parafuso tentando analisar exaustivamente onde você errou', type: 'trava' }
      ]
    },
    {
      id: 2,
      q: '2. Qual é sua reação automática quando uma discussão começa no WhatsApp?',
      options: [
        { label: 'Envio várias mensagens longas tentando fazer o outro entender meu lado agora', type: 'ansioso' },
        { label: 'Paro de responder imediatamente ou coloco o celular no modo avião', type: 'evitativo' },
        { label: 'Digito textos duros, depois apago, peço desculpas e me afasto magoada', type: 'desorganizado' },
        { label: 'Releio as mensagens dezenas de vezes sem conseguir decidir o que escrever', type: 'trava' }
      ]
    },
    {
      id: 3,
      q: '3. Diante de um momento de insegurança ou ciúmes, qual é seu maior medo inconsciente?',
      options: [
        { label: 'Ser trocada, rejeitada ou abandonada por alguém melhor', type: 'ansioso' },
        { label: 'Perder minha liberdade, paz de espírito e ser sufocada', type: 'evitativo' },
        { label: 'Ser enganada, passar por ingênua e ter minha confiança pisoteada', type: 'desorganizado' },
        { label: 'Tomar uma atitude errada no impulso e estragar o relacionamento', type: 'trava' }
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
      ansioso: '🌸 Perfil Hiper-Vigilante (Apego Ansioso): Seu sistema nervoso reage ao menor sinal de distanciamento com medo de rejeição. Seu gatilho ativa a cobrança e o desespero por respostas. Ação Imediata: Ativar o Protocolo de Pausa de 20 min antes de mandar mensagens e focar na respiração 4-7-8.',
      evitativo: '🛡️ Perfil Protetor/Evitativo: Seu sistema nervoso reage à sobrecarga emocional com medo de invasão e sufocamento. Seu gatilho ativa a desconexão rápida. Ação Imediata: Avisar em tom suave: "Preciso de 20 min para me acalmar, mas estou aqui e não vou te abandonar".',
      desorganizado: '🔥 Perfil Oscilante Emocional: Seu cérebro alterna entre busca urgente por acolhimento e medo de traição. Ação Imediata: Dizer em voz alta "Eu estou segura agora, não preciso agir no impulso".',
      trava: '💡 Perfil Análise & Congelamento: Você consome energia no racional tentando entender tudo, ficando paralisada. Ação Imediata: Voltar ao corpo físico com uma caminhada ou copo de água gelada.'
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
1. ${rulePausa ? '✓ Regra dos 20 Minutos: Se o coração passar dos 100 BPM ou a conversa virar discussão, qualquer um pode solicitar a pausa de 20 min sem ser acusado de fuga.' : '✓ Comunicação clara com espaço para escuta.'}
2. ${ruleSemGritos ? '✓ Fim do Tom de Ameaça: Fica proibido usar ameaças de término ou gritos no calor do momento.' : '✓ Respeito ao tom de voz e ritmo.'}
3. ✓ Foco na Solução, Não na Agressão: Trocar "Você sempre faz isso" por "Eu me senti insegura com essa situação".

Assinado com carinho para proteger nosso relacionamento.`;

  const handleCopyAgreement = () => {
    navigator.clipboard.writeText(generatedAgreementText);
    setCopiedAgreement(true);
    setTimeout(() => setCopiedAgreement(false), 2500);
  };

  const scrollToTool = (tab: 'b1' | 'b2' | 'b3') => {
    setActiveBonusTab(tab);
    setTimeout(() => {
      const el = document.getElementById('interactive-bonus-workspace');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto pb-12">
      
      {/* Welcoming Header Banner */}
      <div className="bg-gradient-to-r from-[#1a141b] via-[#241a22] to-[#120e14] border border-rose-500/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Área de Bônus Exclusivos • Liberada</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold bg-gradient-to-r from-rose-100 via-amber-200 to-rose-200 bg-clip-text text-transparent">
              Seu Espaço Acolhedor de Proteção & Paz Emocional
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
              Ferramentas interativas, áudio SOS emergencial e guias práticos desenvolvidos para acalmar seu coração, desativar gatilhos de ansiedade e proteger o seu relacionamento.
            </p>
          </div>

          <div className="bg-[#120f16] p-4 rounded-2xl border border-rose-500/20 text-center shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block mb-1">Status de Acesso</span>
            <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-xs font-bold font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>BLACK EDITION VIP ATIVADO</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- VISUAL OVERVIEW CARDS GRID (Instant Visual Understanding) --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Guia Visual dos Bônus Interativos</span>
          </h3>
          <span className="text-xs text-gray-400 font-mono">3 Ferramentas Prontas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Bônus 1 */}
          <div 
            onClick={() => scrollToTool('b1')}
            className={`group cursor-pointer bg-[#121118] border rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl ${
              activeBonusTab === 'b1' ? 'border-amber-400 shadow-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="relative mb-4 rounded-2xl overflow-hidden aspect-[16/10] bg-[#09080c] border border-white/10">
                <img
                  src={UPSELL_BONUSES[0].coverImage}
                  alt={UPSELL_BONUSES[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  ÁUDIO & BIO-FEEDBACK
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-1">
                BÔNUS 1 • FISIOLÓGICO
              </span>
              <h4 className="font-bold text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                {UPSELL_BONUSES[0].title}
              </h4>
              <p className="text-xs text-rose-300/90 italic mb-2">
                "{UPSELL_BONUSES[0].subtitle}"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {UPSELL_BONUSES[0].description}
              </p>
            </div>

            <button
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                activeBonusTab === 'b1'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-amber-300 group-hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Abrir Bio-Feedback 4-7-8</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Bônus 2 */}
          <div 
            onClick={() => scrollToTool('b2')}
            className={`group cursor-pointer bg-[#121118] border rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl ${
              activeBonusTab === 'b2' ? 'border-amber-400 shadow-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="relative mb-4 rounded-2xl overflow-hidden aspect-[16/10] bg-[#09080c] border border-white/10">
                <img
                  src={UPSELL_BONUSES[1].coverImage}
                  alt={UPSELL_BONUSES[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  TESTE INTERATIVO
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-1">
                BÔNUS 2 • MAPEMENTO
              </span>
              <h4 className="font-bold text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                {UPSELL_BONUSES[1].title}
              </h4>
              <p className="text-xs text-rose-300/90 italic mb-2">
                "{UPSELL_BONUSES[1].subtitle}"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {UPSELL_BONUSES[1].description}
              </p>
            </div>

            <button
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                activeBonusTab === 'b2'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-amber-300 group-hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Iniciar Raio-X do Gatilho</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Bônus 3 */}
          <div 
            onClick={() => scrollToTool('b3')}
            className={`group cursor-pointer bg-[#121118] border rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] shadow-xl ${
              activeBonusTab === 'b3' ? 'border-amber-400 shadow-amber-500/10' : 'border-white/10 hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="relative mb-4 rounded-2xl overflow-hidden aspect-[16/10] bg-[#09080c] border border-white/10">
                <img
                  src={UPSELL_BONUSES[2].coverImage}
                  alt={UPSELL_BONUSES[2].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                  GERADOR DE TERMO
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block mb-1">
                BÔNUS 3 • ACORDOS
              </span>
              <h4 className="font-bold text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                {UPSELL_BONUSES[2].title}
              </h4>
              <p className="text-xs text-rose-300/90 italic mb-2">
                "{UPSELL_BONUSES[2].subtitle}"
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                {UPSELL_BONUSES[2].description}
              </p>
            </div>

            <button
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                activeBonusTab === 'b3'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-amber-300 group-hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Gerar Contrato de Limites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* --- INTERACTIVE WORKSPACE SECTION --- */}
      <div id="interactive-bonus-workspace" className="scroll-mt-28 space-y-6">
        
        {/* Navigation Selector Bar */}
        <div className="flex items-center justify-between bg-[#121118] p-2 rounded-2xl border border-white/10 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveBonusTab('b1')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeBonusTab === 'b1'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Ferramenta 1: Protocolo 100 BPM</span>
            {hasB1 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-1">✓ Liberado</span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 ml-1">🔒 Bloqueado</span>
            )}
          </button>

          <button
            onClick={() => setActiveBonusTab('b2')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeBonusTab === 'b2'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Ferramenta 2: Raio-X do Gatilho</span>
            {hasB2 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-1">✓ Liberado</span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 ml-1">🔒 Bloqueado</span>
            )}
          </button>

          <button
            onClick={() => setActiveBonusTab('b3')}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 ${
              activeBonusTab === 'b3'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Ferramenta 3: Blindagem do Vínculo</span>
            {hasB3 ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-1">✓ Liberado</span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 ml-1">🔒 Bloqueado</span>
            )}
          </button>
        </div>

        {/* Global Success Notification banner if redeemed */}
        {tokenSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {tokenSuccessMsg}
            </span>
            <button onClick={() => setTokenSuccessMsg(null)} className="text-gray-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {/* --- BONUS 1 TOOL WORKSPACE --- */}
        {activeBonusTab === 'b1' && (
          hasB1 ? (
            <div className="bg-[#100e15] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                    Bônus 1 • Treinador Bio-Feedback & Áudio SOS
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Protocolo 100 BPM: Desativação Fisiológica do Taquicardia
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Use durante discussões calorosas ou crises de ansiedade para acalmar a mente e reativar a lógica.
                  </p>
                </div>

                <div className="bg-[#181422] px-5 py-2.5 rounded-2xl border border-rose-500/30 text-center shrink-0">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Frequência Cardíaca Atual</span>
                  <span className={`font-mono text-xl font-bold ${simulatedBpm > 100 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    {simulatedBpm} BPM {simulatedBpm > 100 ? '⚠️ (ESTADO DE ALARME)' : '✓ (CALMA ALCANÇADA)'}
                  </span>
                </div>
              </div>

              {/* Audio SOS Emergencial Card */}
              <div className="bg-[#181420] border border-rose-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Áudio SOS Emergencial (3 Minutos)</h4>
                      <p className="text-xs text-gray-400">Escute com fones no meio do conflito para acalmar os batimentos imediatamente</p>
                    </div>
                  </div>

                  <button
                    onClick={toggleSosAudio}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30 flex items-center space-x-2 shrink-0"
                  >
                    {isSosAudioPlaying ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Pausar Áudio SOS</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                        <span>Ouvir Áudio SOS</span>
                      </>
                    )}
                  </button>
                </div>

                {/* SOS Audio Progress */}
                {isSosAudioPlaying && (
                  <div className="space-y-1 pt-2 animate-fadeIn">
                    <div className="flex justify-between text-[10px] font-mono text-rose-300">
                      <span>Narração Calma em Execução...</span>
                      <span>{sosProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${sosProgress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Breathing Visualizer Circle */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative flex items-center justify-center">
                  {/* Outer Glow Ring */}
                  <div
                    className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                      breathPhase === 'inspire'
                        ? 'scale-110 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.3)] bg-amber-500/10'
                        : breathPhase === 'hold'
                        ? 'scale-105 border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.3)] bg-indigo-500/10'
                        : 'scale-90 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] bg-emerald-500/10'
                    }`}
                  >
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
                      {isBreathingActive ? 'Fase do Exercício:' : 'Visualizador Prontos'}
                    </span>

                    <h4 className="font-serif text-xl sm:text-2xl font-bold uppercase text-amber-300 tracking-wide text-center px-4">
                      {isBreathingActive
                        ? breathPhase === 'inspire'
                          ? 'INSPIRE LENTAMENTE'
                          : breathPhase === 'hold'
                          ? 'SEGURE O AR'
                          : 'ESPIRE SOLTANDO A TENSÃO'
                        : 'CLIQUE EM INICIAR'}
                    </h4>

                    <span className="font-mono text-4xl font-extrabold text-white my-2">
                      {isBreathingActive ? `${breathTimer}s` : '4-7-8'}
                    </span>

                    <span className="text-[11px] text-gray-400 font-mono">
                      Ciclos Concluídos: {breathCycleCount}
                    </span>
                  </div>
                </div>

                {/* Start / Pause Control */}
                <div className="mt-8 flex items-center space-x-4">
                  <button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 transition-all shadow-lg shadow-amber-500/20 flex items-center space-x-2"
                  >
                    {isBreathingActive ? (
                      <>
                        <Pause className="w-4 h-4 fill-slate-950" />
                        <span>Pausar Exercício</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                        <span>Iniciar Ritmo Guiado 4-7-8</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsBreathingActive(false);
                      setSimulatedBpm(122);
                      setBreathCycleCount(0);
                    }}
                    className="p-3.5 rounded-2xl bg-white/5 text-gray-400 hover:text-white border border-white/10"
                    title="Reiniciar Simulação"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            renderLockedBonusView(1, 'Protocolo 100 BPM (Bio-Feedback & SOS Audio)', 'TOKEN-BONUS1-BPM100')
          )
        )}

        {/* --- BONUS 2 TOOL WORKSPACE --- */}
        {activeBonusTab === 'b2' && (
          hasB2 ? (
            <div className="bg-[#100e15] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Bônus 2 • Diagnosticador Neuro-Comportamental
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Raio-X do Gatilho: Mapeamento de Inseguranças
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Responda às 3 perguntas abaixo para descobrir como seu cérebro aciona o alerta de defesa e como desativá-lo.
                </p>
              </div>

              <div className="space-y-6">
                {quizQuestions.map((q) => (
                  <div key={q.id} className="bg-[#16131d] p-6 rounded-2xl border border-white/10 space-y-4">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200">
                      {q.q}
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt, i) => {
                        const isSelected = quizAnswers[q.id] === opt.type;
                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectQuizOption(q.id, opt.type)}
                            className={`w-full p-4 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 text-amber-200 border-2 border-amber-400 shadow-md'
                                : 'bg-[#0c0a10] text-gray-300 border border-white/5 hover:border-white/20'
                            }`}
                          >
                            <span className="pr-3 leading-relaxed">{opt.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleFinishQuiz}
                  disabled={Object.keys(quizAnswers).length < 3}
                  className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 transition-all disabled:opacity-40 shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Diagnóstico Personalizado</span>
                </button>

                {quizResult && (
                  <div className="bg-gradient-to-r from-amber-500/15 via-[#1a1520] to-rose-500/15 border border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-4 animate-fadeIn shadow-2xl">
                    <div className="flex items-center space-x-2 text-amber-300">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h4 className="font-serif font-bold text-lg">Resultado do Seu Raio-X Emocional</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-sans bg-black/40 p-5 rounded-2xl border border-amber-500/20">
                      {quizResult}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            renderLockedBonusView(2, 'Raio-X do Gatilho (Diagnosticador Neuro-Comportamental)', 'TOKEN-BONUS2-GATILHO')
          )
        )}

        {/* --- BONUS 3 TOOL WORKSPACE --- */}
        {activeBonusTab === 'b3' && (
          hasB3 ? (
            <div className="bg-[#100e15] border border-amber-500/30 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Bônus 3 • Gerador de Acordo Inquebrável
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Blindagem do Vínculo: Termo de Limites Saudáveis
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Crie um acordo claro e afetuoso para ser compartilhado no WhatsApp ou guardado com o casal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Input Form */}
                <div className="space-y-5 bg-[#16131d] p-6 rounded-2xl border border-white/10">
                  <div>
                    <label className="text-xs font-bold text-gray-200 block mb-2">
                      Nome do Seu Parceiro(a):
                    </label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Ex: Rodrigo / Lucas / Marcelo"
                      className="w-full px-4 py-3 bg-[#0a080f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer p-3 rounded-xl bg-[#0c0a10] border border-white/5 hover:border-amber-500/30">
                      <input
                        type="checkbox"
                        checked={rulePausa}
                        onChange={(e) => setRulePausa(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Incluir Regra dos 20 Minutos de Pausa Sagrada</span>
                    </label>

                    <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer p-3 rounded-xl bg-[#0c0a10] border border-white/5 hover:border-amber-500/30">
                      <input
                        type="checkbox"
                        checked={ruleSemGritos}
                        onChange={(e) => setRuleSemGritos(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>Proibir Ameaças de Término no Calor do Momento</span>
                    </label>
                  </div>
                </div>

                {/* Document Preview */}
                <div className="bg-[#0b0910] p-6 rounded-2xl border-2 border-amber-500/40 space-y-4 font-mono text-xs text-amber-200/90 relative shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pré-visualização Oficial</span>
                      <button
                        onClick={handleCopyAgreement}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-[10px] hover:bg-amber-300 transition-all shadow-md flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedAgreement ? 'Copiado!' : 'Copiar Texto'}</span>
                      </button>
                    </div>

                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-amber-100/90">
                      {generatedAgreementText}
                    </pre>
                  </div>

                  <div className="pt-4 border-t border-amber-500/20 text-[10px] text-gray-400 text-center italic">
                    Copie e envie no WhatsApp para firmar o acordo.
                  </div>
                </div>

              </div>
            </div>
          ) : (
            renderLockedBonusView(3, 'Blindagem do Vínculo (Gerador de Acordo Inquebrável)', 'TOKEN-BONUS3-VINCULO')
          )
        )}

      </div>

    </div>
  );
};
