/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSession, CourseModule, Topic } from './types';
import { COURSE_MODULES } from './data/courseData';
import {
  getStoredSession,
  saveSession,
  clearSession,
  getTokenFromURL,
  validateTokenOnlineOrLocal,
  getCompletedTopics,
  toggleTopicCompleted
} from './lib/tokenAuth';

import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { WelcomeModal } from './components/WelcomeModal';
import { ModuleAccordion } from './components/ModuleAccordion';
import { TopicView } from './components/TopicView';
import { GhostAreaUpsell } from './components/GhostAreaUpsell';
import { BonusArea } from './components/BonusArea';
import { VipCommunityArea } from './components/VipCommunityArea';
import { ParadiseSimulatorModal } from './components/ParadiseSimulatorModal';
import { VercelDeploymentGuideModal } from './components/VercelDeploymentGuideModal';
import { MAIN_COVER_IMAGE, FALLBACK_COVER_IMAGE } from './data/bonusData';
import { Sparkles, BookOpen, Flame, Lock, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'curso' | 'bonuses' | 'community'>('curso');

  // Selected Module & Topic
  const [selectedModule, setSelectedModule] = useState<CourseModule>(COURSE_MODULES[0]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(COURSE_MODULES[0].topics[0]);

  // Completed topics
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // Modals
  const [showSimulator, setShowSimulator] = useState(false);
  const [showVercelGuide, setShowVercelGuide] = useState(false);

  // Initial Auto-Login check (via URL token parameter or stored session)
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check URL token parameter e.g. ?token=PARADISE-VIP-8888
      const urlToken = getTokenFromURL();
      if (urlToken) {
        const validated = await validateTokenOnlineOrLocal(urlToken);
        if (validated) {
          saveSession(validated);
          setSession(validated);
          setShowWelcomeModal(true); // Trigger the requested welcome popup!
          return;
        }
      }

      // 2. Check stored session
      const stored = getStoredSession();
      if (stored) {
        setSession(stored);
      }
    };

    initAuth();
    setCompletedTopics(getCompletedTopics());
  }, []);

  const handleLoginSuccess = (newSession: UserSession, isFirstTime: boolean) => {
    saveSession(newSession);
    setSession(newSession);
    if (isFirstTime) {
      setShowWelcomeModal(true);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  const handleToggleTopicComplete = (topicId: string) => {
    const updated = toggleTopicCompleted(topicId);
    setCompletedTopics(updated);
  };

  const handleSelectTopic = (module: CourseModule, topic: Topic) => {
    setSelectedModule(module);
    setSelectedTopic(topic);

    // Smooth scroll to lesson topic view on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const element = document.getElementById('lesson-topic-view');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleNextTopic = () => {
    // Find next topic in sequence
    let currentFound = false;
    for (const m of COURSE_MODULES) {
      for (const t of m.topics) {
        if (currentFound) {
          setSelectedModule(m);
          setSelectedTopic(t);
          return;
        }
        if (t.id === selectedTopic.id) {
          currentFound = true;
        }
      }
    }
  };

  const totalTopicsCount = COURSE_MODULES.reduce((acc, m) => acc + m.topics.length, 0);

  // If no active authenticated session, show Login Token screen
  if (!session) {
    return (
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
    );
  }

  const isVipUser = session.tier === 'vip_upsell';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex flex-col font-sans selection:bg-orange-600/30 selection:text-orange-300">
      
      {/* Top Navbar */}
      <Navbar
        session={session}
        completedCount={completedTopics.length}
        totalTopics={totalTopicsCount}
        onOpenSimulator={() => setShowSimulator(true)}
        onOpenVercelGuide={() => setShowVercelGuide(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* WELCOME POPUP MODAL (After Paradise Redirect) */}
        {showWelcomeModal && (
          <WelcomeModal
            session={session}
            onClose={() => setShowWelcomeModal(false)}
          />
        )}

        {/* TAB 1: CURSO COMPLETO & AUDIOBOOK */}
        {activeTab === 'curso' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Module Navigation Directory */}
            <div id="modules-directory-list" className="md:col-span-4 lg:col-span-4 space-y-6 scroll-mt-24">
              
              {/* Course Overview Card */}
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 relative overflow-hidden shadow-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative group w-20 sm:w-24 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-white/10 transition-transform duration-300 hover:scale-105 bg-gray-900">
                    <img
                      src={MAIN_COVER_IMAGE}
                      alt="Capa do Livro Antes da Explosão"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER_IMAGE;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold mb-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span>Audiobook & Ebook</span>
                    </div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      Antes da <span className="text-orange-500">Explosão</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Isabella Xavier
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      5 Módulos • 10 Tópicos
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-300 space-y-2 pt-3 border-t border-white/5">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-gray-400">Seu Progresso:</span>
                    <span className="text-orange-500 font-bold">
                      {completedTopics.length} de {totalTopicsCount} concluídos
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${(completedTopics.length / totalTopicsCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Modules Accordion */}
              <ModuleAccordion
                modules={COURSE_MODULES}
                selectedTopicId={selectedTopic.id}
                completedTopics={completedTopics}
                onSelectTopic={handleSelectTopic}
              />

              {/* VIP Upsell Teaser Banner in Sidebar */}
              {!isVipUser && (
                <div className="bg-gradient-to-br from-amber-500/10 via-[#121214] to-[#0a0a0b] border border-amber-500/20 p-5 rounded-3xl space-y-3 shadow-lg shadow-amber-500/5">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs uppercase tracking-wider">Área Black Edition VIP</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Você possui o plano Padrão. Quer acessar o Protocolo 100 BPM, Raio-X do Gatilho e Blindagem do Vínculo?
                  </p>
                  <button
                    onClick={() => setActiveTab('bonuses')}
                    className="w-full py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all flex items-center justify-center space-x-1"
                  >
                    <span>Ver Área Black Edition</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Selected Topic Main View */}
            <div id="lesson-topic-view" className="md:col-span-8 lg:col-span-8 scroll-mt-24">
              <TopicView
                module={selectedModule}
                topic={selectedTopic}
                isCompleted={completedTopics.includes(selectedTopic.id)}
                onToggleComplete={handleToggleTopicComplete}
                onSelectNextTopic={handleNextTopic}
                onBackToModules={() => {
                  const element = document.getElementById('modules-directory-list');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            </div>

          </div>
        )}

        {/* TAB 2: ÁREA FANTASMA & BÔNUS VIP */}
        {activeTab === 'bonuses' && (
          <div>
            {isVipUser ? (
              <BonusArea />
            ) : (
              <GhostAreaUpsell
                onUpgradeSuccess={(newVIPToken) => {
                  const updatedSession: UserSession = {
                    ...session,
                    token: newVIPToken,
                    tier: 'vip_upsell'
                  };
                  saveSession(updatedSession);
                  setSession(updatedSession);
                }}
              />
            )}
          </div>
        )}

        {/* TAB 3: COMUNIDADE EXCLUSIVA VIP */}
        {activeTab === 'community' && (
          <VipCommunityArea
            session={session}
            onUpgradeSuccess={(updatedSession) => {
              saveSession(updatedSession);
              setSession(updatedSession);
            }}
          />
        )}

      </main>

      {/* MODALS */}
      {showSimulator && (
        <ParadiseSimulatorModal
          onClose={() => setShowSimulator(false)}
          onSimulateRedirect={async (generatedToken) => {
            const validated = await validateTokenOnlineOrLocal(generatedToken);
            if (validated) {
              saveSession(validated);
              setSession(validated);
              setShowWelcomeModal(true);
            }
          }}
        />
      )}

      {showVercelGuide && (
        <VercelDeploymentGuideModal
          onClose={() => setShowVercelGuide(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0d0d0f] py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span>
            © {new Date().getFullYear()} Antes da Explosão • Isabella Xavier
          </span>
        </div>
      </footer>

    </div>
  );
}
