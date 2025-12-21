/**
 * Plugboard (Steckerbrett) implementation for the Enigma Machine
 *
 * The plugboard swaps pairs of letters before and after the rotor encryption.
 * Up to 13 pairs can be connected, with each connection swapping two letters.
 */

import { PlugboardConnection } from '../types/index.js';

export class Plugboard {
    private connections: Map<string, string>;

    /**
     * Create a new Plugboard with optional connections
     * @param connectionString - Space-separated letter pairs, e.g., "AB CD EF"
     */
    constructor(connectionString: string = '') {
        this.connections = new Map();
        this.parseConnections(connectionString);
    }

    /**
     * Parse a connection string and set up bidirectional mappings
     * @param connectionString - Space-separated letter pairs
     */
    private parseConnections(connectionString: string): void {
        if (!connectionString || connectionString.trim() === '') {
            return;
        }

        const pairs = connectionString.trim().split(' ');

        for (const pair of pairs) {
            if (pair.length !== 2) {
                throw new Error(
                    `Invalid plugboard pair: "${pair}". Each pair must be exactly 2 letters.`,
                );
            }

            const [first, second] = pair.toUpperCase().split('');

            // Check for duplicate connections
            if (this.connections.has(first) || this.connections.has(second)) {
                throw new Error(
                    `Duplicate plugboard connection detected for letter in pair: "${pair}"`,
                );
            }

            // Create bidirectional mapping
            this.connections.set(first, second);
            this.connections.set(second, first);
        }
    }

    /**
     * Swap a letter through the plugboard
     * If the letter is connected, returns its pair; otherwise returns the letter unchanged
     * @param letter - Uppercase letter to swap
     * @returns The swapped letter or the original if not connected
     */
    swap(letter: string): string {
        const upperLetter = letter.toUpperCase();
        return this.connections.get(upperLetter) ?? upperLetter;
    }

    /**
     * Get all current connections as an array
     * @returns Array of plugboard connections
     */
    getConnections(): PlugboardConnection[] {
        const connections: PlugboardConnection[] = [];
        const seen = new Set<string>();

        for (const [input, output] of this.connections) {
            // Only add each pair once
            if (!seen.has(input) && !seen.has(output)) {
                connections.push({ input, output });
                seen.add(input);
                seen.add(output);
            }
        }

        return connections;
    }

    /**
     * Get the number of connected pairs
     * @returns Number of letter pairs connected
     */
    getPairCount(): number {
        return this.connections.size / 2;
    }

    /**
     * Reset the plugboard, removing all connections
     */
    reset(): void {
        this.connections.clear();
    }

    /**
     * Add a new connection pair
     * @param first - First letter
     * @param second - Second letter
     */
    addConnection(first: string, second: string): void {
        const upperFirst = first.toUpperCase();
        const upperSecond = second.toUpperCase();

        if (
            this.connections.has(upperFirst) ||
            this.connections.has(upperSecond)
        ) {
            throw new Error(
                `Cannot add connection: one or both letters already connected`,
            );
        }

        this.connections.set(upperFirst, upperSecond);
        this.connections.set(upperSecond, upperFirst);
    }
}
