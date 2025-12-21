/**
 * Enigma Machine - Main encryption/decryption engine
 *
 * This class simulates the Enigma I cipher machine used by the German
 * military during World War II. The encryption process follows the
 * physical path of an electrical signal through the machine:
 *
 * Keyboard → Plugboard → ETW → Rotors (R→L) → Reflector → Rotors (L→R) → ETW → Plugboard → Lampboard
 */

import { EnigmaYamlConfig } from '../types/index.js';
import {
    ALPHABET_SIZE,
    letterToIndex,
    indexToLetter,
    isValidLetter,
} from './Alphabet.js';
import { Plugboard } from './Plugboard.js';
import { Reflector } from './Reflector.js';
import { Logger } from '../utils/Logger.js';
import { ConfigLoader } from '../config/ConfigLoader.js';

interface RotorState {
    name: string;
    wiring: string;
    notch: string;
    position: number;
    ringSetting: number;
}

export class EnigmaMachine {
    private plugboard: Plugboard;
    private rotors: RotorState[]; // Index 0 = left (slow), 2 = right (fast)
    private reflector: Reflector;
    private logger: Logger;
    private initialPositions: number[];

    /**
     * Create an Enigma Machine from configuration
     * @param config - Complete machine configuration
     */
    constructor(config: EnigmaYamlConfig) {
        this.logger = new Logger(config.debug);

        // Initialize plugboard
        this.plugboard = new Plugboard(config.plugboard?.connections ?? '');

        // Initialize rotors (left to right in the machine)
        this.rotors = config.rotors.map((rotorConfig) => {
            const wiring = ConfigLoader.findRotorWiring(
                config,
                rotorConfig.rotor,
            );
            if (!wiring) {
                throw new Error(`Unknown rotor type: ${rotorConfig.rotor}`);
            }
            return {
                name: rotorConfig.rotor,
                wiring: wiring.wiring,
                notch: wiring.notch,
                position: letterToIndex(rotorConfig.position),
                ringSetting: rotorConfig.ringoffset - 1, // Convert to 0-based
            };
        });

        this.initialPositions = this.rotors.map((r) => r.position);

        // Initialize reflector
        const reflectorWiring = ConfigLoader.findReflectorWiring(
            config,
            config.reflector.type,
        );
        if (!reflectorWiring) {
            throw new Error(`Unknown reflector type: ${config.reflector.type}`);
        }
        this.reflector = new Reflector(reflectorWiring);

        this.logger.log('Enigma Machine initialized');
        this.logger.log(
            'Rotors:',
            this.rotors.map((r) => ({
                name: r.name,
                pos: indexToLetter(r.position),
                ring: r.ringSetting + 1,
            })),
        );
        this.logger.log('Reflector:', this.reflector.getInfo());
        this.logger.log(
            'Plugboard connections:',
            this.plugboard.getPairCount(),
        );
    }

    /**
     * Encrypt (or decrypt) a message
     */
    encrypt(message: string): string {
        let result = '';

        for (const char of message.toUpperCase()) {
            if (!isValidLetter(char)) {
                continue;
            }
            result += this.encryptLetter(char);
        }

        return result;
    }

    /**
     * Encrypt a single letter using the correct Enigma algorithm
     */
    encryptLetter(letter: string): string {
        this.logger.group(`Encrypting: ${letter}`);

        // Step 1: Advance rotors BEFORE encryption
        this.stepRotors();
        this.logger.log(
            'Rotor positions:',
            this.rotors.map((r) => indexToLetter(r.position)).join(''),
        );

        // Step 2: Plugboard (first pass)
        let current = this.plugboard.swap(letter);
        this.logger.log('After plugboard:', current);

        // Step 3: Convert to index for rotor processing
        let index = letterToIndex(current);

        // Step 4: ETW (Entry wheel) - identity in Enigma I
        // No transformation needed

        // Step 5: Pass through rotors right to left (fast to slow: index 2, 1, 0)
        for (let i = 2; i >= 0; i--) {
            index = this.rotorForward(i, index);
            this.logger.log(
                `After rotor ${this.rotors[i].name} forward:`,
                indexToLetter(index),
            );
        }

        // Step 6: Reflector
        current = this.reflector.reflect(indexToLetter(index));
        index = letterToIndex(current);
        this.logger.log('After reflector:', current);

        // Step 7: Pass through rotors left to right (slow to fast: index 0, 1, 2)
        for (let i = 0; i <= 2; i++) {
            index = this.rotorBackward(i, index);
            this.logger.log(
                `After rotor ${this.rotors[i].name} backward:`,
                indexToLetter(index),
            );
        }

        // Step 8: ETW (Exit) - identity in Enigma I
        current = indexToLetter(index);

        // Step 9: Plugboard (second pass)
        current = this.plugboard.swap(current);
        this.logger.log('After plugboard (final):', current);

        this.logger.separator();
        return current;
    }

