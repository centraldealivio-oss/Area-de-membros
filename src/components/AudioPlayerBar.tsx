/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Topic } from '../types';
import { Play, Pause, RotateCcw, RotateCw, Volume2, Sparkles, Mic, Settings2 } from 'lucide-react';

interface AudioPlayerBarProps {
  currentTopic: Topic;
  moduleTitle: string;
  onTopicComplete?: (topicId: string) => void;
}

// Clean and prepare markdown/raw text into natural spoken Portuguese
function prepareTextForSpeech(text: string): string {
  if (!text) return '';
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[`_~]/g, '')
    // Fix common abbreviations and symbols
    .replace(/p\.ex\./gi, 'por exemplo')
    .replace(/vs\./gi, 'versus')
    .replace(/&\s*/g, 'e ')
    .replace(/(\d+)\s*min/gi, '$1 minutos')
    .replace(/(\d+)\s*s/gi, '$1 segundos')
    // Standardize pauses and punctuation
    .replace(/[-—–]{2,}/g, ', ')
    .replace(/\n+/g, '. ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTopic,
  moduleTitle,
  onTopicComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentChunkIndexRef = useRef<number>(0);
  const textChunksRef = useRef<string[]>([]);
  
  // Strict refs to prevent voice switching and pause bugs across async events
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);

  // Synchronize state with ref
  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  // Load available PT voices asynchronously
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter(v => 
        v.lang.toLowerCase().includes('pt') || 
        v.lang.toLowerCase().includes('br')
      );

      // Sort by preference (Natural, Google, Microsoft Neural, Apple)
      const sorted = [...ptVoices].sort((a, b) => {
        const scoreA = getVoiceScore(a);
        const scoreB = getVoiceScore(b);
        return scoreB - scoreA;
      });

      setAvailableVoices(sorted);
      
      // Lock default voice once on initial load
      if (sorted.length > 0 && !selectedVoiceRef.current) {
        selectedVoiceRef.current = sorted[0];
        setSelectedVoice(sorted[0]);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  function getVoiceScore(v: SpeechSynthesisVoice): number {
    const name = v.name.toLowerCase();
    let score = 0;
    if (name.includes('natural') || name.includes('online') || name.includes('neural')) score += 100;
    if (name.includes('google')) score += 80;
    if (name.includes('microsoft')) score += 60;
    if (name.includes('francisca') || name.includes('luciana') || name.includes('maria') || name.includes('camila')) score += 40;
    if (v.lang.toLowerCase() === 'pt-br') score += 50;
    return score;
  }

  // Reset player when topic changes
  useEffect(() => {
    stopAudio();
    setProgressPercent(0);
    setIsPlaying(false);
  }, [currentTopic.id]);

  const stopAudio = () => {
    isPlayingRef.current = false;
    isPausedRef.current = true;

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    currentChunkIndexRef.current = 0;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const playAudio = () => {
    if (typeof window === 'undefined') return;

    isPlayingRef.current = true;
    isPausedRef.current = false;
    setIsPlaying(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const cleanedText = prepareTextForSpeech(currentTopic.transcript || currentTopic.description);
      
      // Break into natural sentences for clean speech execution
      const chunks = cleanedText
        .split(/(?<=[.!?])\s+/)
        .filter(c => c.trim().length > 0);

      textChunksRef.current = chunks.length > 0 ? chunks : [cleanedText];

      speakChunkFromIndex(currentChunkIndexRef.current);

      // Smooth progress bar calculation
      const totalDurationSec = (currentTopic.durationMinutes * 60) / playbackSpeed;
      const intervalMs = 1000;
      const stepPercent = (100 / totalDurationSec);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (isPausedRef.current || !isPlayingRef.current) return;
        setProgressPercent(prev => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            return 100;
          }
          return Math.min(prev + stepPercent, 100);
        });
      }, intervalMs);

    } else {
      // Simulation mode
      let p = progressPercent;
      timerRef.current = setInterval(() => {
        p += 2;
        if (p >= 100) {
          p = 100;
          setIsPlaying(false);
          isPlayingRef.current = false;
          clearInterval(timerRef.current!);
          if (onTopicComplete) onTopicComplete(currentTopic.id);
        }
        setProgressPercent(p);
      }, 500);
    }
  };

  const speakChunkFromIndex = (index: number) => {
    if (!isPlayingRef.current || isPausedRef.current) return;

    if (index >= textChunksRef.current.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setProgressPercent(100);
      currentChunkIndexRef.current = 0;
      if (onTopicComplete) onTopicComplete(currentTopic.id);
      return;
    }

    currentChunkIndexRef.current = index;
    const chunkText = textChunksRef.current[index];

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = selectedVoiceRef.current?.lang || 'pt-BR';
    utterance.rate = playbackSpeed * 0.92; // Human narrative pace
    utterance.pitch = 0.98;

    // Consistently lock voice reference across every chunk
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.onend = () => {
      // ONLY advance if still playing and not paused
      if (isPlayingRef.current && !isPausedRef.current) {
        speakChunkFromIndex(index + 1);
      }
    };

    utterance.onerror = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        if (index + 1 < textChunksRef.current.length) {
          speakChunkFromIndex(index + 1);
        } else {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseAudio = () => {
    isPlayingRef.current = false;
    isPausedRef.current = true;
    setIsPlaying(false);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);

    if (isPlaying) {
      stopAudio();
      setTimeout(() => playAudio(), 100);
    }
  };

  const handleSelectVoice = (v: SpeechSynthesisVoice) => {
    selectedVoiceRef.current = v;
    setSelectedVoice(v);
    setShowVoiceMenu(false);
    if (isPlaying) {
      stopAudio();
      setTimeout(() => playAudio(), 100);
    }
  };

  const handleRewind10 = () => {
    setProgressPercent(prev => Math.max(0, prev - 10));
    currentChunkIndexRef.current = Math.max(0, currentChunkIndexRef.current - 2);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakChunkFromIndex(currentChunkIndexRef.current);
    }
  };

  const handleForward10 = () => {
    setProgressPercent(prev => Math.min(100, prev + 10));
    currentChunkIndexRef.current = Math.min(textChunksRef.current.length - 1, currentChunkIndexRef.current + 2);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      speakChunkFromIndex(currentChunkIndexRef.current);
    }
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl text-gray-200 mb-8 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
        
        {/* Track Metadata */}
        <div className="flex items-center gap-3.5 w-full lg:flex-1 lg:min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-500 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 font-mono block truncate">
              Audiobook Narrado • {moduleTitle}
            </span>
            <h4 className="font-bold text-sm sm:text-base text-white truncate">
              {currentTopic.title}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              {currentTopic.shortSummary}
            </p>
          </div>
        </div>

        {/* Player Controls & Voice Selector */}
        <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full lg:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          
          {/* Rewind 10s */}
          <button
            onClick={handleRewind10}
            title="Voltar 10 segundos"
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px]">10s</span>
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-500 hover:scale-105 transition-all shadow-xl shadow-orange-600/30 shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          {/* Forward 10s */}
          <button
            onClick={handleForward10}
            title="Avançar 10 segundos"
            className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors text-xs font-mono flex items-center gap-1 shrink-0"
          >
            <span className="text-[11px]">10s</span>
            <RotateCw className="w-3.5 h-3.5 text-orange-500" />
          </button>

          {/* Speed Control Pill */}
          <button
            onClick={handleSpeedChange}
            title="Alterar Velocidade de Reprodução"
            className="px-2.5 py-2 rounded-xl bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold transition-all shrink-0"
          >
            {playbackSpeed}x
          </button>

          {/* Voice Selector Pill */}
          {availableVoices.length > 0 && (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                title="Trocar Voz de Narração"
                className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[11px] max-w-[90px] sm:max-w-[120px] truncate">
                  {selectedVoice ? selectedVoice.name.replace(/Google|Microsoft|Portuguese|Brazil|pt-BR/gi, '').trim() || 'Voz HD' : 'Voz'}
                </span>
                <Settings2 className="w-3 h-3 text-gray-500" />
              </button>

              {/* Voice Selection Dropdown Menu */}
              {showVoiceMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#18181c] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono border-b border-white/5 mb-1">
                    Vozes Disponíveis ({availableVoices.length})
                  </div>
                  {availableVoices.map((voice, idx) => {
                    const isSelected = selectedVoice?.name === voice.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectVoice(voice)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-orange-600/20 border border-orange-500/30 text-orange-400 font-bold'
                            : 'hover:bg-white/5 text-gray-300'
                        }`}
                      >
                        <span className="truncate pr-2">{voice.name}</span>
                        {voice.name.toLowerCase().includes('natural') && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono">
                            HD
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Animated Waveform Indicator */}
          <div className="hidden xl:flex items-center space-x-1 h-8 px-2.5 py-1 bg-white/5 rounded-xl border border-white/5 shrink-0">
            {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 75, 45].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-orange-500 animate-pulse'
                    : 'bg-gray-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * Math.random()) + 20)}%` : `${h}%`
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Progress Bar & Timestamp */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center space-x-3">
        <span className="text-[10px] font-mono text-gray-400">
          {Math.floor((progressPercent * currentTopic.durationMinutes * 60) / 10000)}m
        </span>

        <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-orange-500 transition-all duration-200 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-[10px] font-mono text-orange-500 font-bold">
          {currentTopic.durationMinutes}:00m
        </span>
      </div>
    </div>
  );
};

