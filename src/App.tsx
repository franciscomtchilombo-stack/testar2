import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { KeyboardDeck } from './components/KeyboardDeck';
import {
  OfflineIndicator,
  PWAInstallButton,
} from './components/PWAInstallControls';
import {
  ACUTE_MAP,
  TILDE_MAP,
  VirtualKey,
} from './data/keyboardLayout';
import { playKeyClick } from './utils/sound';
import { copyText, exportTxt, isNative } from './utils/native';

const STORAGE_KEY = 'teclado_umbundu_draft_v1';
const SOUND_STORAGE_KEY = 'teclado_umbundu_sound_v1';
const NASAL_LOCK_STORAGE_KEY = 'teclado_umbundu_nasal_lock_v1';

export default function App() {
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [history, setHistory] = useState<string[]>([]);
  const [isShift, setIsShift] = useState(false);
  const [isCaps, setIsCaps] = useState(false);
  const [isNasalLock, setIsNasalLock] = useState<boolean>(() => {
    try {
      return localStorage.getItem(NASAL_LOCK_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [pendingDeadKey, setPendingDeadKey] = useState<'~' | '´' | null>(null);
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [copiedAll, setCopiedAll] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pressTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch {
      // Ignore storage quota errors
    }
  }, [text]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // Ignore storage quota errors
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(NASAL_LOCK_STORAGE_KEY, String(isNasalLock));
    } catch {
      // Ignore storage quota errors
    }
  }, [isNasalLock]);

  const flashKey = useCallback((id: string) => {
    setPressedKeyId(id);
    if (pressTimeoutRef.current) {
      window.clearTimeout(pressTimeoutRef.current);
    }
    pressTimeoutRef.current = window.setTimeout(() => {
      setPressedKeyId((current) => (current === id ? null : current));
    }, 130);
  }, []);

  const triggerClickSound = useCallback(
    (isAccent = false) => {
      if (soundEnabled) {
        playKeyClick(isAccent);
      }
    },
    [soundEnabled],
  );

  const pushHistoryAndSetText = useCallback(
    (nextText: string, nextCursorPos?: number) => {
      setHistory((prev) => [...prev.slice(-49), text]);
      setText(nextText);
      if (typeof nextCursorPos === 'number') {
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (el) {
            el.focus();
            el.setSelectionRange(nextCursorPos, nextPosSafe(nextCursorPos, nextText));
          }
        });
      }
    },
    [text],
  );

  const insertAtCursor = useCallback(
    (chunk: string) => {
      const el = textareaRef.current;
      if (!el) {
        pushHistoryAndSetText(text + chunk);
        return;
      }
      const start = el.selectionStart ?? text.length;
      const end = el.selectionEnd ?? text.length;
      const nextText = text.slice(0, start) + chunk + text.slice(end);
      const nextPos = start + chunk.length;
      pushHistoryAndSetText(nextText, nextPos);
    },
    [pushHistoryAndSetText, text],
  );

  const deleteAtCursor = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      if (text.length > 0) {
        pushHistoryAndSetText(text.slice(0, -1));
      }
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;

    if (start !== end) {
      const nextText = text.slice(0, start) + text.slice(end);
      pushHistoryAndSetText(nextText, start);
    } else if (start > 0) {
      const nextText = text.slice(0, start - 1) + text.slice(end);
      pushHistoryAndSetText(nextText, start - 1);
    }
  }, [pushHistoryAndSetText, text]);

  const moveCursor = useCallback(
    (delta: number) => {
      const el = textareaRef.current;
      if (!el) return;
      const current = el.selectionStart ?? text.length;
      const next = Math.max(0, Math.min(text.length, current + delta));
      el.focus();
      el.setSelectionRange(next, next);
    },
    [text.length],
  );

  const resolveCharacterWithDeadKey = useCallback(
    (char: string, deadKey: '~' | '´' | null): string => {
      if (!deadKey) return char;
      if (deadKey === '~') {
        if (TILDE_MAP[char]) return TILDE_MAP[char];
        if (char === ' ') return '~';
        return `~${char}`;
      }
      if (deadKey === '´') {
        if (ACUTE_MAP[char]) return ACUTE_MAP[char];
        if (char === ' ') return '´';
        return `´${char}`;
      }
      return char;
    },
    [],
  );

  const handleVirtualNasalInsert = useCallback(
    (glyph: string, keyId: string) => {
      flashKey(keyId);
      triggerClickSound(true);
      setPendingDeadKey(null);
      insertAtCursor(glyph);
      if (isShift) {
        setIsShift(false);
      }
    },
    [flashKey, insertAtCursor, isShift, triggerClickSound],
  );

  const handleVirtualKeyPress = useCallback(
    (key: VirtualKey) => {
      flashKey(key.id);

      switch (key.type) {
        case 'shift':
          triggerClickSound(true);
          setIsShift((prev) => !prev);
          return;
        case 'capslock':
          triggerClickSound(true);
          setIsCaps((prev) => !prev);
          return;
        case 'nasal-lock':
          triggerClickSound(true);
          setIsNasalLock((prev) => !prev);
          setPendingDeadKey(null);
          return;
        case 'dead-tilde': {
          triggerClickSound(true);
          const symbol = isShift ? '^' : '~';
          if (symbol === '^') {
            setPendingDeadKey(null);
            insertAtCursor('^');
            setIsShift(false);
            return;
          }
          if (pendingDeadKey === '~') {
            setPendingDeadKey(null);
            insertAtCursor('~');
          } else {
            setPendingDeadKey('~');
          }
          return;
        }
        case 'dead-acute': {
          triggerClickSound(true);
          const symbol = isShift ? '`' : '´';
          if (symbol === '`') {
            setPendingDeadKey(null);
            insertAtCursor('`');
            setIsShift(false);
            return;
          }
          if (pendingDeadKey === '´') {
            setPendingDeadKey(null);
            insertAtCursor('´');
          } else {
            setPendingDeadKey('´');
          }
          return;
        }
        case 'backspace':
          triggerClickSound();
          if (pendingDeadKey) {
            setPendingDeadKey(null);
          } else {
            deleteAtCursor();
          }
          return;
        case 'enter':
          triggerClickSound();
          setPendingDeadKey(null);
          insertAtCursor('\n');
          return;
        case 'tab':
          triggerClickSound();
          setPendingDeadKey(null);
          insertAtCursor('  ');
          return;
        case 'space':
          triggerClickSound();
          if (pendingDeadKey) {
            const resolved = resolveCharacterWithDeadKey(' ', pendingDeadKey);
            setPendingDeadKey(null);
            insertAtCursor(resolved);
          } else {
            insertAtCursor(' ');
          }
          return;
        case 'arrow-left':
          triggerClickSound();
          moveCursor(-1);
          return;
        case 'arrow-right':
          triggerClickSound();
          moveCursor(1);
          return;
        case 'char': {
          triggerClickSound();
          const isAlpha = /^[a-zç]$/i.test(key.label);
          const uppercase = isAlpha ? isShift !== isCaps : isShift;

          let charToInsert =
            uppercase && key.shiftLabel ? key.shiftLabel : key.label;

          if (isAlpha && isNasalLock && key.nasalAlt && key.nasalAltUpper) {
            charToInsert = uppercase ? key.nasalAltUpper : key.nasalAlt;
          } else if (pendingDeadKey) {
            charToInsert = resolveCharacterWithDeadKey(
              charToInsert,
              pendingDeadKey,
            );
          }

          setPendingDeadKey(null);
          insertAtCursor(charToInsert);
          if (isShift) {
            setIsShift(false);
          }
          return;
        }
      }
    },
    [
      deleteAtCursor,
      flashKey,
      insertAtCursor,
      isCaps,
      isNasalLock,
      isShift,
      moveCursor,
      pendingDeadKey,
      resolveCharacterWithDeadKey,
      triggerClickSound,
    ],
  );

  const handlePhysicalKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.code) {
      flashKey(e.code);
    }

    const capsState = e.getModifierState('CapsLock');
    if (capsState !== isCaps) {
      setIsCaps(capsState);
    }

    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const mapped = TILDE_MAP[e.key];
      if (mapped) {
        e.preventDefault();
        triggerClickSound(true);
        setPendingDeadKey(null);
        insertAtCursor(mapped);
        return;
      }
    }

    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    if (e.key === '~') {
      e.preventDefault();
      triggerClickSound(true);
      if (pendingDeadKey === '~') {
        setPendingDeadKey(null);
        insertAtCursor('~');
      } else {
        setPendingDeadKey('~');
      }
      return;
    }

    if (pendingDeadKey) {
      if (e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        setPendingDeadKey(null);
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        triggerClickSound(true);
        const resolved = resolveCharacterWithDeadKey(e.key, pendingDeadKey);
        setPendingDeadKey(null);
        insertAtCursor(resolved);
        return;
      }
    }

    if (isNasalLock && e.key.length === 1 && TILDE_MAP[e.key]) {
      e.preventDefault();
      triggerClickSound(true);
      insertAtCursor(TILDE_MAP[e.key]);
      return;
    }

    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
      triggerClickSound();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    const cursor = e.target.selectionStart ?? rawValue.length;

    const beforeCursor = rawValue.slice(0, cursor);
    const match = beforeCursor.match(/~([aeiounAEIOUN])$/);
    if (match && TILDE_MAP[match[1]]) {
      const replaced = TILDE_MAP[match[1]];
      const nextBefore = beforeCursor.slice(0, -2) + replaced;
      const nextText = nextBefore + rawValue.slice(cursor);
      pushHistoryAndSetText(nextText, nextBefore.length);
      return;
    }

    setHistory((prev) => [...prev.slice(-49), text]);
    setText(rawValue);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setText(previous);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleClear = () => {
    if (!text) return;
    setPendingDeadKey(null);
    pushHistoryAndSetText('', 0);
  };

  const handleCopyAll = async () => {
    if (!text) return;
    try {
      await copyText(text);
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 1800);
    } catch {
      textareaRef.current?.select();
    }
  };

  const handleDownloadTxt = () => {
    if (!text) return;
    void exportTxt(text, 'texto-umbundu.txt').catch(() => {
      // Usuário cancelou o menu de compartilhar
    });
  };

  const stats = useMemo(() => {
    const chars = text.length;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const nasals = (text.match(/[ãẽĩõũñÃẼĨÕŨÑ]/g) ?? []).length;
    return { chars, words, nasals };
  }, [text]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F5F6F8] text-[#141518] overflow-x-hidden">
      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-20 bg-[#F5F6F8]/95 backdrop-blur-sm border-b border-[#DDE1E9]">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          <a
            href="#editor"
            className="text-base sm:text-lg font-bold tracking-tight text-[#141518] whitespace-nowrap shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Teclado de Umbundu
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]"
          >
            <a
              href="#editor"
              className="hover:text-[#141518] transition-colors whitespace-nowrap shrink-0"
            >
              Editor
            </a>
            <a
              href="#teclado"
              className="hover:text-[#141518] transition-colors whitespace-nowrap shrink-0"
            >
              Teclado
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={!text}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:bg-[#CBD5E1] disabled:text-[#64748B] text-white transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                  <span className="sm:hidden">Copiar</span>
                  <span className="hidden sm:inline">Copiar Texto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-2 sm:px-6 py-4 sm:py-8 space-y-3 sm:space-y-6">
        {/* Heading */}
        <section className="px-1 sm:px-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#141518] [text-wrap:balance] break-words">
            Francisco Tchilombo/Huambo/923526749
          </h1>
        </section>

        {/* Writing Canvas / Editor */}
        <section
          id="editor"
          aria-label="Editor de texto"
          className="bg-white border border-[#D4D7DF] rounded-xl sm:rounded-2xl overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-[#E5E8EE] bg-[#FAFAFB]">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#64748B] font-mono tabular-nums">
              <span>{stats.chars} car.</span>
              <span aria-hidden="true">·</span>
              <span>{stats.words} pal.</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#1D4ED8] font-medium">
                {stats.nasals} nasais
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <PWAInstallButton />
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                aria-pressed={soundEnabled}
                title={soundEnabled ? 'Desativar som das teclas' : 'Ativar som das teclas'}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#475569] hover:text-[#141518] hover:bg-[#EFF1F5] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {soundEnabled ? 'Som ativo' : 'Sem som'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                title="Desfazer"
                aria-label="Desfazer"
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#475569] hover:text-[#141518] hover:bg-[#EFF1F5] disabled:opacity-40 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Desfazer</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                disabled={!text}
                title="Baixar .txt"
                aria-label="Baixar .txt"
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#475569] hover:text-[#141518] hover:bg-[#EFF1F5] disabled:opacity-40 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Baixar .txt</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!text}
                title="Limpar"
                aria-label="Limpar"
                className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2] disabled:opacity-40 disabled:hover:bg-transparent rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextareaChange}
            onKeyDown={handlePhysicalKeyDown}
            rows={4}
            spellCheck={false}
            inputMode={isNative ? 'none' : undefined}
            placeholder="Escreva aqui..."
            aria-label="Campo de digitação de texto"
            className="w-full p-3 sm:p-5 bg-white text-[#141518] placeholder:text-[#94A3B8] text-base sm:text-lg leading-relaxed resize-y min-h-[112px] sm:min-h-[148px] focus:outline-none"
          />
        </section>

        {/* Interactive QWERTY Keyboard Deck */}
        <section id="teclado" aria-label="Teclado virtual">
          <KeyboardDeck
            isShift={isShift}
            isCaps={isCaps}
            isNasalLock={isNasalLock}
            pendingDeadKey={pendingDeadKey}
            pressedKeyId={pressedKeyId}
            onKeyPress={handleVirtualKeyPress}
            onInsertNasal={handleVirtualNasalInsert}
          />
        </section>
      </main>

      <OfflineIndicator />
    </div>
  );
}

function nextPosSafe(pos: number, text: string): number {
  return Math.max(0, Math.min(pos, text.length));
}
