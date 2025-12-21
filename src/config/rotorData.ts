/**
 * Historical Enigma I rotor and reflector wiring data
 *
 * These are the actual wirings used in the Enigma I machine (1930)
 * as used by the German military.
 */

import { RotorWiring, ReflectorWiring } from '../types/index.js';

/**
 * Standard Enigma I rotors (I through V)
 * Each rotor has a unique wiring and notch position
 */
export const ROTOR_WIRINGS: RotorWiring[] = [
    {
        rotor: 'I',
        wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        notch: 'Q', // Turnover at Q (when R is showing)
    },
    {
        rotor: 'II',
        wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE',
        notch: 'E', // Turnover at E (when F is showing)
    },
    {
        rotor: 'III',
        wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO',
        notch: 'V', // Turnover at V (when W is showing)
    },
    {
        rotor: 'IV',
        wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB',
        notch: 'J', // Turnover at J (when K is showing)
    },
    {
        rotor: 'V',
        wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK',
        notch: 'Z', // Turnover at Z (when A is showing)
    },
];

/**
 * Standard Enigma I reflectors (A, B, C)
 */
export const REFLECTOR_WIRINGS: ReflectorWiring[] = [
    {
        reflector: 'A',
        wiring: 'EJMZALYXVBWFCRQUONTSPIKHGD',
    },
    {
        reflector: 'B',
        wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    },
    {
        reflector: 'C',
        wiring: 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
    },
];

/**
 * Get rotor wiring by name
 * @param name - Rotor name (I, II, III, IV, V)
 * @returns Rotor wiring or undefined if not found
 */
export function getRotorWiring(name: string): RotorWiring | undefined {
    return ROTOR_WIRINGS.find((r) => r.rotor === name);
}

/**
 * Get reflector wiring by name
 * @param name - Reflector name (A, B, C)
 * @returns Reflector wiring or undefined if not found
 */
export function getReflectorWiring(name: string): ReflectorWiring | undefined {
    return REFLECTOR_WIRINGS.find((r) => r.reflector === name);
}

/**
 * Keywords commonly found in encrypted messages (for cracking)
 */
export const COMMON_KEYWORDS: string[] = [
    'ENIGMA',
    'BLETCHLEY',
    'TURING',
    'SECRET',
    'MESSAGE',
    'ATTACK',
    'DEFENSE',
    'WEATHER',
    'REPORT',
    'COMMAND',
    'ARMY',
    'NAVY',
    'MISSION',
    'SIGNAL',
    'INTELLIGENCE',
];
