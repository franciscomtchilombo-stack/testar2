export interface NasalGlyphInfo {
  lower: string;
  upper: string;
  baseLower: string;
  baseUpper: string;
  name: string;
  shortcut: string;
}

export const NASAL_GLYPHS: NasalGlyphInfo[] = [
  {
    lower: 'ã',
    upper: 'Ã',
    baseLower: 'a',
    baseUpper: 'A',
    name: 'A com til',
    shortcut: 'Alt + A',
  },
  {
    lower: 'ẽ',
    upper: 'Ẽ',
    baseLower: 'e',
    baseUpper: 'E',
    name: 'E com til',
    shortcut: 'Alt + E',
  },
  {
    lower: 'ĩ',
    upper: 'Ĩ',
    baseLower: 'i',
    baseUpper: 'I',
    name: 'I com til',
    shortcut: 'Alt + I',
  },
  {
    lower: 'õ',
    upper: 'Õ',
    baseLower: 'o',
    baseUpper: 'O',
    name: 'O com til',
    shortcut: 'Alt + O',
  },
  {
    lower: 'ũ',
    upper: 'Ũ',
    baseLower: 'u',
    baseUpper: 'U',
    name: 'U com til',
    shortcut: 'Alt + U',
  },
  {
    lower: 'ñ',
    upper: 'Ñ',
    baseLower: 'n',
    baseUpper: 'N',
    name: 'N com til',
    shortcut: 'Alt + N',
  },
];

export const TILDE_MAP: Record<string, string> = {
  a: 'ã',
  A: 'Ã',
  e: 'ẽ',
  E: 'Ẽ',
  i: 'ĩ',
  I: 'Ĩ',
  o: 'õ',
  O: 'Õ',
  u: 'ũ',
  U: 'Ũ',
  n: 'ñ',
  N: 'Ñ',
};

export const ACUTE_MAP: Record<string, string> = {
  a: 'á',
  A: 'Á',
  e: 'é',
  E: 'É',
  i: 'í',
  I: 'Í',
  o: 'ó',
  O: 'Ó',
  u: 'ú',
  U: 'Ú',
  y: 'ý',
  Y: 'Ý',
};

export type KeyType =
  | 'char'
  | 'nasal'
  | 'dead-tilde'
  | 'dead-acute'
  | 'backspace'
  | 'enter'
  | 'tab'
  | 'capslock'
  | 'shift'
  | 'space'
  | 'nasal-lock'
  | 'arrow-left'
  | 'arrow-right';

export interface VirtualKey {
  id: string;
  label: string;
  shiftLabel?: string;
  nasalAlt?: string;
  nasalAltUpper?: string;
  type: KeyType;
  code?: string;
  flex?: number;
}

