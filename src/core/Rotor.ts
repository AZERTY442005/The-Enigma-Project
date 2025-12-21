/**
 * Rotor implementation for the Enigma Machine
 *
 * Each rotor performs a substitution cipher and rotates after each keypress.
 * The rotor has:
 * - A wiring that maps input letters to output letters
 * - A position (Grundstellung) that rotates during operation
 * - A ring setting (Ringstellung) that offsets the wiring
 * - A notch that triggers rotation of the next rotor
 */

import { RotorConfig, RotorWiring } from '../types/index.js';
import {
    ALPHABET,
    ALPHABET_ARRAY,
    ALPHABET_SIZE,
    letterToIndex,
    indexToLetter,
} from './Alphabet.js';

export class Rotor {
    readonly name: string;
    readonly wiring: string;
    readonly notch: string;

    private position: number; // Current position (0-25)
    private ringOffset: number; // Ring setting (0-25)
    private initialPosition: number;
    private initialRingOffset: number;

    /**
     * Create a new Rotor
     * @param config - Rotor configuration with position and ring settings
     * @param wiringData - Rotor wiring specification
     */
    constructor(config: RotorConfig, wiringData: RotorWiring) {
        this.name = config.rotor;
        this.wiring = wiringData.wiring;
        this.notch = wiringData.notch;

        // Convert position letter to 0-based index
        this.position = letterToIndex(config.position);
        this.initialPosition = this.position;

        // Ring offset is 1-based in config, convert to 0-based
        this.ringOffset = config.ringoffset - 1;
        this.initialRingOffset = this.ringOffset;
    }

    /**
     * Pass a signal forward through the rotor (right to left)
     * @param letter - Input letter
     * @returns Output letter after rotor transformation
     */
    forward(letter: string): string {
        const inputIndex = letterToIndex(letter);

        // Apply position offset and ring setting
        const offsetIndex =
            (inputIndex + this.position - this.ringOffset + ALPHABET_SIZE) %
            ALPHABET_SIZE;

        // Get the wired output
        const wiredLetter = this.wiring[offsetIndex];
        const wiredIndex = letterToIndex(wiredLetter);

        // Remove position offset and ring setting
        const outputIndex =
            (wiredIndex - this.position + this.ringOffset + ALPHABET_SIZE) %
            ALPHABET_SIZE;

        return indexToLetter(outputIndex);
    }

    /**
     * Pass a signal backward through the rotor (left to right, after reflector)
     * @param letter - Input letter
     * @returns Output letter after reverse rotor transformation
     */
    backward(letter: string): string {
        const inputIndex = letterToIndex(letter);

        // Apply position offset and ring setting
        const offsetIndex =
            (inputIndex + this.position - this.ringOffset + ALPHABET_SIZE) %
            ALPHABET_SIZE;

        // Find the position in the wiring that maps to this letter
        const targetLetter = indexToLetter(offsetIndex);
        const wiredIndex = this.wiring.indexOf(targetLetter);

        // Remove position offset and ring setting
        const outputIndex =
            (wiredIndex - this.position + this.ringOffset + ALPHABET_SIZE) %
            ALPHABET_SIZE;

        return indexToLetter(outputIndex);
    }

    /**
     * Step the rotor by one position
     * @returns True if the rotor is at its notch position (should trigger next rotor)
     */
    step(): boolean {
        const wasAtNotch = this.isAtNotch();
        this.position = (this.position + 1) % ALPHABET_SIZE;
        return wasAtNotch;
    }

    /**
     * Check if the rotor is currently at its notch position
     * @returns True if at notch
     */
    isAtNotch(): boolean {
        return indexToLetter(this.position) === this.notch;
    }

    /**
     * Get the current position as a letter
     * @returns Current position letter (A-Z)
     */
    getPosition(): string {
        return indexToLetter(this.position);
    }

    /**
     * Get the current position as an index
     * @returns Current position (0-25)
     */
    getPositionIndex(): number {
        return this.position;
    }

    /**
     * Set the rotor position
     * @param position - Position letter (A-Z) or index (0-25)
     */
    setPosition(position: string | number): void {
        if (typeof position === 'string') {
            this.position = letterToIndex(position);
        } else {
            this.position =
                ((position % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
        }
    }

    /**
     * Reset the rotor to its initial configuration
     */
    reset(): void {
        this.position = this.initialPosition;
        this.ringOffset = this.initialRingOffset;
    }

    /**
     * Get rotor state for debugging
     */
    getState(): {
        name: string;
        position: string;
        ringOffset: number;
        notch: string;
    } {
        return {
            name: this.name,
            position: this.getPosition(),
            ringOffset: this.ringOffset + 1, // Convert back to 1-based
            notch: this.notch,
        };
    }
}
