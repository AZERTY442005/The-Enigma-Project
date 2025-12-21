/**
 * Reflector (Umkehrwalze) implementation for the Enigma Machine
 *
 * The reflector is a fixed component that bounces the signal back through
 * the rotors. It performs a fixed letter substitution where each letter
 * maps to exactly one other letter (A→Y means Y→A).
 */

import { ReflectorWiring } from '../types/index.js';
import { ALPHABET, letterToIndex } from './Alphabet.js';

export class Reflector {
    readonly name: string;
    readonly wiring: string;

    /**
     * Create a new Reflector
     * @param wiringData - Reflector wiring specification
     */
    constructor(wiringData: ReflectorWiring) {
        this.name = wiringData.reflector;
        this.wiring = wiringData.wiring;
    }

    /**
     * Reflect a letter through the reflector
     * @param letter - Input letter
     * @returns Reflected output letter
     */
    reflect(letter: string): string {
        const index = letterToIndex(letter.toUpperCase());
        return this.wiring[index];
    }

    /**
     * Get reflector info for debugging
     */
    getInfo(): { name: string; wiring: string } {
        return {
            name: this.name,
            wiring: this.wiring,
        };
    }
}
