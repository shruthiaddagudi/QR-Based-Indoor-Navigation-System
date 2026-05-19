"use client";

import { useState } from "react";
import type { Route, RouteStep } from "@/lib/pathfinding";
import type { Point, UserPosition } from "@/types";
import useVoiceGuidance from "@/hooks/useVoiceGuidance";
import VoiceControls from "@/components/navigation/VoiceControls";

interface NavigationHUDProps {
  route: Route;
  currentStep: RouteStep | null;
  nextStep: RouteStep | null;
  progressPercent: number;
  currentStepIndex: number;
  isSimulating: boolean;
  isLiveTracking: boolean;
  isPermissionGranted: boolean;
  sensorSupported: boolean;
  stepCount: number;
  accuracy: number;
  source: UserPosition["source"];
  compassTrusted: boolean;
  position: Point | null;
  currentFloor: number;
  confidence: number;
  onToggleSimulate: () => void;
  onToggleLiveTrack: () => void;
  requestPermission: () => Promise<boolean>;
  onStop: () => void;
  onOpenQRScanner?: () => void;
}


export default function NavigationHUD({
  route,
  currentStep,
  nextStep,
  progressPercent,
  currentStepIndex,
  isSimulating,
  isLiveTracking,
  isPermissionGranted,
  sensorSupported,
  stepCount,
  accuracy,
  source,
  compassTrusted,
  position,
  currentFloor,
  confidence,
  onToggleSimulate,
  onToggleLiveTrack,
  requestPermission,
  onStop,
  onOpenQRScanner,
}: NavigationHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSteps = Math.min(route.steps.length, currentStepIndex + 1);
  const remainingMinutes = Math.max(
    0,
    route.estimatedMinutes - Math.round(route.estimatedMinutes * progressPercent)
  );
  const progressLabel = `${completedSteps}/${route.steps.length} steps`;

  const {
    isVoiceEnabled,
    toggleVoice,
    onVolumeChange,
    onRateChange,
    isSpeaking,
    lastAnnouncement,
    isVoiceUnlocked,
    unlockVoiceGesture,
  } = useVoiceGuidance({
    route,
    currentStepIndex,
    position,
    currentFloor,
    confidence,
    isActive: route.found,
    source,
    isLiveTracking,
  });

  const handleLiveTrackClick = async () => {
    if (isLiveTracking) {
      onToggleLiveTrack();
      return;
    }
    if (!sensorSupported) return;
    if (!isPermissionGranted) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    onToggleLiveTrack();
  };

  return (
    <div className="fixed left-0 right-0 bottom-[120px] z-30 px-4 pointer-events-none">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl p-4 shadow-2xl shadow-slate-950/40 pointer-events-auto transition-all duration-300">
        
        {/* TOP COMPACT VIEW */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-1">
              Navigation Active
            </p>
            <p className="text-sm font-semibold text-white leading-tight sm:text-base truncate">
              {currentStep?.instruction ?? "Starting navigation…"}
            </p>
            {nextStep && (
              <p className="mt-1 text-[11px] text-slate-400 sm:text-sm truncate">
                Next: {nextStep.instruction}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end shrink-0 gap-2">
            <div className="text-right">
              <p className="text-xl font-bold text-white leading-none">{route.estimatedMinutes} <span className="text-[10px] text-slate-400 font-normal">MIN</span></p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full font-medium"
            >
              {isExpanded ? "Less ▲" : "More ▼"}
            </button>
          </div>
        </div>

        {/* COMPACT PROGRESS BAR */}
        {!isExpanded && (
          <div className="mt-3 overflow-hidden rounded-full bg-slate-900 border border-slate-800">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
              style={{ width: `${Math.round(progressPercent * 100)}%` }}
            />
          </div>
        )}

        {/* EXPANDED CONTENT */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
            {isLiveTracking && (
              <div className="mb-4 flex flex-wrap gap-2 text-[10px] text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                <span className="flex items-center gap-1.5 font-medium text-rose-400">
                  <span className="inline-flex h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                  Live Tracking
                </span>
                <span>• {stepCount} steps</span>
                <span>• ±{accuracy} units</span>
                {!compassTrusted && isPermissionGranted && (
                  <span className="text-amber-300">• Calibrating compass…</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
              <button
                onClick={onToggleSimulate}
                className={`rounded-xl px-4 py-2.5 text-[11px] sm:text-sm font-semibold transition ${
                  isSimulating
                    ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {isSimulating ? "Stop Simulation" : "Simulate Walk"}
              </button>
              <button
                type="button"
                onClick={handleLiveTrackClick}
                disabled={!sensorSupported}
                className={`rounded-xl px-4 py-2.5 text-[11px] sm:text-sm font-semibold transition ${
                  isLiveTracking
                    ? "bg-rose-500 text-slate-950 hover:bg-rose-400"
                    : sensorSupported
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-slate-700/40 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isLiveTracking ? "Stop Live Track" : "Live Track"}
              </button>
              {isLiveTracking && onOpenQRScanner && (
                <button
                  onClick={onOpenQRScanner}
                  className="rounded-xl px-4 py-2.5 bg-blue-500 text-slate-950 text-[11px] sm:text-sm font-semibold hover:bg-blue-400 transition"
                >
                  QR Calibrate
                </button>
              )}
              <button
                onClick={onStop}
                className="col-span-2 sm:col-span-1 rounded-xl px-4 py-2.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] sm:text-sm font-semibold hover:bg-rose-500 hover:text-white transition"
              >
                End Route
              </button>
            </div>

            {!sensorSupported && (
              <div className="mt-3 rounded-xl border border-rose-600/30 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-200">
                Live Track needs a phone with motion sensors. Use Simulate Walk on desktop.
              </div>
            )}

            {isLiveTracking && sensorSupported && !isPermissionGranted && (
              <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-100 flex items-center justify-between">
                <span>Sensor permission denied.</span>
                <button
                  onClick={requestPermission}
                  className="rounded-lg bg-amber-400/20 px-2 py-1 text-[10px] font-semibold text-amber-200 hover:bg-amber-400/30 transition"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <div className="overflow-hidden rounded-full bg-slate-900 border border-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
                    style={{ width: `${Math.round(progressPercent * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{progressLabel}</span>
                  <span>{Math.round(progressPercent * 100)}% Complete</span>
                </div>
              </div>

              <VoiceControls
                isVoiceEnabled={isVoiceEnabled}
                onToggle={toggleVoice}
                onVolumeChange={onVolumeChange}
                onRateChange={onRateChange}
                lastAnnouncement={lastAnnouncement}
                isSpeaking={isSpeaking}
              />

              {!isVoiceUnlocked && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-100">
                  Voice guidance needs a tap to unlock on this device.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
