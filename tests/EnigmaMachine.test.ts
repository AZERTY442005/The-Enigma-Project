/**
 * Tests for EnigmaMachine class
 */

import { EnigmaMachine } from '../src/core/EnigmaMachine.js';
import { EnigmaYamlConfig } from '../src/types/index.js';
import { ROTOR_WIRINGS, REFLECTOR_WIRINGS } from '../src/config/rotorData.js';

describe('EnigmaMachine', () => {
    const createConfig = (
        overrides: Partial<EnigmaYamlConfig> = {},
    ): EnigmaYamlConfig => ({
        plugboard: { connections: '' },
        rotors: [
            { rotor: 'I', position: 'A', ringoffset: 1 },
            { rotor: 'II', position: 'A', ringoffset: 1 },
            { rotor: 'III', position: 'A', ringoffset: 1 },
        ],
        reflector: { type: 'B' },
        debug: false,
        message: null,
        etw: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        rotorswiring: ROTOR_WIRINGS,
        reflectorswiring: REFLECTOR_WIRINGS,
        ...overrides,
    });

    describe('constructor', () => {
        test('creates machine with valid config', () => {
            const config = createConfig();
            const machine = new EnigmaMachine(config);
            expect(machine).toBeDefined();
        });

        test('throws error for invalid rotor type', () => {
            const config = createConfig({
                rotors: [
                    { rotor: 'INVALID', position: 'A', ringoffset: 1 },
                    { rotor: 'II', position: 'A', ringoffset: 1 },
                    { rotor: 'III', position: 'A', ringoffset: 1 },
                ],
            });
            expect(() => new EnigmaMachine(config)).toThrow();
        });

        test('throws error for invalid reflector type', () => {
            const config = createConfig({
                reflector: { type: 'INVALID' },
            });
            expect(() => new EnigmaMachine(config)).toThrow();
        });
    });

    describe('encrypt', () => {
        test('encrypts single letter', () => {
            const machine = new EnigmaMachine(createConfig());
            const result = machine.encrypt('A');
            expect(result.length).toBe(1);
            expect(result).not.toBe('A'); // Enigma never encrypts a letter to itself
        });

        test('encrypts message', () => {
            const machine = new EnigmaMachine(createConfig());
            const result = machine.encrypt('HELLO');
            expect(result.length).toBe(5);
        });

        test('skips non-letter characters', () => {
            const machine = new EnigmaMachine(createConfig());
            const result = machine.encrypt('HE LLO 123');
            expect(result.length).toBe(5); // Only letters are processed
        });

        test('handles lowercase input', () => {
            const machine = new EnigmaMachine(createConfig());
            const result = machine.encrypt('hello');
            expect(result.length).toBe(5);
        });
    });

    describe('symmetry', () => {
        test('encrypting twice returns original (with reset)', () => {
            const config = createConfig();
            const machine = new EnigmaMachine(config);

            const original = 'HELLO';
            const encrypted = machine.encrypt(original);

            // Reset and encrypt the encrypted message
            machine.reset();
            const decrypted = machine.encrypt(encrypted);

            expect(decrypted).toBe(original);
        });

        test('same message with same settings produces same output', () => {
            const config = createConfig();

            const machine1 = new EnigmaMachine(config);
            const machine2 = new EnigmaMachine(config);

            const result1 = machine1.encrypt('HELLO');
            const result2 = machine2.encrypt('HELLO');

            expect(result1).toBe(result2);
        });
    });

    describe('plugboard', () => {
        test('plugboard affects encryption', () => {
            const configNoPlug = createConfig();
            const configWithPlug = createConfig({
                plugboard: { connections: 'AB' },
            });

            const machine1 = new EnigmaMachine(configNoPlug);
            const machine2 = new EnigmaMachine(configWithPlug);

            const result1 = machine1.encrypt('A');
            const result2 = machine2.encrypt('A');

            // Results should differ due to plugboard
            expect(result1).not.toBe(result2);
        });
    });

    describe('getRotorPositions', () => {
        test('returns initial positions', () => {
            const config = createConfig({
                rotors: [
                    { rotor: 'I', position: 'X', ringoffset: 1 },
                    { rotor: 'II', position: 'Y', ringoffset: 1 },
                    { rotor: 'III', position: 'Z', ringoffset: 1 },
                ],
            });
            const machine = new EnigmaMachine(config);

            // After construction, positions should be initial (before any keypress)
            const positions = machine.getRotorPositions();
            expect(positions).toBe('XYZ');
        });

        test('positions change after encryption', () => {
            const config = createConfig();
            const machine = new EnigmaMachine(config);

            const initialPositions = machine.getRotorPositions();
            machine.encrypt('A');
            const afterPositions = machine.getRotorPositions();

            expect(afterPositions).not.toBe(initialPositions);
        });
    });

    describe('reset', () => {
        test('resets rotor positions', () => {
            const config = createConfig();
            const machine = new EnigmaMachine(config);

            const initial = machine.getRotorPositions();
            machine.encrypt('AAAA');
            const after = machine.getRotorPositions();

            expect(after).not.toBe(initial);

            machine.reset();
            const reset = machine.getRotorPositions();

            expect(reset).toBe(initial);
        });
    });

    describe('no self-encryption', () => {
        test('no letter encrypts to itself', () => {
            const machine = new EnigmaMachine(createConfig());

            // Test multiple letters
            for (const letter of 'ABCDEFGHIJ') {
                const result = machine.encrypt(letter);
                expect(result).not.toBe(letter);
                machine.reset();
            }
        });
    });
});
