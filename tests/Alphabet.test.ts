/**
 * Tests for Alphabet utilities
 */

import {
    ALPHABET,
    ALPHABET_ARRAY,
    ALPHABET_SIZE,
    letterToIndex,
    indexToLetter,
    shiftLetter,
    isValidLetter,
} from '../src/core/Alphabet.js';

describe('Alphabet', () => {
    describe('constants', () => {
        test('ALPHABET has 26 letters', () => {
            expect(ALPHABET.length).toBe(26);
            expect(ALPHABET).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        });

        test('ALPHABET_ARRAY has 26 elements', () => {
            expect(ALPHABET_ARRAY.length).toBe(26);
            expect(ALPHABET_ARRAY[0]).toBe('A');
            expect(ALPHABET_ARRAY[25]).toBe('Z');
        });

        test('ALPHABET_SIZE is 26', () => {
            expect(ALPHABET_SIZE).toBe(26);
        });
    });

    describe('letterToIndex', () => {
        test('converts A to 0', () => {
            expect(letterToIndex('A')).toBe(0);
        });

        test('converts Z to 25', () => {
            expect(letterToIndex('Z')).toBe(25);
        });

        test('converts M to 12', () => {
            expect(letterToIndex('M')).toBe(12);
        });

        test('handles lowercase', () => {
            expect(letterToIndex('a')).toBe(0);
            expect(letterToIndex('z')).toBe(25);
        });

        test('returns -1 for invalid characters', () => {
            expect(letterToIndex('1')).toBe(-1);
            expect(letterToIndex(' ')).toBe(-1);
        });
    });

    describe('indexToLetter', () => {
        test('converts 0 to A', () => {
            expect(indexToLetter(0)).toBe('A');
        });

        test('converts 25 to Z', () => {
            expect(indexToLetter(25)).toBe('Z');
        });

        test('wraps around for values > 25', () => {
            expect(indexToLetter(26)).toBe('A');
            expect(indexToLetter(27)).toBe('B');
        });

        test('handles negative values', () => {
            expect(indexToLetter(-1)).toBe('Z');
            expect(indexToLetter(-2)).toBe('Y');
        });
    });

    describe('shiftLetter', () => {
        test('shifts A by 1 to B', () => {
            expect(shiftLetter('A', 1)).toBe('B');
        });

        test('shifts Z by 1 to A (wrap around)', () => {
            expect(shiftLetter('Z', 1)).toBe('A');
        });

        test('shifts A by -1 to Z (wrap around)', () => {
            expect(shiftLetter('A', -1)).toBe('Z');
        });

        test('shift by 0 returns same letter', () => {
            expect(shiftLetter('M', 0)).toBe('M');
        });

        test('returns non-letters unchanged', () => {
            expect(shiftLetter('1', 5)).toBe('1');
        });
    });

    describe('isValidLetter', () => {
        test('returns true for uppercase letters', () => {
            expect(isValidLetter('A')).toBe(true);
            expect(isValidLetter('Z')).toBe(true);
            expect(isValidLetter('M')).toBe(true);
        });

        test('returns true for lowercase letters', () => {
            expect(isValidLetter('a')).toBe(true);
            expect(isValidLetter('z')).toBe(true);
        });

        test('returns false for non-letters', () => {
            expect(isValidLetter('1')).toBe(false);
            expect(isValidLetter(' ')).toBe(false);
            expect(isValidLetter('!')).toBe(false);
        });
    });
});