export const KEYBOARD_ROWS: VirtualKey[][] = [
  // Row 1: Numbers & Backspace
  [
    { id: 'Digit1', label: '1', shiftLabel: '!', type: 'char', code: 'Digit1', flex: 1 },
    { id: 'Digit2', label: '2', shiftLabel: '@', type: 'char', code: 'Digit2', flex: 1 },
    { id: 'Digit3', label: '3', shiftLabel: '#', type: 'char', code: 'Digit3', flex: 1 },
    { id: 'Digit4', label: '4', shiftLabel: '$', type: 'char', code: 'Digit4', flex: 1 },
    { id: 'Digit5', label: '5', shiftLabel: '%', type: 'char', code: 'Digit5', flex: 1 },
    { id: 'Digit6', label: '6', shiftLabel: '¨', type: 'char', code: 'Digit6', flex: 1 },
    { id: 'Digit7', label: '7', shiftLabel: '&', type: 'char', code: 'Digit7', flex: 1 },
    { id: 'Digit8', label: '8', shiftLabel: '*', type: 'char', code: 'Digit8', flex: 1 },
    { id: 'Digit9', label: '9', shiftLabel: '(', type: 'char', code: 'Digit9', flex: 1 },
    { id: 'Digit0', label: '0', shiftLabel: ')', type: 'char', code: 'Digit0', flex: 1 },
    { id: 'Minus', label: '-', shiftLabel: '_', type: 'char', code: 'Minus', flex: 1 },
    { id: 'Equal', label: '=', shiftLabel: '+', type: 'char', code: 'Equal', flex: 1 },
    { id: 'Backspace', label: 'Apagar', type: 'backspace', code: 'Backspace', flex: 1.6 },
  ],
  // Row 2: QWERTY
  [
    { id: 'Tab', label: 'Tab', type: 'tab', code: 'Tab', flex: 1.25 },
    { id: 'KeyQ', label: 'q', shiftLabel: 'Q', type: 'char', code: 'KeyQ', flex: 1 },
    { id: 'KeyW', label: 'w', shiftLabel: 'W', type: 'char', code: 'KeyW', flex: 1 },
    { id: 'KeyE', label: 'e', shiftLabel: 'E', nasalAlt: 'ẽ', nasalAltUpper: 'Ẽ', type: 'char', code: 'KeyE', flex: 1 },
    { id: 'KeyR', label: 'r', shiftLabel: 'R', type: 'char', code: 'KeyR', flex: 1 },
    { id: 'KeyT', label: 't', shiftLabel: 'T', type: 'char', code: 'KeyT', flex: 1 },
    { id: 'KeyY', label: 'y', shiftLabel: 'Y', type: 'char', code: 'KeyY', flex: 1 },
    { id: 'KeyU', label: 'u', shiftLabel: 'U', nasalAlt: 'ũ', nasalAltUpper: 'Ũ', type: 'char', code: 'KeyU', flex: 1 },
    { id: 'KeyI', label: 'i', shiftLabel: 'I', nasalAlt: 'ĩ', nasalAltUpper: 'Ĩ', type: 'char', code: 'KeyI', flex: 1 },
    { id: 'KeyO', label: 'o', shiftLabel: 'O', nasalAlt: 'õ', nasalAltUpper: 'Õ', type: 'char', code: 'KeyO', flex: 1 },
    { id: 'KeyP', label: 'p', shiftLabel: 'P', type: 'char', code: 'KeyP', flex: 1 },
    { id: 'Acute', label: '´', shiftLabel: '`', type: 'dead-acute', code: 'BracketLeft', flex: 1 },
    { id: 'Tilde', label: '~', shiftLabel: '^', type: 'dead-tilde', code: 'Quote', flex: 1.2 },
  ],
  // Row 3: ASDF
  [
    { id: 'CapsLock', label: 'Caps', type: 'capslock', code: 'CapsLock', flex: 1.5 },
    { id: 'KeyA', label: 'a', shiftLabel: 'A', nasalAlt: 'ã', nasalAltUpper: 'Ã', type: 'char', code: 'KeyA', flex: 1 },
    { id: 'KeyS', label: 's', shiftLabel: 'S', type: 'char', code: 'KeyS', flex: 1 },
    { id: 'KeyD', label: 'd', shiftLabel: 'D', type: 'char', code: 'KeyD', flex: 1 },
    { id: 'KeyF', label: 'f', shiftLabel: 'F', type: 'char', code: 'KeyF', flex: 1 },
    { id: 'KeyG', label: 'g', shiftLabel: 'G', type: 'char', code: 'KeyG', flex: 1 },
    { id: 'KeyH', label: 'h', shiftLabel: 'H', type: 'char', code: 'KeyH', flex: 1 },
    { id: 'KeyJ', label: 'j', shiftLabel: 'J', type: 'char', code: 'KeyJ', flex: 1 },
    { id: 'KeyK', label: 'k', shiftLabel: 'K', type: 'char', code: 'KeyK', flex: 1 },
    { id: 'KeyL', label: 'l', shiftLabel: 'L', type: 'char', code: 'KeyL', flex: 1 },
    { id: 'Cedilla', label: 'ç', shiftLabel: 'Ç', type: 'char', code: 'Semicolon', flex: 1 },
    { id: 'Enter', label: 'Enter', type: 'enter', code: 'Enter', flex: 1.8 },
  ],
  // Row 4: ZXCV
  [
    { id: 'ShiftLeft', label: 'Shift', type: 'shift', code: 'ShiftLeft', flex: 1.75 },
    { id: 'KeyZ', label: 'z', shiftLabel: 'Z', type: 'char', code: 'KeyZ', flex: 1 },
    { id: 'KeyX', label: 'x', shiftLabel: 'X', type: 'char', code: 'KeyX', flex: 1 },
    { id: 'KeyC', label: 'c', shiftLabel: 'C', type: 'char', code: 'KeyC', flex: 1 },
    { id: 'KeyV', label: 'v', shiftLabel: 'V', type: 'char', code: 'KeyV', flex: 1 },
    { id: 'KeyB', label: 'b', shiftLabel: 'B', type: 'char', code: 'KeyB', flex: 1 },
    { id: 'KeyN', label: 'n', shiftLabel: 'N', nasalAlt: 'ñ', nasalAltUpper: 'Ñ', type: 'char', code: 'KeyN', flex: 1 },
    { id: 'KeyM', label: 'm', shiftLabel: 'M', type: 'char', code: 'KeyM', flex: 1 },
    { id: 'Comma', label: ',', shiftLabel: ';', type: 'char', code: 'Comma', flex: 1 },
    { id: 'Period', label: '.', shiftLabel: ':', type: 'char', code: 'Period', flex: 1 },
    { id: 'Slash', label: '/', shiftLabel: '?', type: 'char', code: 'Slash', flex: 1 },
    { id: 'ShiftRight', label: 'Shift', type: 'shift', code: 'ShiftRight', flex: 1.5 },
  ],
  // Row 5: Bottom row
  [
    { id: 'NasalLock', label: 'Trava Nasal (~)', type: 'nasal-lock', flex: 2.3 },
    { id: 'Space', label: 'Espaço', type: 'space', code: 'Space', flex: 5.5 },
    { id: 'ArrowLeft', label: '←', type: 'arrow-left', code: 'ArrowLeft', flex: 1.1 },
    { id: 'ArrowRight', label: '→', type: 'arrow-right', code: 'ArrowRight', flex: 1.1 },
  ],
];
