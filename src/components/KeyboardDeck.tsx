import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  Delete,
  Lock,
} from 'lucide-react';
import { KEYBOARD_ROWS, NASAL_GLYPHS, VirtualKey } from '../data/keyboardLayout';

interface KeyboardDeckProps {
  isShift: boolean;
  isCaps: boolean;
  isNasalLock: boolean;
  pendingDeadKey: '~' | '´' | null;
  pressedKeyId: string | null;
  onKeyPress: (key: VirtualKey) => void;
  onInsertNasal: (glyph: string, keyId: string) => void;
}

export const KeyboardDeck: React.FC<KeyboardDeckProps> = ({
  isShift,
  isCaps,
  isNasalLock,
  pendingDeadKey,
  pressedKeyId,
  onKeyPress,
  onInsertNasal,
}) => {
  const isUppercaseLetters = isShift !== isCaps;

  const getKeyDisplay = (key: VirtualKey): string => {
    if (key.type === 'char') {
      const isAlpha = /^[a-zç]$/i.test(key.label);
      if (isAlpha) {
        if (isNasalLock && key.nasalAlt && key.nasalAltUpper) {
          return isUppercaseLetters ? key.nasalAltUpper : key.nasalAlt;
        }
        return isUppercaseLetters && key.shiftLabel ? key.shiftLabel : key.label;
      }
      return isShift && key.shiftLabel ? key.shiftLabel : key.label;
    }
    if (key.type === 'dead-tilde' || key.type === 'dead-acute') {
      return isShift && key.shiftLabel ? key.shiftLabel : key.label;
    }
    return key.label;
  };

  const renderKeyIcon = (key: VirtualKey) => {
    switch (key.type) {
      case 'backspace':
        return (
          <span className="inline-flex items-center justify-center gap-1">
            <Delete className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">{key.label}</span>
          </span>
        );
      case 'enter':
        return (
          <span className="inline-flex items-center justify-center gap-1">
            <CornerDownLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">{key.label}</span>
          </span>
        );
      case 'shift':
        return (
          <span className="inline-flex items-center justify-center gap-1">
            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">{key.label}</span>
          </span>
        );
      case 'capslock':
        return (
          <span className="inline-flex items-center justify-center">
            <span className="sm:hidden text-[10px] font-semibold">Aa</span>
            <span className="hidden sm:inline text-xs">{key.label}</span>
          </span>
        );
      case 'tab':
        return (
          <span className="inline-flex items-center justify-center">
            <span className="sm:hidden text-[10px]">⇥</span>
            <span className="hidden sm:inline text-xs">{key.label}</span>
          </span>
        );
      case 'arrow-left':
        return <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />;
      case 'arrow-right':
        return <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />;
      case 'nasal-lock':
        return (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] sm:text-xs">
            <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">{isNasalLock ? 'Nasal On' : '~ Nasal'}</span>
            <span className="hidden sm:inline">
              {isNasalLock ? 'Nasal: Ativo' : 'Trava Nasal (~)'}
            </span>
          </span>
        );
      default:
        return getKeyDisplay(key);
    }
  };

  return (
    <div className="w-full select-none">
      {/* Recessed Keyboard Tray — fits 100% of phone screen widths without horizontal scroll */}
      <div className="bg-[#E5E8EE] border border-[#CFD4DE] rounded-xl sm:rounded-2xl p-1.5 sm:p-4">
        {/* Dedicated Top Nasal Vowel Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2 pb-2 sm:pb-3 mb-2 sm:mb-3 border-b border-[#CFD4DE]">
          <div className="flex items-center justify-between sm:justify-start gap-2 text-[11px] sm:text-xs font-medium text-[#475569] px-0.5 shrink-0">
            <span>Vogais nasais e ñ</span>
            {pendingDeadKey && (
              <span className="font-mono text-[#1D4ED8] font-semibold">
                · Tecla [{pendingDeadKey}]
              </span>
            )}
            {isNasalLock && !pendingDeadKey && (
              <span className="font-mono text-[#1D4ED8] font-semibold">
                · Nasal ativo
              </span>
            )}
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-2 w-full sm:flex-1 sm:max-w-xl">
            {NASAL_GLYPHS.map((item) => {
              const glyph = isUppercaseLetters ? item.upper : item.lower;
              const keyId = `nasal-${item.baseLower}`;
              const isPressed = pressedKeyId === keyId;
              return (
                <button
                  key={item.lower}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onInsertNasal(glyph, keyId)}
                  aria-label={`Inserir ${glyph} (${item.name})`}
                  title={`${item.name} — ${item.shortcut}`}
                  className={`relative flex flex-col items-center justify-center h-11 sm:h-[52px] rounded-md sm:rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-transform duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] keycap-accent-shadow ${
                    isPressed ? 'keycap-accent-pressed bg-[#1E40AF]' : ''
                  }`}
                >
                  <span className="text-base sm:text-xl font-semibold leading-none">
                    {glyph}
                  </span>
                  <span className="mt-1 text-[10px] font-mono text-white/80 leading-none hidden sm:block">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Standard QWERTY Rows — fluid width on all phone resolutions */}
        <div className="w-full flex flex-col gap-1 sm:gap-2">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-stretch gap-[3px] sm:gap-2">
              {row.map((key) => {
                const isPressed =
                  pressedKeyId === key.id || (key.code && pressedKeyId === key.code);
                const isModifier =
                  key.type === 'backspace' ||
                  key.type === 'enter' ||
                  key.type === 'tab' ||
                  key.type === 'capslock' ||
                  key.type === 'shift' ||
                  key.type === 'arrow-left' ||
                  key.type === 'arrow-right';

                const isActiveToggle =
                  (key.type === 'capslock' && isCaps) ||
                  (key.type === 'shift' && isShift) ||
                  (key.type === 'nasal-lock' && isNasalLock) ||
                  (key.type === 'dead-tilde' && pendingDeadKey === '~') ||
                  (key.type === 'dead-acute' && pendingDeadKey === '´');

                const hasNasalLegend = Boolean(key.nasalAlt);
                const nasalHint = isUppercaseLetters
                  ? key.nasalAltUpper
                  : key.nasalAlt;

                let surfaceClasses =
                  'bg-white hover:bg-[#F8FAFC] text-[#141518] border border-[#D4D7DF] keycap-shadow';

                if (isActiveToggle) {
                  surfaceClasses =
                    'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white border border-[#1E3A8A] keycap-accent-shadow';
                } else if (isModifier) {
                  surfaceClasses =
                    'bg-[#EFF1F5] hover:bg-[#E4E7EE] text-[#334155] border border-[#CFD4DE] keycap-shadow';
                } else if (key.type === 'nasal-lock') {
                  surfaceClasses =
                    'bg-[#EFF1F5] hover:bg-[#E4E7EE] text-[#1E293B] border border-[#CFD4DE] keycap-shadow';
                }

                return (
                  <button
                    key={key.id}
                    type="button"
                    style={{ flexGrow: key.flex ?? 1, flexBasis: 0 }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onKeyPress(key)}
                    aria-pressed={
                      key.type === 'capslock' ||
                      key.type === 'shift' ||
                      key.type === 'nasal-lock'
                        ? isActiveToggle
                        : undefined
                    }
                    aria-label={
                      key.type === 'space'
                        ? 'Espaço'
                        : key.type === 'arrow-left'
                        ? 'Mover cursor para esquerda'
                        : key.type === 'arrow-right'
                        ? 'Mover cursor para direita'
                        : key.label
                    }
                    className={`relative min-w-0 flex items-center justify-center h-11 sm:h-12 md:h-[52px] px-0.5 sm:px-2 rounded-md sm:rounded-lg text-[13px] sm:text-[15px] font-medium transition-transform duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${surfaceClasses} ${
                      isPressed ? 'keycap-pressed' : ''
                    }`}
                  >
                    <span className="truncate leading-none">{renderKeyIcon(key)}</span>

                    {/* Corner nasal legend on desktop/tablet */}
                    {hasNasalLegend && !isNasalLock && (
                      <span
                        aria-hidden="true"
                        className={`hidden sm:block absolute bottom-1 right-1.5 text-[11px] font-mono leading-none ${
                          pendingDeadKey === '~'
                            ? 'text-[#1D4ED8] font-semibold'
                            : 'text-[#64748B]'
                        }`}
                      >
                        {nasalHint}
                      </span>
                    )}

                    {/* Top-left shift symbol on desktop/tablet */}
                    {key.type === 'char' &&
                      key.shiftLabel &&
                      !/^[a-zç]$/i.test(key.label) && (
                        <span
                          aria-hidden="true"
                          className="hidden sm:block absolute top-1 left-1.5 text-[10px] font-mono text-[#94A3B8] leading-none"
                        >
                          {isShift ? key.label : key.shiftLabel}
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