    /**
     * Pass signal forward through a rotor (right to left direction)
     * The signal enters at the right side of the rotor and exits at the left
     */
    private rotorForward(rotorIndex: number, inputIndex: number): number {
        const rotor = this.rotors[rotorIndex];

        // Apply the offset: shift by (position - ringSetting)
        // This simulates the mechanical rotation of the rotor
        const offset = rotor.position - rotor.ringSetting;
        const shiftedInput =
            (inputIndex + offset + ALPHABET_SIZE) % ALPHABET_SIZE;

        // Look up the wiring
        const wiredLetter = rotor.wiring[shiftedInput];
        const wiredIndex = letterToIndex(wiredLetter);

        // Remove the offset
        const output = (wiredIndex - offset + ALPHABET_SIZE) % ALPHABET_SIZE;

        return output;
    }

    /**
     * Pass signal backward through a rotor (left to right direction, after reflector)
     * The signal enters at the left side of the rotor and exits at the right
     */
    private rotorBackward(rotorIndex: number, inputIndex: number): number {
        const rotor = this.rotors[rotorIndex];

        // Apply the offset
        const offset = rotor.position - rotor.ringSetting;
        const shiftedInput =
            (inputIndex + offset + ALPHABET_SIZE) % ALPHABET_SIZE;

        // Find the reverse mapping: which position in wiring gives this letter?
        const targetLetter = indexToLetter(shiftedInput);
        const wiredIndex = rotor.wiring.indexOf(targetLetter);

        // Remove the offset
        const output = (wiredIndex - offset + ALPHABET_SIZE) % ALPHABET_SIZE;

        return output;
    }

    /**
     * Step the rotors according to the double-stepping mechanism
     */
    private stepRotors(): void {
        const rightRotor = this.rotors[2];
        const middleRotor = this.rotors[1];
        const leftRotor = this.rotors[0];

        // Check notch positions BEFORE stepping
        const middleAtNotch =
            indexToLetter(middleRotor.position) === middleRotor.notch;
        const rightAtNotch =
            indexToLetter(rightRotor.position) === rightRotor.notch;

        // Left rotor steps if middle rotor is at notch
        if (middleAtNotch) {
            leftRotor.position = (leftRotor.position + 1) % ALPHABET_SIZE;
        }

        // Middle rotor steps if right rotor is at notch OR if middle is at notch (double-step)
        if (rightAtNotch || middleAtNotch) {
            middleRotor.position = (middleRotor.position + 1) % ALPHABET_SIZE;
        }

        // Right rotor always steps
        rightRotor.position = (rightRotor.position + 1) % ALPHABET_SIZE;
    }

    /**
     * Get current rotor positions
     */
    getRotorPositions(): string {
        return this.rotors.map((r) => indexToLetter(r.position)).join('');
    }

    /**
     * Reset all rotors to their initial positions
     */
    reset(): void {
        for (let i = 0; i < this.rotors.length; i++) {
            this.rotors[i].position = this.initialPositions[i];
        }
    }

    /**
     * Get machine state for debugging
     */
    getState(): {
        rotors: Array<{
            name: string;
            position: string;
            ringOffset: number;
            notch: string;
        }>;
        reflector: { name: string; wiring: string };
        plugboardPairs: number;
    } {
        return {
            rotors: this.rotors.map((r) => ({
                name: r.name,
                position: indexToLetter(r.position),
                ringOffset: r.ringSetting + 1,
                notch: r.notch,
            })),
            reflector: this.reflector.getInfo(),
            plugboardPairs: this.plugboard.getPairCount(),
        };
    }
}
