/**
 * Enigma Cracker - Brute force decryption tool
 *
 * Attempts to crack Enigma-encrypted messages by trying various
 * combinations of rotors, positions, and ring settings, then
 * checking for known keywords in the decrypted output.
 */

import {
    RotorConfig,
    CrackerResult,
    EnigmaYamlConfig,
} from '../types/index.js';
import { EnigmaMachine } from '../core/EnigmaMachine.js';
import {
    ROTOR_WIRINGS,
    REFLECTOR_WIRINGS,
    COMMON_KEYWORDS,
} from '../config/rotorData.js';
import { ALPHABET } from '../core/Alphabet.js';

export class EnigmaCracker {
    private keywords: string[];
    private reflectorTypes: string[];

    /**
     * Create an Enigma Cracker
     * @param keywords - Keywords to search for in decrypted messages
     */
    constructor(keywords: string[] = COMMON_KEYWORDS) {
        this.keywords = keywords.map((k) => k.toUpperCase());
        this.reflectorTypes = REFLECTOR_WIRINGS.map((r) => r.reflector);
    }

    /**
     * Generate all possible rotor configurations (without plugboard)
     * This is a generator to avoid memory issues with the large number of combinations
     */
    *generateRotorCombinations(): Generator<{
        rotors: RotorConfig[];
        reflector: string;
    }> {
        const rotorNames = ROTOR_WIRINGS.map((r) => r.rotor);

        // Generate all permutations of 3 rotors from 5
        for (let i = 0; i < rotorNames.length; i++) {
            for (let j = 0; j < rotorNames.length; j++) {
                if (j === i) continue;
                for (let k = 0; k < rotorNames.length; k++) {
                    if (k === i || k === j) continue;

                    // Generate all positions (26^3 = 17,576)
                    for (const pos1 of ALPHABET) {
                        for (const pos2 of ALPHABET) {
                            for (const pos3 of ALPHABET) {
                                // For now, skip ring settings to reduce combinations
                                // (adding ring settings would multiply by 26^2 = 676)

                                // Try each reflector
                                for (const reflector of this.reflectorTypes) {
                                    yield {
                                        rotors: [
                                            {
                                                rotor: rotorNames[i],
                                                position: pos1,
                                                ringoffset: 1,
                                            },
                                            {
                                                rotor: rotorNames[j],
                                                position: pos2,
                                                ringoffset: 1,
                                            },
                                            {
                                                rotor: rotorNames[k],
                                                position: pos3,
                                                ringoffset: 1,
                                            },
                                        ],
                                        reflector,
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Count total combinations (for progress reporting)
     */
    getTotalCombinations(): number {
        // 5P3 * 26^3 * 3 reflectors = 60 * 17576 * 3 = 3,163,680
        return 60 * 17576 * 3;
    }

    /**
     * Attempt to crack an encrypted message
     * @param ciphertext - Encrypted message to crack
     * @param maxResults - Maximum number of results to return
     * @param progressCallback - Optional callback for progress updates
     */
    crack(
        ciphertext: string,
        maxResults: number = 10,
        progressCallback?: (tried: number, total: number) => void,
    ): CrackerResult[] {
        const results: CrackerResult[] = [];
        const total = this.getTotalCombinations();
        let tried = 0;

        for (const combination of this.generateRotorCombinations()) {
            tried++;

            if (progressCallback && tried % 100000 === 0) {
                progressCallback(tried, total);
            }

            // Create machine configuration
            const config: EnigmaYamlConfig = {
                plugboard: { connections: '' },
                rotors: combination.rotors,
                reflector: { type: combination.reflector },
                debug: false,
                message: null,
                etw: ALPHABET,
                rotorswiring: ROTOR_WIRINGS,
                reflectorswiring: REFLECTOR_WIRINGS,
            };

            try {
                const machine = new EnigmaMachine(config);
                const decrypted = machine.encrypt(ciphertext);

                // Check for keywords
                const matchedKeywords = this.findKeywords(decrypted);

                if (matchedKeywords.length > 0) {
                    results.push({
                        rotors: combination.rotors,
                        reflector: combination.reflector,
                        decrypted,
                        matchedKeywords,
                    });

                    if (results.length >= maxResults) {
                        break;
                    }
                }
            } catch {
                // Skip invalid configurations
                continue;
            }
        }

        return results;
    }

    /**
     * Find keywords in a decrypted message
     * @param text - Text to search
     * @returns Array of found keywords
     */
    private findKeywords(text: string): string[] {
        return this.keywords.filter((keyword) => text.includes(keyword));
    }

    /**
     * Add custom keywords to search for
     * @param keywords - Keywords to add
     */
    addKeywords(keywords: string[]): void {
        this.keywords.push(...keywords.map((k) => k.toUpperCase()));
    }

    /**
     * Set custom keywords (replaces existing)
     * @param keywords - New keywords
     */
    setKeywords(keywords: string[]): void {
        this.keywords = keywords.map((k) => k.toUpperCase());
    }
}
