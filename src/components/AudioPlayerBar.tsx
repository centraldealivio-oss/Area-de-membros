/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Topic } from '../types';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Sparkles, FastForward } from 'lucide-react';

interface AudioPlayerBarProps {
  currentTopic: Topic;
  moduleTitle: string;
  onTopicComplete?: (topicId: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  currentTopic,
  moduleTitle,
  onTopicComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Speech Synthesis for the topic transcript
  useEffect(() => {
    // Reset player when topic changes
    stopAudio();
    setProgressPercent(0);
    setIsPlaying(false);
  }, [currentTopic.id]);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(currentTopic.transcript);
      utterance.lang = 'pt-BR';
      // Soothing rate and pitch for warm human narration
      utterance.rate = playbackSpeed * 0.92;
      utterance.pitch = 0.95;

      // Select natural, soft Brazilian Portuguese voice if available
      const voices = window.speechSynthesis.getVoices();
      const ptVoices = voices.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
      
      // Preferred warm/soft/female voices
      const preferredVoice = ptVoices.find(v => 
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('francisca') ||
        v.name.toLowerCase().includes('luciana') ||
        v.name.toLowerCase().includes('maria') ||
        v.name.toLowerCase().includes('vitoria') ||
        v.name.toLowerCase().includes('camila') ||
        v.name.toLowerCase().includes('heloisa') ||
        v.name.toLowerCase().includes('leticia')
      ) || ptVoices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setProgressPercent(100);
        if (onTopicComplete) {
          onTopicComplete(currentTopic.id);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      // Progress animation fallback timer
      let currentProgress = progressPercent;
      const totalDurationSec = (currentTopic.durationMinutes * 60) / playbackSpeed;
      const intervalMs = 1000;
      const stepPercent = (100 / totalDurationSec);

      timerRef.current = setInterval(() => {
        currentProgress += stepPercent;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(timerRef.current!);
        }
        setProgressPercent(Math.min(currentProgress, 100));
      }, intervalMs);

    } else {
      // Fallback simulation mode
      setIsPlaying(true);
      let p = progressPercent;
      timerRef.current = setInterval(() => {
        p += 2;
        if (p >= 100) {
          p = 100;
          setIsPlaying(false);
          clearInterval(timerRef.current!);
          if (onTopicComplete) onTopicComplete(currentTopic.id);
        }
        setProgressPercent(p);
      }, 500);
    }
  };

  const pauseAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);

    if (isPlaying) {
      stopAudio();
      setTimeout(() => playAudio(), 100);
    }
  };

  const handleRewind10 = () => {
    setProgressPercent(prev => Math.max(0, prev - 10));
  };

  const handleForward10 = () => {
    setProgressPercent(prev => Math.min(100, prev + 10));
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-5 sm:p-6 shadow-2xl text-gray-200 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Track Metadata */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 text-orange-500 shrink-0">
            <Sparkles className="w-6 h-6" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
              </span>
            )}
          </div>

          <div className="overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 font-mono block">
              Audiobook Narrado • {moduleTitle}
            </span>
            <h4 className="font-bold text-sm sm:text-base text-white truncate">
              Tópico {currentTopic.number}: {currentTopic.title}
            </h4>
            <p className="text-xs text-gray-400 truncate">
              {currentTopic.shortSummary}
            </p>
          </div>
        </div>

        {/* Player Controls & Waveform */}
        <div className="flex items-center space-x-3 sm:space-x-4 w-full md:w-auto justify-center">
          
          {/* Rewind 10s */}
          <button
            onClick={handleRewind10}
            title="Voltar 10 segundos"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors text-xs font-mono flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">10s</span>
          </button>

          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-500 hover:scale-105 transition-all shadow-2xl shadow-orange-600/40"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Forward 10s */}
          <button
            onClick={handleForward10}
            title="Avançar 10 segundos"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors text-xs font-mono flex items-center space-x-1"
          >
            <span className="hidden sm:inline">10s</span>
            <RotateCw className="w-3.5 h-3.5 text-orange-500" />
          </button>

          {/* Speed Control Pill */}
          <button
            onClick={handleSpeedChange}
            title="Alterar Velocidade de Reprodução"
            className="px-3 py-1.5 rounded-xl bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 border border-orange-500/20 text-xs font-mono font-bold transition-all"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Animated Waveform Indicator */}
        <div className="hidden lg:flex items-center space-x-1 h-8 px-3 py-1 bg-white/5 rounded-xl border border-white/5">
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
