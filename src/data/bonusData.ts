/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bonus } from '../types';
import coverAntesDaExplosao from '../assets/images/cover_antes_da_explosao_1785165598731.jpg';
import coverProtocolo100Bpm from '../assets/images/cover_protocolo_100_bpm_1785165612859.jpg';
import coverRaioXGatilho from '../assets/images/cover_raio_x_gatilho_1785165634602.jpg';
import coverBlindagemVinculo from '../assets/images/cover_blindagem_vinculo_1785165652252.jpg';

export const MAIN_COVER_IMAGE = coverAntesDaExplosao;

export const UPSELL_BONUSES: Bonus[] = [
  {
    id: 'bonus-1',
    number: 1,
    title: 'Protocolo 100 BPM',
    badge: 'BÔNUS EXCLUSIVO 1',
    subtitle: 'Para Acalmar o Coração e Recuperar o Controle',
    tagline: 'Quando a briga esquenta e o corpo entra em alarme',
    coverImage: '/images/cover_protocolo_100_bpm.jpg' || coverProtocolo100Bpm,
    description: 'Guia prático e bio-feedback visual interativo para reduzir a frequência cardíaca para menos de 100 BPM durante crises agudas de discussão, ativando o Nervo Vago e devolvendo o controle pré-frontal.',
    highlights: [
      'Visualizador de Respiração Bio-Feedback (Ritmo 4-7-8 & Box Breathing)',
      'Áudio SOS Emergencial de 3 Minutos para Escutar com Fones no Meio do Conflito',
      'Checklist Fisiológico: Como identificar se seu corpo passou dos 100 BPM'
    ]
  },
  {
    id: 'bonus-2',
    number: 2,
    title: 'Raio-X do Gatilho',
    badge: 'BÔNUS EXCLUSIVO 2',
    subtitle: 'Identifique o que Dispara. Transforme o que te Trava.',
    tagline: 'O Mapeador Neuro-Comportamental de Ciúmes e Inseguranças',
    coverImage: '/images/cover_raio_x_gatilho.jpg' || coverRaioXGatilho,
    description: 'Ferramenta interativa de diagnóstico de perfil de apego e teste de gatilhos inconscientes. Saiba exatamente o que ativa seu estado de alerta antes que vire ciúme destrutivo.',
    highlights: [
      'Teste Interativo de Mapeamento de Apego (6 Pergunta Diagnósticas)',
      'Gerador de Script Desativador de Falsos Alertas da Amígdala',
      'Diário do Raio-X: Registre o histórico e desmantele padrões recorrentes'
    ]
  },
  {
    id: 'bonus-3',
    number: 3,
    title: 'Blindagem do Vínculo',
    badge: 'BÔNUS EXCLUSIVO 3',
    subtitle: 'Fortaleça o que te Sustenta. Blinde o que te Transforma.',
    tagline: 'Proteja o que Já Funciona e Crie Acordos Inquebráveis',
    coverImage: '/images/cover_blindagem_vinculo.jpg' || coverBlindagemVinculo,
    description: 'Manual de frases prontas para desescalar brigas, reparar a confiança abalada e construir um Contrato de Limites Saudáveis para o casal.',
    highlights: [
      'Biblioteca de Scripts de Desarme: "Como voltar atrás sem parecer fraco"',
      'Construtor de Acordos de Casal (Gera PDF/Texto de limites compartilhados)',
      'Técnica do Escudo Emocional para não absorver a raiva do parceiro'
    ]
  }
];
