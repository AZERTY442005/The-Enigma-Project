/**
 * Tests for Reflector class
 */

import { Reflector } from '../src/core/Reflector.js';
import { ReflectorWiring } from '../src/types/index.js';

describe('Reflector', () => {
    // Reflector B wiring
    const reflectorWiring: ReflectorWiring = {
        reflector: 'B',
        wiring: 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
    };

    describe('constructor', () => {
        test('creates reflector with correct name', () => {
            const reflector = new Reflector(reflectorWiring);
            expect(reflector.name).toBe('B');
        });

        test('creates reflector with correct wiring', () => {
            const reflector = new Reflector(reflectorWiring);
            expect(reflector.wiring).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT');
        });
    });

    describe('reflect', () => {
        test('reflects A to Y', () => {
            const reflector = new Reflector(reflectorWiring);
            expect(reflector.reflect('A')).toBe('Y');
        });

        test('reflects Y to A (symmetric)', () => {
            const reflector = new Reflector(reflectorWiring);
            expect(reflector.reflect('Y')).toBe('A');
        });

        test('handles lowercase input', () => {
            const reflector = new Reflector(reflectorWiring);
            expect(reflector.reflect('a')).toBe('Y');
        });

        test('no letter reflects to itself', () => {
            const reflector = new Reflector(reflectorWiring);
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode('A'.charCodeAt(0) + i);
                expect(reflector.reflect(letter)).not.toBe(letter);
            }
        });
    });

    describe('getInfo', () => {
        test('returns correct info object', () => {
            const reflector = new Reflector(reflectorWiring);
            const info = reflector.getInfo();
            expect(info.name).toBe('B');
            expect(info.wiring).toBe('YRUHQSLDPXNGOKMIEBFZCWVJAT');
        });
    });
});
