/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CourseModule, Topic } from '../types';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Play, BookOpen, Clock, Sparkles } from 'lucide-react';

interface ModuleAccordionProps {
  modules: CourseModule[];
  selectedTopicId: string;
  completedTopics: string[];
  onSelectTopic: (module: CourseModule, topic: Topic) => void;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  modules,
  selectedTopicId,
  completedTopics,
  onSelectTopic
}) => {
  // Open first module by default
  const [openModuleIds, setOpenModuleIds] = useState<string[]>([modules[0]?.id || 'modulo-1']);

  const toggleModule = (id: string) => {
    setOpenModuleIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {modules.map((module) => {
        const isOpen = openModuleIds.includes(module.id);
        const moduleCompletedCount = module.topics.filter(t => completedTopics.includes(t.id)).length;
        const totalModuleTopics = module.topics.length;
        const isModuleFullyDone = moduleCompletedCount === totalModuleTopics;

        return (
          <div
            key={module.id}
            className={`border rounded-3xl transition-all duration-200 overflow-hidden ${
              isModuleFullyDone
                ? 'bg-[#121214] border-emerald-500/30'
                : 'bg-[#121214] border-white/5 hover:border-white/10'
            }`}
          >
            {/* Module Accordion Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 focus:outline-none"
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                    isModuleFullyDone
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-orange-600/10 text-orange-500 border-orange-500/20'
                  }`}
                >
                  {module.number}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {module.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {module.subtitle}
                  </p>

                  <div className="flex items-center space-x-3 mt-2 text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-orange-500/80" />
                      {totalModuleTopics} Tópicos
                    </span>
                    <span>•</span>
                    <span className="text-orange-500 font-semibold">
                      {moduleCompletedCount}/{totalModuleTopics} Concluídos
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 pt-1">
                {isModuleFullyDone && (
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    CONCLUÍDO
                  </span>
                )}
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-orange-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Module Topics List */}
            {isOpen && (
              <div className="border-t border-white/5 bg-[#0d0d0f] p-2 space-y-1">
                {module.topics.map((topic) => {
                  const isSelected = selectedTopicId === topic.id;
                  const isDone = completedTopics.includes(topic.id);

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(module, topic)}
                      className={`w-full p-3.5 rounded-2xl text-left flex items-start justify-between gap-3 transition-all duration-150 ${
                        isSelected
                          ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/5'
                          : 'hover:bg-white/5 text-gray-400 border border-transparent'
                      }`}
                    >
                      <div className="flex items-start space-x-3 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : isSelected ? (
                          <Play className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                        )}

                        <div className="min-w-0">
                          <span className={`text-xs font-semibold block truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {topic.number}. {topic.title}
                          </span>
                          <span className="text-[11px] text-gray-400 truncate block mt-0.5">
                            {topic.shortSummary}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-gray-500 shrink-0">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>{topic.durationMinutes}m</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
