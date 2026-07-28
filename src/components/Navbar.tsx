/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserSession } from '../types';
import { ShieldCheck, Lock, Sparkles, LogOut, Terminal, Server, ExternalLink, Flame, MessageSquare, Users } from 'lucide-react';

interface NavbarProps {
  session: UserSession;
  completedCount: number;
  totalTopics: number;
  onOpenSimulator: () => void;
  onOpenVercelGuide: () => void;
  onLogout: () => void;
  activeTab: 'curso' | 'bonuses' | 'community';
  setActiveTab: (tab: 'curso' | 'bonuses' | 'community') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  completedCount,
  totalTopics,
  onOpenSimulator,
  onOpenVercelGuide,
  onLogout,
  activeTab,
  setActiveTab
}) => {
  const isVip = session.tier === 'vip_upsell';
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-white/5 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-orange-600/20 shrink-0">
                AE
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  <span>Antes da</span>
                  <span className="text-orange-500">Explosão</span>
                </h1>
                <p className="text-xs text-gray-400 font-sans">
                  Audiobook & Ebook completo • Isabella Xavier
                </p>
              </div>
            </div>

            {/* Token Active Pill */}
            <div className="hidden sm:flex items-center space-x-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-green-500">
                Token Ativo: {session.token}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0d0d0f] p-1.5 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('curso')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'curso'
                  ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Módulos & Audiobook</span>
            </button>

            <button
              onClick={() => setActiveTab('bonuses')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 relative ${
                activeTab === 'bonuses'
                  ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-200 border border-amber-500/20 shadow-lg shadow-amber-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Área Black Edition (Bônus)</span>
              {isVip ? (
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  LIBERADO
                </span>
              ) : (
                <Lock className="w-3 h-3 ml-1 text-amber-500/80" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-2 relative ${
                activeTab === 'community'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-lg shadow-amber-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Comunidade VIP</span>
              {isVip ? (
                <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  VIP
                </span>
              ) : (
                <Lock className="w-3 h-3 ml-1 text-amber-500/80" />
              )}
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* User Tier Status Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              {isVip ? (
                <div className="flex items-center space-x-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wider">PLATINUM VIP</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-gray-300">
                  <span className="text-xs font-medium text-gray-400">PLANO PADRÃO</span>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Sair / Trocar Token"
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-medium">Sair</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden space-x-1.5 py-2 border-t border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('curso')}
            className={`px-3 py-2 rounded-xl text-[11px] font-semibold text-center whitespace-nowrap ${
              activeTab === 'curso'
                ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20'
                : 'text-gray-400 bg-white/5'
            }`}
          >
            Módulos
          </button>
          <button
            onClick={() => setActiveTab('bonuses')}
            className={`px-3 py-2 rounded-xl text-[11px] font-semibold text-center whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'bonuses'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'text-gray-400 bg-white/5'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Área Black</span>
            {!isVip && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-2 rounded-xl text-[11px] font-semibold text-center whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'community'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'text-gray-400 bg-white/5'
            }`}
          >
            <MessageSquare className="w-3 h-3 text-amber-400" />
            <span>Comunidade VIP</span>
            {!isVip && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(249,115,22,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
