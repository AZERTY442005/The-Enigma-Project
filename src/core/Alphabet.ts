/**
 * Alphabet utilities for the Enigma Machine
 * Provides constants and helper functions for letter manipulation
 */

/** Standard 26-letter uppercase alphabet */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Alphabet as an array of characters */
export const ALPHABET_ARRAY = ALPHABET.split('');

/** Number of letters in the alphabet */
export const ALPHABET_SIZE = 26;

/**
 * Convert a letter to its 0-based index (A=0, B=1, ..., Z=25)
 * @param letter - Uppercase letter A-Z
 * @returns Index 0-25, or -1 if not a valid letter
 */
export function letterToIndex(letter: string): number {
    return ALPHABET.indexOf(letter.toUpperCase());
}

/**
 * Convert a 0-based index to a letter (0=A, 1=B, ..., 25=Z)
 * @param index - Index 0-25
 * @returns Uppercase letter A-Z
 */
export function indexToLetter(index: number): string {
    // Handle negative indices and wrap around
    const normalizedIndex =
        ((index % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE;
    return ALPHABET[normalizedIndex];
}

/**
 * Shift a letter by an offset amount with wrap-around
 * @param letter - Uppercase letter A-Z
 * @param offset - Number of positions to shift (can be negative)
 * @returns Shifted letter
 */
export function shiftLetter(letter: string, offset: number): string {
    const index = letterToIndex(letter);
    if (index === -1) {
        return letter; // Return unchanged if not a valid letter
    }
    return indexToLetter(index + offset);
}

/**
 * Check if a character is a valid alphabet letter
 * @param char - Character to check
 * @returns True if the character is A-Z
 */
export function isValidLetter(char: string): boolean {
    return ALPHABET.includes(char.toUpperCase());
}
