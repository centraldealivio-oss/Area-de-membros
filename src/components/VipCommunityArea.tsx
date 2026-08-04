import React, { useState, useEffect } from 'react';
import { UserSession, CommunityPost, CommunityComment, UnlockedPermissions } from '../types';
import {
  MessageSquare,
  Users,
  Sparkles,
  Lock,
  ThumbsUp,
  MessageCircle,
  Plus,
  Send,
  Pin,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  EyeOff,
  UserCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { validateTokenOnlineOrLocal, saveSession, computePermissions } from '../lib/tokenAuth';

interface VipCommunityAreaProps {
  session: UserSession;
  onUpgradeSuccess: (updatedSession: UserSession) => void;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'pinned-1',
    authorName: 'Isabella Xavier (Autora & Mentora)',
    isAnonymous: false,
    category: 'geral',
    isPinned: true,
    title: '💬 Boas-vindas à Comunidade Exclusiva de Membros VIP Black!',
    content: 'Queridos alunos do Módulo VIP! Este é o nosso espaço seguro e acolhedor para compartilhar percepções, tirar dúvidas sobre o audiobook e trocar experiências reais sobre o processo de desaceleração de conflitos no relacionamento. Sintam-se à vontade para publicar como anônimo se preferirem total privacidade.',
    createdAt: 'Fixado pela Equipe',
    likesCount: 58,
    comments: [
      {
        id: 'c-1',
        authorName: 'Mariana R.',
        content: 'Excelente iniciativa! Estava precisando exatamente desse apoio com pessoas que entendem o método.',
        createdAt: 'há 2 horas',
        likesCount: 12
      },
      {
        id: 'c-2',
        authorName: 'Carlos Eduardo',
        content: 'Obrigado Isabella! Os bônus do Módulo VIP mudaram completamente minhas atitudes.',
        createdAt: 'há 1 hora',
        likesCount: 8
      }
    ]
  },
  {
    id: 'post-1',
    authorName: 'Carolina M.',
    isAnonymous: false,
    category: 'bpm100',
    title: 'A técnica da pausa dos 20 minutos realmente evitou a explosão ontem!',
    content: 'Ontem à noite estávamos prestes a começar aquela discussão de sempre sobre tarefas da casa. Senti meu coração acelerar (com certeza passou de 100 BPM). Lembrei da dica do Módulo 2 e pedi a pausa de 20 minutos com a frase exata do livro: "Preciso de 20 min pra me acalmar para que possamos resolver isso juntos". Voltamos depois e conversamos sem gritos!',
    createdAt: 'há 35 minutos',
    likesCount: 34,
    comments: [
      {
        id: 'c-3',
        authorName: 'Renata B.',
        content: 'Incrível Carolina! No começo seu parceiro achou estranho você pedir a pausa?',
        createdAt: 'há 20 minutos',
        likesCount: 5
      },
      {
        id: 'c-4',
        authorName: 'Carolina M.',
        content: '@Renata B. No primeiro dia sim, mas depois que expliquei que não era para fugir da conversa e sim para falar sem raiva, ele aceitou numa boa!',
        createdAt: 'há 10 minutos',
        likesCount: 9
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Membro VIP Anônimo',
    isAnonymous: true,
    category: 'neurociencia',
    title: 'Entender o papel da Amígdala me tirou a culpa que eu sentia',
    content: 'Eu me culpava muito por "perder a cabeça" em discussões bobas. Quando ouvi o capítulo sobre como a amígdala sequestra o córtex pré-frontal e desliga a lógica, entendi que é um mecanismo biológico de defesa. Agora consigo focar em prevenir o gatilho em vez de me punir.',
    createdAt: 'há 2 horas',
    likesCount: 42,
    comments: [
      {
        id: 'c-5',
        authorName: 'Lucas F.',
        content: 'Também passei por isso! A neurociência tira aquele peso do "eu sou uma pessoa ruim" e transforma em "meu cérebro entrou em modo de sobressalto".',
        createdAt: 'há 1 hora',
        likesCount: 14
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Juliana & Paulo',
    isAnonymous: false,
    category: 'scripts',
    title: 'Script de desescalada que funcionou no WhatsApp',
    content: 'Testamos a frase do Bônus de Scripts de Desarme: "Eu não estou lutando contra você, estou lutando contra o problema com você." O clima mudou instantaneamente de acusação para parceria.',
    createdAt: 'há 4 horas',
    likesCount: 29,
    comments: []
  }
];

export const VipCommunityArea: React.FC<VipCommunityAreaProps> = ({
  session,
  onUpgradeSuccess
}) => {
  const perms = session.permissions || computePermissions(session.token, session.tier);
  const isVip = session.tier === 'vip_upsell' || session.tier === 'supremo' || Boolean(perms.vipCommunity);

  // Upgrade token input for non-VIP
  const [tokenInput, setTokenInput] = useState('');
  const [upgradeError, setUpgradeError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Community posts state
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const local = localStorage.getItem('ade_vip_community_posts');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return INITIAL_POSTS;
      }
    }
    return INITIAL_POSTS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // New post form fields
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('geral');
  const [isAnonymousPost, setIsAnonymousPost] = useState(false);

  // Active reply form tracking
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Save to local storage whenever posts change
  useEffect(() => {
    localStorage.setItem('ade_vip_community_posts', JSON.stringify(posts));
  }, [posts]);

  // Handle VIP token activation for standard users
  const handleActivateVip = async (e?: React.FormEvent, customToken?: string) => {
    if (e) e.preventDefault();
    const cleanToken = (customToken || tokenInput).trim().toUpperCase();
    if (!cleanToken) {
      setUpgradeError('Digite um token de acesso válido.');
      return;
    }

    setIsVerifying(true);
    setUpgradeError('');

    try {
      const result = await validateTokenOnlineOrLocal(cleanToken);
      if (result) {
        const currentPerms = session.permissions || computePermissions(session.token, session.tier);
        const newPerms = result.permissions || computePermissions(result.token, result.tier);

        const mergedPerms: UnlockedPermissions = {
          mainBook: true,
          bonus1: currentPerms.bonus1 || newPerms.bonus1,
          bonus2: currentPerms.bonus2 || newPerms.bonus2,
          bonus3: currentPerms.bonus3 || newPerms.bonus3,
          vipCommunity: currentPerms.vipCommunity || newPerms.vipCommunity,
          isSupremo: currentPerms.isSupremo || newPerms.isSupremo
        };

        const updatedSession: UserSession = {
          ...session,
          token: result.token || cleanToken,
          tier: (mergedPerms.bonus1 && mergedPerms.bonus2 && mergedPerms.bonus3) ? 'vip_upsell' : (result.tier !== 'standard' ? result.tier : session.tier),
          permissions: mergedPerms
        };

        saveSession(updatedSession);
        onUpgradeSuccess(updatedSession);
      } else {
        setUpgradeError('Token inválido. Verifique o código e tente novamente.');
      }
    } catch {
      setUpgradeError('Ocorreu um erro ao validar o token.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle New Post Submit
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const author = isAnonymousPost
      ? 'Membro VIP Anônimo'
      : (session.customerName || 'Membro VIP');

    const newPostObj: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: author,
      isAnonymous: isAnonymousPost,
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 1,
      comments: []
    };

    setPosts([newPostObj, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostForm(false);
  };

  // Handle Like Post
  const handleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, likesCount: p.likesCount + 1 };
        }
        return p;
      })
    );
  };

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    if (!replyContent.trim()) return;

    const newComment: CommunityComment = {
      id: `comment-${Date.now()}`,
      authorName: session.customerName || 'Membro VIP',
      content: replyContent.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 0
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    setReplyContent('');
    setActiveReplyPostId(null);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'todos' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render NON-VIP Locked Gate
  if (!isVip) {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Banner Gate Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1a1310] via-[#121214] to-[#0a0a0b] border border-amber-500/20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Área Exclusiva de Membros VIP Black</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Comunidade VIP de <span className="text-amber-400">Troca & Apoio Mútuo</span>
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed">
              A Comunidade VIP é um ambiente seguro e restrito para alunos que adquiriram a edição VIP Black do audiobook. Aqui compartilhamos vivências reais, relatos de desescalada de conflitos, tiramos dúvidas sobre neurociência e praticamos os scripts de desarmamento em conjunto.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Comunidade Ativa</h4>
                  <p className="text-[11px] text-gray-400">+140 alunos conectados</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <EyeOff className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Opção Anônima</h4>
                  <p className="text-[11px] text-gray-400">Total privacidade de relato</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-3">
                <Shield className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Ambiente Seguro</h4>
                  <p className="text-[11px] text-gray-400">Focado em evolução sem julgamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Token Activation Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121214] border border-white/10 max-w-xl mx-auto shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Já adquiriu sua oferta especial do Módulo Black?</h3>
              <p className="text-xs text-gray-400">Insira seu token de acesso abaixo para liberar a Comunidade VIP:</p>
            </div>
          </div>

          <form onSubmit={handleActivateVip} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Cole seu Token VIP ativado"
                className="w-full px-4 py-3.5 bg-[#0d0d0f] border border-white/10 rounded-2xl text-white placeholder-gray-600 font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {upgradeError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{upgradeError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <span>Validando Token...</span>
              ) : (
                <>
                  <span>Liberar Área VIP Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>



          <p className="text-[11px] text-gray-500 text-center font-mono pt-2">
            Ainda não possui a versão VIP Black? Adquira a liberação em <a href="https://mente.centraldealivio.com.br" target="_blank" rel="noreferrer" className="text-amber-400 underline">mente.centraldealivio.com.br</a>
          </p>
        </div>

        {/* Blurred Preview Grid */}
        <div className="relative rounded-3xl overflow-hidden opacity-40 blur-[2px] pointer-events-none space-y-4">
          <div className="p-6 rounded-2xl bg-[#121214] border border-white/10">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-xs text-amber-400">
                VIP
              </div>
              <div>
                <span className="text-xs font-bold text-white">Membro VIP</span>
                <span className="text-[10px] text-gray-500 ml-2">há 10 minutos</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-gray-200">Exemplo de discussão sobre os módulos...</h4>
            <p className="text-xs text-gray-400 mt-1">
              "Conteúdo exclusivo restrito para visualização apenas de membros autênticos da área de membros."
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render VIP Community Main View
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#17171a] via-[#121214] to-[#1a120c] border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Membro VIP Black Conectado • {session.customerName}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Comunidade VIP de</span>
            <span className="text-amber-400">Troca & Apoio</span>
          </h2>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Compartilhe vitórias diárias, tire dúvidas sobre neurociência e aprenda com a experiência de outros casais que estão aplicando o método Antes da Explosão.
          </p>
        </div>

        {/* Action Button: Create Post */}
        <div className="shrink-0">
          <button
            onClick={() => setShowNewPostForm(!showNewPostForm)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Publicação</span>
          </button>
        </div>
      </div>

      {/* NEW POST MODAL / COMPOSER FORM */}
      {showNewPostForm && (
        <div className="p-6 rounded-3xl bg-[#121214] border border-amber-500/30 shadow-2xl space-y-4 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Criar Nova Publicação no Fórum VIP</span>
            </h3>
            <button
              onClick={() => setShowNewPostForm(false)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg bg-white/5"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Categoria do Tópico
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CommunityPost['category'])}
                  className="w-full px-3 py-2.5 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="geral">Geral / Dúvida do Audiobook</option>
                  <option value="bpm100">Técnica dos 100 BPM & Controle</option>
                  <option value="neurociencia">Neurociência dos Conflitos</option>
                  <option value="relatos">Relato de Transformação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Modo de Autoria
                </label>
                <button
                  type="button"
                  onClick={() => setIsAnonymousPost(!isAnonymousPost)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    isAnonymousPost
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-300'
                  }`}
                >
                  <span>{isAnonymousPost ? 'Anônimo (Preservar Privacidade)' : `Postar como ${session.customerName}`}</span>
                  <EyeOff className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Título da Publicação
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Como apliquei o script no meio de uma discussão agitada"
                className="w-full px-4 py-3 bg-[#0d0d0f] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Conteúdo / Seu Relato ou Pergunta
              </label>
              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Escreva detalhes da sua experiência ou dúvida para que outros membros consigam interagir..."
                className="w-full px-4 py-3 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg transition-all flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar na Comunidade</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category filter pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos os Tópicos' },
            { id: 'bpm100', label: 'Técnica 100 BPM' },
            { id: 'neurociencia', label: 'Neurociência' },
            { id: 'relatos', label: 'Relatos de Sucesso' },
            { id: 'geral', label: 'Geral' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar discussões..."
            className="w-full pl-9 pr-4 py-2 bg-[#121214] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#121214] border border-white/5 text-gray-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-sm font-medium">Nenhuma publicação encontrada para os filtros selecionados.</p>
            <p className="text-xs text-gray-500">Seja o primeiro a iniciar uma conversa!</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className={`p-6 rounded-3xl bg-[#121214] border transition-all ${
                post.isPinned
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-[#121214]'
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs ${
                    post.isPinned
                      ? 'bg-amber-500 text-black'
                      : post.isAnonymous
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {post.isAnonymous ? 'AN' : post.authorName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{post.authorName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                        VIP Black
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500">{post.createdAt}</span>
                  </div>
                </div>

                {post.isPinned && (
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    <Pin className="w-3 h-3" />
                    <span>Destaque</span>
                  </div>
                )}
              </div>

              {/* Post Title & Content */}
              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line mb-4">
                {post.content}
              </p>

              {/* Post Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-amber-500/80" />
                    <span>{post.likesCount} Apoios</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)
                    }
                    className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-orange-400" />
                    <span>{post.comments.length} Respostas</span>
                  </button>
                </div>
              </div>

              {/* Comments / Replies Section */}
              {post.comments.length > 0 && (
                <div className="mt-4 pt-3 space-y-2 border-t border-white/5 bg-[#0d0d0f]/60 p-4 rounded-2xl">
                  {post.comments.map(c => (
                    <div key={c.id} className="text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300/90">{c.authorName}</span>
                        <span className="text-[10px] text-gray-500">{c.createdAt}</span>
                      </div>
                      <p className="text-gray-300 leading-normal">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input Form */}
              {activeReplyPostId === post.id && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva sua resposta de apoio..."
                    className="flex-1 px-3 py-2 bg-[#0d0d0f] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(post.id);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition-all"
                  >
                    Responder
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
