import { useState, useEffect, useCallback } from "react";
import { DiagnosisResult } from "@/components/DiagnosisCard";

const CACHE_KEY = "kero_offline_diagnoses";
const MAX_CACHED = 5;

export interface CachedDiagnosis {
  id: string;
  result: DiagnosisResult;
  cropName: string;
  mode: string;
  timestamp: number;
}

export function useOfflineCache() {
  const [cached, setCached] = useState<CachedDiagnosis[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      try {
        setCached(JSON.parse(stored));
      } catch {}
    }

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const saveDiagnosis = useCallback(
    (result: DiagnosisResult, cropName: string, mode: string, id?: string) => {
      const entry: CachedDiagnosis = {
        id: id || crypto.randomUUID(),
        result,
        cropName,
        mode,
        timestamp: Date.now(),
      };
      setCached((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_CACHED);
        localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setCached([]);
  }, []);

  return { cached, saveDiagnosis, clearCache, isOffline };
}
