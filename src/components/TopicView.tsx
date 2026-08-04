/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Topic, CourseModule } from '../types';
import { AudioPlayerBar } from './AudioPlayerBar';
import { Brain, CheckCircle2, Circle, Lightbulb, AlertTriangle, BookOpen, Save, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { getStoredNotes, saveNote } from '../lib/tokenAuth';

interface TopicViewProps {
  module: CourseModule;
  topic: Topic;
  isCompleted: boolean;
  onToggleComplete: (topicId: string) => void;
  onSelectNextTopic?: () => void;
  onBackToModules?: () => void;
  isVipUser?: boolean;
  onNavigateToBonuses?: () => void;
}

export const TopicView: React.FC<TopicViewProps> = ({
  module,
  topic,
  isCompleted,
  onToggleComplete,
  onSelectNextTopic,
  onBackToModules,
  isVipUser = false,
  onNavigateToBonuses
}) => {
  const [userNote, setUserNote] = useState('');
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

  useEffect(() => {
    const notes = getStoredNotes();
    setUserNote(notes[topic.id] || '');
  }, [topic.id]);

  const handleSaveNote = () => {
    saveNote(topic.id, userNote);
    setNoteSavedAlert(true);
    setTimeout(() => setNoteSavedAlert(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Mobile Back Button */}
      {onBackToModules && (
        <button
          onClick={onBackToModules}
          className="md:hidden inline-flex items-center space-x-1.5 text-xs text-orange-500 hover:text-orange-400 font-medium py-1.5 px-3 rounded-xl bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Módulos</span>
        </button>
      )}

      {/* Audio Player Component */}
      <AudioPlayerBar
        currentTopic={topic}
        moduleTitle={module.title}
        onTopicComplete={() => {
          if (!isCompleted) onToggleComplete(topic.id);
        }}
      />

      {/* Main Topic Header */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500 block mb-1">
              Módulo {module.number} • Tópico {topic.number}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {topic.title}
            </h2>
          </div>

          <button
            onClick={() => onToggleComplete(topic.id)}
            className={`self-start sm:self-center px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tópico Concluído</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-gray-400" />
                <span>Marcar como Concluído</span>
              </>
            )}
          </button>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed max-w-3xl border-l-2 border-orange-500/40 pl-4 py-1 italic">
          "{topic.shortSummary}"
        </p>
      </div>

      {/* Neuroscience Breakdown Card */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              O que Ocorre no Cérebro (Análise Neurocientífica)
            </h3>
            <p className="text-xs text-indigo-400/80 font-mono">
              Processo Químico & Região Cerebral Ativada
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="bg-[#0d0d0f] p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block mb-1">
              Região Cerebral Afetada:
            </span>
            <span className="font-semibold text-sm text-white">
              {topic.neuroscienceBreakdown.brainRegion}
            </span>
          </div>

          <div className="bg-[#0d0d0f] p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 block mb-1">
              Processo Neuroquímico:
            </span>
            <span className="font-semibold text-sm text-white">
              {topic.neuroscienceBreakdown.chemicalProcess}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#0d0d0f] p-4 rounded-2xl border border-white/5">
          {topic.neuroscienceBreakdown.explanation}
        </p>
      </div>

      {/* Practical Action Card ("Na Prática") */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Na Prática: Ação de Aplicação Imediata
            </h3>
            <p className="text-xs text-emerald-400/80 font-mono">
              {topic.practicalAction.action}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0d0d0f] p-4 sm:p-5 rounded-2xl border border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Como Aplicar Agora:
            </span>
            <p className="text-sm text-gray-200 leading-relaxed">
              {topic.practicalAction.howToApply}
            </p>
          </div>

          <div className="bg-[#0d0d0f] p-4 sm:p-5 rounded-2xl border border-rose-500/20">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Evite Este Erro Comum:
            </span>
            <p className="text-sm text-rose-200/90 leading-relaxed">
              {topic.practicalAction.avoidThis}
            </p>
          </div>
        </div>
      </div>

      {/* Full Transcript Reading Section */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-bold text-white">
            Transcrição e Leitura do Ebook
          </h3>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed bg-[#0d0d0f] p-6 rounded-2xl border border-white/5 font-sans">
          <p className="whitespace-pre-line leading-relaxed text-gray-200">
            {topic.transcript}
          </p>
        </div>
      </div>

      {/* Interactive Self-Reflection Journal */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-white">
              Seu Caderno de Anotação e Reflexão
            </h3>
          </div>
          {noteSavedAlert && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
              ✓ Anotação Salva!
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-3 italic">
          "{topic.reflectionPrompt}"
        </p>

        <textarea
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          placeholder="Escreva seus pensamentos, situações recentes e como você irá aplicar este aprendizado no seu relacionamento..."
          rows={4}
          className="w-full p-4 bg-[#0d0d0f] border border-white/10 rounded-2xl text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-all font-sans"
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveNote}
            className="px-5 py-2.5 rounded-2xl bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-bold flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar Reflexão</span>
          </button>
        </div>
      </div>

      {/* Next Topic Action */}
      {onSelectNextTopic && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onSelectNextTopic}
            className="py-3.5 px-7 rounded-2xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/30 flex items-center space-x-2"
          >
            <span>Próximo Tópico</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
