import { useState, useEffect, useRef, useCallback } from "react";

const TTS_DISABLED_KEY = "kero_tts_disabled_until";

export function isTTSDisabled(): boolean {
  const until = localStorage.getItem(TTS_DISABLED_KEY);
  if (!until) return false;
  return new Date(until) > new Date();
}

/**
 * Smart Voice Assistant using Web Speech API
 * Selects the most natural-sounding voice available on the device
 * Supports English and Kinyarwanda
 */

function getBestVoice(lang: "en" | "ki"): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  if (!voices.length) return null;

  if (lang === "ki") {
    // Try Kinyarwanda voices first
    const rwVoice = voices.find(v => v.lang.startsWith("rw"));
    if (rwVoice) return rwVoice;
    // Fall back to a natural-sounding English voice for reading Kinyarwanda
    // (Kinyarwanda is phonetically regular, so English voices read it reasonably well)
  }

  // Prefer premium / natural voices
  const naturalKeywords = ["natural", "premium", "enhanced", "neural", "wavenet"];
  const englishVoices = voices.filter(v => v.lang.startsWith("en"));

  // Try to find a premium voice
  for (const keyword of naturalKeywords) {
    const premium = englishVoices.find(v => v.name.toLowerCase().includes(keyword));
    if (premium) return premium;
  }

  // Prefer Google or Microsoft voices (generally higher quality)
  const branded = englishVoices.find(v =>
    v.name.includes("Google") || v.name.includes("Microsoft") || v.name.includes("Samantha")
  );
  if (branded) return branded;

  // Any non-default English voice
  const nonDefault = englishVoices.find(v => !v.localService);
  if (nonDefault) return nonDefault;

  // Any English voice
  if (englishVoices.length) return englishVoices[0];

  return voices[0];
}

export function useVoiceAssistant() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [disabled, setDisabled] = useState(isTTSDisabled());
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const supported = "speechSynthesis" in window && !isTTSDisabled();
    setIsSupported(supported);
    setDisabled(isTTSDisabled());
    if (!supported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) setVoicesLoaded(true);
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang: "en" | "ki" = "en") => {
    if (!isSupported) return;

    // Stop any current speech
    speechSynthesis.cancel();

    // Clean text: remove markdown, emojis, bullets
    const cleanText = text
      .replace(/[#*_~`]/g, "")
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, ", ")
      .replace(/•/g, "")
      .replace(/\d+\./g, "")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = getBestVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.rate = lang === "ki" ? 0.85 : 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback((text: string, lang: "en" | "ki" = "en") => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  }, [isSpeaking, speak, stop]);

  return { speak, stop, toggle, isSpeaking, isSupported, disabled };
}
