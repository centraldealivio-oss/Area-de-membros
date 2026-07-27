/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CourseModule } from '../types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'modulo-1',
    number: 1,
    title: 'Módulo 1: O Cérebro em Alerta & A Origem dos Padrões',
    subtitle: 'Teoria do Apego e o Reator Biológico dos Relacionamentos',
    description: 'Compreenda por que trocamos de parceiro mas repetimos a mesma briga, e aprenda a mapear seu sistema de apego infantil.',
    topics: [
      {
        id: 'topico-1',
        number: 1,
        title: 'Tópico 1: A Teoria do Apego e o Padrão Infantil',
        shortSummary: 'Descubra como quem cuidou de você na infância moldou o manual de amor que seu cérebro usa até hoje.',
        durationMinutes: 12,
        transcript: `Você já percebeu que troca de parceiro, mas o tipo de briga continua exatamente o mesmo? Isso vem de muito antes — de como quem cuidou de você responda às suas emoções quando você era criança. É a teoria do apego, de John Bowlby: um manual de amor que você aprendeu cedo demais pra escolher, e carrega até hoje sem perceber. Não é defeito de personalidade. É padrão aprendido — e o que se aprende, se reaprende.`,
        neuroscienceBreakdown: {
          brainRegion: 'Sistema Límbico & Hipocampo (Memória Implícita)',
          chemicalProcess: 'Condicionamento Neural Precoce e Sensibilidade à Ocitocina/Cortisol',
          explanation: 'As primeiras interações afetivas moldam as vias neurais da amígdala. Quando criança, estratégias de busca de atenção ativavam o circuito de recompensa ou de sobrevivência, gravando uma ponte direta entre apego e ameaça no cérebro adulto.'
        },
        practicalAction: {
          action: 'Mapeamento da Resposta Infantil de Sobrevivência Emocional',
          howToApply: 'Escreva, uma vez, a resposta pra essa pergunta: "quando eu era criança, o que eu fazia quando precisava de atenção — e funcionava?". A resposta costuma revelar seu padrão adulto.',
          avoidThis: 'Evite julgar a resposta como certa ou errada — é só informação, não culpa.'
        },
        reflectionPrompt: 'Ao olhar para a sua infância, qual era a sua estratégia primária para ser ouvido ou protegido? Como essa mesma estratégia reaparece hoje nos seus momentos de estresse no relacionamento?'
      },
      {
        id: 'topico-2',
        number: 2,
        title: 'Tópico 2: Os 4 Padrões de Reação no Calor da Discussão',
        shortSummary: 'Ansioso, Evitativo, Desorganizado ou Trava por Análise: identifique seu perfil instintivo de defesa.',
        durationMinutes: 15,
        transcript: `Existem 4 jeitos comuns desse padrão aparecer — e você provavelmente já reconheceu o seu antes de eu terminar de explicar. Ansioso, que cobra e insiste pelo medo de perder. Evitativo, que recua quando a intimidade fica intensa demais. Desorganizado, que quer se aproximar mas sabota bem na hora em que dá certo. E Trava por análise, que pensa tanto que nunca se entrega de verdade. Nenhum é sentença — são respostas aprendidas.`,
        neuroscienceBreakdown: {
          brainRegion: 'Eixo HPA (Hipotálamo-Pituitária-Adrenal)',
          chemicalProcess: 'Picos de Cortisol e Noradrenalina (Modo Luta, Fuga ou Paralisia)',
          explanation: 'Diante da percepção de desconexão, o Eixo HPA dispara instantaneamente uma resposta somática. O tipo Ansioso ativa o modo Luta; o Evitativo ativa o modo Fuga; o Desorganizado oscillating entra em colapso Luta/Fuga; o Trava por Análise congela a ação motora (Freezing).'
        },
        practicalAction: {
          action: 'Identificação Honest do Padrão Sob Pressão',
          howToApply: 'Releia os 4 padrões e marque não o que você gostaria de ser, mas o que você realmente faz no calor de uma discussão.',
          avoidThis: 'Evite escolher o padrão mais "bonito" — a honestidade aqui é o que faz o resto do método funcionar.'
        },
        reflectionPrompt: 'Qual dos 4 padrões é o seu porto seguro defensivo durante uma discussão acalorada? Você consegue se lembrar do exato momento em que ele assumiu o controle na sua última briga?'
      }
    ]
  },
  {
    id: 'modulo-2',
    number: 2,
    title: 'Módulo 2: O Mecanismo Secreto dos Gatilhos',
    subtitle: 'Amígdala Cerebral, Ciúme e Autossabotagem Antecipatória',
    description: 'Aprenda a desarmar os alarmes falsos do cérebro e entenda por que sabotamos momentos felizes por medo de perder.',
    topics: [
      {
        id: 'topico-3',
        number: 3,
        title: 'Tópico 3: Raio-X do Ciúme e a Amígdala Cerebral',
        shortSummary: 'Desvende por que a amígdala interpreta a desconfiança sem prova como um perigo vital iminente.',
        durationMinutes: 14,
        transcript: `Esse ciúme que não descansa, que revira mensagem, que desconfia sem motivo concreto — não vem do tamanho do seu amor. Vem de um medo de abandono bem mais antigo, que ativa a amígdala — a parte do cérebro que detecta ameaça, mesmo sem perigo real na frente. Cuidado não consome por dentro. Gatilho antigo, sim.`,
        neuroscienceBreakdown: {
          brainRegion: 'Amígdala Basolateral & Ínsula Anterior',
          chemicalProcess: 'Hiperativação do Circuito do Medo e Queda na Serotonina',
          explanation: 'A amígdala basolateral não diferencia uma ameaça física (um predador) de uma ameaça simbólica (um atraso ou um olhar neutro). Ela sequestra o julgamento lógico antes do Córtex Pré-Frontal processar a realidade.'
        },
        practicalAction: {
          action: 'Interrogação Direta da Evidência vs Sensation',
          howToApply: 'Da próxima vez que o ciúme aparecer, antes de checar celular ou cobrar satisfação, pergunte-se: "o que exatamente eu vi ou ouvi agora que ativou isso?". Se a resposta for vaga ("não sei, só senti"), é sinal de gatilho antigo, não de fato novo.',
          avoidThis: 'Evite tratar a suspeita como prova só porque a sensação é forte.'
        },
        reflectionPrompt: 'Quando o ciúme dispara no seu corpo, qual é o sintoma físico imediato? O que acontece na sua mente nos primeiros 5 segundos?'
      },
      {
        id: 'topico-4',
        number: 4,
        title: 'Tópico 4: Autossabotagem Antecipatória e o Medo do Sucesso',
        shortSummary: 'Entenda os achados de Berglas & Jones: por que criamos conflitos do nada quando tudo vai bem.',
        durationMinutes: 16,
        transcript: `Tudo vai bem no relacionamento... e do nada você arruma motivo pra brigar? Berglas e Jones chamam isso de autossabotagem antecipatória: você cria o problema antes, pra culpa ser dele — não do fato de, lá no fundo, você achar que não merece ser amado. Existe até o medo do sucesso: quando dar certo entra em conflito com a crença de que você não merece.`,
        neuroscienceBreakdown: {
          brainRegion: 'Estriado Ventral & Córtex Cingulado Anterior',
          chemicalProcess: 'Dissonância Cognitiva e Queda Abrupta de Dopamina',
          explanation: 'Quando a realidade do relacionamento é tranquila, mas a crença interna é de rejeição inevitável, o cérebro gera uma tensão desconfortável. Criar uma briga restaura a "previsibilidade" que o cérebro antigo reconhece como familiar.'
        },
        practicalAction: {
          action: 'Pausa Estratégica Anti-Sabotagem de 10 Segundos',
          howToApply: 'Quando perceber vontade de criar um problema do nada num momento bom, pare 10 segundos antes de agir e pergunte: "isso que vou fazer resolve algo, ou só me afasta de algo que estava bom?".',
          avoidThis: 'Evite testar o parceiro pra "ver se ele aguenta" — isso raramente prova o que você quer provar.'
        },
        reflectionPrompt: 'Você se lembra de algum momento em que o relacionamento estava calmo e amoroso, e de repente você puxou um assunto difícil ou fez uma crítica ácida? O que você estava tentando antecipar?'
      }
    ]
  },
  {
    id: 'modulo-3',
    number: 3,
    title: 'Módulo 3: A Biologia do Conflito & O Efeito Gottman',
    subtitle: 'Ciclo Perseguidor-Distanciador e o Flooding Acima de 100 BPM',
    description: 'Entenda a dinâmica que destrói a comunicação e por que discussões são biologicamente inúteis com o coração acelerado.',
    topics: [
      {
        id: 'topico-5',
        number: 5,
        title: 'Tópico 5: O Ciclo Perseguidor-Distanciador',
        shortSummary: 'Como o desespero por conexão de um lado dispara o recuo protetor do outro em uma espiral destrutiva.',
        durationMinutes: 18,
        transcript: `Suas brigas parecem sempre a mesma — só muda o assunto? É o ciclo perseguidor-distanciador: um lado cobra proximidade, o outro se afasta pra se proteger — o que confirma exatamente o medo de quem cobrou, e faz a cobrança aumentar ainda mais. É a raiz da maioria dos conflitos que se repetem.`,
        neuroscienceBreakdown: {
          brainRegion: 'Córtex Pré-Frontal Ventromedial & Sistema Nervoso Autônomo',
          chemicalProcess: 'Feedback Negativo de Alarme Mútuo',
          explanation: 'A cobrança é lida como ataque pelo cérebro do distanciador, provocando fuga. O recuo é lido como rejeição total pelo cérebro do perseguidor, hiperativando o pânico de abandono. É uma dança neurobiológica de desregulação mútua.'
        },
        practicalAction: {
          action: 'Reconfiguração do Sinal de Comunicação',
          howToApply: 'Se você é do tipo que cobra, tente trocar a cobrança por um pedido direto ("eu preciso de mais atenção agora") em vez de crítica indireta. Se você é do tipo que se afasta, avise antes de sumir: "preciso de um tempo, mas não estou te abandonando".',
          avoidThis: 'Evite o silêncio sem aviso — é o que mais alimenta o ciclo.'
        },
        reflectionPrompt: 'Em uma briga típica, você se pega perseguindo (exigindo respostas agora) ou se distanciando (fechando a cara, saindo da sala)? O que seu parceiro costuma fazer em reação a isso?'
      },
      {
        id: 'topico-6',
        number: 6,
        title: 'Tópico 6: O Fenômeno Gottman e Flooding (>100 BPM)',
        shortSummary: 'A ciência de Gottman: quando o coração passa de 100 BPM, a empatia desliga e o raciocínio entra em curto.',
        durationMinutes: 15,
        transcript: `Uma discussão sobre louça vira guerra sobre tudo em 20 minutos? John Gottman mediu isso em 40 anos de pesquisa: quando o coração passa de 100 batimentos por minuto numa briga, o cérebro entra em flooding — a parte que ouve, tem empatia e resolve problema simplesmente desliga. Não é escolha. É biologia. Com esse dado, ele prevê com 90% de acerto se um casal vai durar.`,
        neuroscienceBreakdown: {
          brainRegion: 'Sistema Nervoso Simpático & Desativação do Córtex Pré-Frontal Doutrolateral',
          chemicalProcess: 'Inundação de Adrenalina, Vasoconstrição e Visão de Túnel',
          explanation: 'A mais de 100 BPM, a perfusão sanguínea no córtex pré-frontal cai drasticamente. O cérebro primitivo assume o comando total. Nesse estado, capacidades complexas como tomada de perspectiva, humor e escuta ativa são fisiologicamente impossíveis.'
        },
        practicalAction: {
          action: 'Protocolo de Interrupção Biológica de 20 Minutos',
          howToApply: 'Se sentir o coração acelerando numa discussão, diga em voz alta: "preciso de 20 minutos antes de continuar essa conversa". Não é fuga — é o tempo real que o corpo leva pra sair do estado de alerta.',
          avoidThis: 'Evite continuar discutindo "pra resolver logo" — nesse estado, nada que for dito resolve, só piora.'
        },
        reflectionPrompt: 'Você consegue identificar os sinais de que seu corpo está entrando em flooding (mãos frias, mandíbula presa, visão de túnel, pulso acelerado)?'
      }
    ]
  },
  {
    id: 'modulo-4',
    number: 4,
    title: 'Módulo 4: A Chave da Metacognição & Neuroplasticidade',
    subtitle: 'Criando o Espaço Entre Sentir e Agir e Reescrevendo o Cérebro Adulto',
    description: 'Aprenda a ativar a capacidade de observar suas próprias emoções em tempo real e reconfigurar conexões neurais antigas.',
    topics: [
      {
        id: 'topico-7',
        number: 7,
        title: 'Tópico 7: Metacognição na Prática',
        shortSummary: 'Desenvolva o "observador interno" capaz de pausar a reação antes que ela se torne destruição.',
        durationMinutes: 14,
        transcript: `Em tudo que você já viu até aqui, a reação sempre vem antes da percepção. A virada de verdade é inverter essa ordem. A metacognição permite se perguntar, ainda no meio do que você sente: "isso é proporcional à situação, ou é um gatilho antigo se protegendo de novo?". Não é suprimir a emoção. É criar um espaço entre sentir e agir.`,
        neuroscienceBreakdown: {
          brainRegion: 'Córtex Pré-Frontal Rostrolateral & Rede de Modo Padrão (DMN)',
          chemicalProcess: 'Ativação do Monitoramento de Alto Nível e Redução do Disparo Amigdaliano',
          explanation: 'Ao nomear verbalmente ou conceitualmente uma emoção ("rotulagem afetiva"), as vias inibitórias do córtex pré-frontal enviam impulsos de GABA para a amígdala, atenuando a resposta de estresse instantaneamente.'
        },
        practicalAction: {
          action: 'Exercício de Observação Sem Julgamento por 7 Dias',
          howToApply: 'Escolha uma emoção forte que você sente com frequência (ciúme, raiva, medo de abandono) e, pelos próximos 7 dias, toda vez que ela aparecer, só observe e nomeie — sem agir ainda.',
          avoidThis: 'Evite cobrar de si mesmo mudança de comportamento nessa semana — o objetivo agora é só observar, a mudança vem depois.'
        },
        reflectionPrompt: 'Qual é a emoção que mais costuma roubar seu controle sem dar tempo de pensar? O que aconteceria se você apenas a nomeasse em voz alta na próxima vez?'
      },
      {
        id: 'topico-8',
        number: 8,
        title: 'Tópico 8: Neuroplasticidade Adulta e Reconfiguração Neural',
        shortSummary: 'Descubra como o cérebro adulto continua capaz de mudar caminhos sinápticos através da repetição focada.',
        durationMinutes: 16,
        transcript: `Nenhum padrão de apego é sentença. Seu cérebro adulto continua neuroplástico — capaz de mudar, a vida inteira. O que muda um padrão de verdade não é força de vontade isolada num momento de raiva. É repetição consciente: notar o segundo antes da reação, entender o gatilho, escolher diferente — de novo, e de novo. Foi por essa jornada que o Antes da Explosão nasceu.`,
        neuroscienceBreakdown: {
          brainRegion: 'Fator Neurotrófico Derivado do Cérebro (BDNF) & Sinaptogênese',
          chemicalProcess: 'Potenciação de Longo Prazo (LTP) por Repetição Consciente',
          explanation: 'A neuroplasticidade exige foco atencional e repetição. Quando interrompemos um hábito reativo e escolhemos uma nova rota comportamental, enfraquecemos o caminho antigo e fortalecemos os dendritos da nova resposta madura.'
        },
        practicalAction: {
          action: 'Foco Único Micro-Mudança por 14 Dias',
          howToApply: 'Escolha 1 padrão dos 4 (não os 4 de uma vez) e aplique só ele nas próximas 2 semanas.',
          avoidThis: 'Evite tentar mudar tudo ao mesmo tempo — é isso que mais causa desistência precoce nesse tipo de processo.'
        },
        reflectionPrompt: 'Se você pudesse transformar apenas um único micro-comportamento nas suas próximas conversas difíceis, qual seria ele?'
      }
    ]
  },
  {
    id: 'modulo-5',
    number: 5,
    title: 'Módulo 5: Os Micro-Momentos e Desarme Prático',
    subtitle: 'O Segundo Antes da Explosão e a Recuperação Pós-Reação',
    description: 'As duas ferramentas decisivas para interceptar o impulso antes do grito e reconstruir a confiança após um deslize.',
    topics: [
      {
        id: 'topico-9',
        number: 9,
        title: 'Tópico 9: O Segundo Antes da Explosão',
        shortSummary: 'Existe um segundo exato onde a escolha ainda é sua. Aprenda a capturar esse instante crucial.',
        durationMinutes: 13,
        transcript: `Existe um segundo, bem no meio da briga, onde você ainda podia ter escolhido diferente — e quase sempre deixa passar sem perceber. Você grita, fala o que não devia, e depois o silêncio dói mais que a discussão em si. Cientistas da UCL chamam isso de metacognição: a capacidade de perceber o que você sente enquanto sente — antes de agir no automático.`,
        neuroscienceBreakdown: {
          brainRegion: 'Circuito de Inibição de Impulsos (Córtex Orbitofrontal)',
          chemicalProcess: 'Rotulagem Afetiva Express (Affect Labeling)',
          explanation: 'Expressar em palavras o estado interno transfere a atividade elétrica da amígdala para o córtex pré-frontal esquerdo. Esse micro-deslocamento leva menos de 1 segundo e desativa o reflexo automático de ataque.'
        },
        practicalAction: {
          action: 'Ancoragem com Rotulagem em Voz Baixa',
          howToApply: 'Da próxima vez que sentir a raiva subindo, faça uma coisa só — nomeie em voz baixa o que está sentindo. "Isso é raiva." "Isso é medo de ser ignorado." Só isso já ativa a parte do cérebro que observa, em vez da que reage.',
          avoidThis: 'Evite responder no mesmo segundo que sentir o gatilho — esse é o erro mais comum.'
        },
        reflectionPrompt: 'Qual é a sensação somática exata que avisa que você está a 1 segundo de explodir? (ex: calor no peito, aperto na garganta, punhos fechados)'
      },
      {
        id: 'topico-10',
        number: 10,
        title: 'Tópico 10: O Desarme Pós-Reação e Comunicação Consciente',
        shortSummary: 'Como assumir o desvio emocional sem se defender e restaurar a segurança no relacionamento imediatamente.',
        durationMinutes: 15,
        transcript: `Você já ouviu sua própria voz no meio de uma briga e pensou "quem falou isso não fui eu"? O cérebro trata ameaça emocional como perigo de vida — o corpo reage antes da mente ter tempo de pensar. Isso não é fraqueza, nem falta de controle. É um sistema de proteção antigo que confunde discussão com ataque.`,
        neuroscienceBreakdown: {
          brainRegion: 'Neurônios Espelho & Regulação Emocional Interpessoal',
          chemicalProcess: 'Desescalada pela Redução de Defesa Percebida',
          explanation: 'Quando você admite o erro sem justificativas, os neurônios espelho do outro captam a ausência de ameaça. O cérebro do parceiro desativa a postura defensiva e restabelece a ressonância empática.'
        },
        practicalAction: {
          action: 'A Frase Chave de Desarme Imediato',
          howToApply: 'Quando perceber que respondeu de um jeito que nem parecia seu, não tente se justificar na hora. Diga: "eu reagi errado, deixa eu voltar nisso com calma".',
          avoidThis: 'Evite continuar a conversa tentando "ganhar" o momento — o corpo ainda está em alerta, e nada dito agora vai sair como você realmente pensa.'
        },
        reflectionPrompt: 'Quão fácil ou difícil é para você dizer "reagi errado, deixa eu voltar nisso com calma"? O que te impede de usar essa frase no momento exato do conflito?'
      }
    ]
  }
];
