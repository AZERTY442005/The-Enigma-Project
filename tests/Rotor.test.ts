/**
 * Tests for Rotor class
 */

import { Rotor } from '../src/core/Rotor.js';
import { RotorConfig, RotorWiring } from '../src/types/index.js';

describe('Rotor', () => {
    // Test rotor wiring (Rotor I)
    const rotorWiring: RotorWiring = {
        rotor: 'I',
        wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ',
        notch: 'Q',
    };

    const defaultConfig: RotorConfig = {
        rotor: 'I',
        position: 'A',
        ringoffset: 1,
    };

    describe('constructor', () => {
        test('creates rotor with correct name', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            expect(rotor.name).toBe('I');
        });

        test('creates rotor with correct wiring', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            expect(rotor.wiring).toBe('EKMFLGDQVZNTOWYHXUSPAIBRCJ');
        });

        test('creates rotor with correct notch', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            expect(rotor.notch).toBe('Q');
        });
    });

    describe('getPosition', () => {
        test('returns initial position', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            expect(rotor.getPosition()).toBe('A');
        });

        test('returns set position', () => {
            const config = { ...defaultConfig, position: 'M' };
            const rotor = new Rotor(config, rotorWiring);
            expect(rotor.getPosition()).toBe('M');
        });
    });

    describe('step', () => {
        test('advances position by 1', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            rotor.step();
            expect(rotor.getPosition()).toBe('B');
        });

        test('wraps from Z to A', () => {
            const config = { ...defaultConfig, position: 'Z' };
            const rotor = new Rotor(config, rotorWiring);
            rotor.step();
            expect(rotor.getPosition()).toBe('A');
        });

        test('returns true when at notch', () => {
            const config = { ...defaultConfig, position: 'Q' };
            const rotor = new Rotor(config, rotorWiring);
            const wasAtNotch = rotor.step();
            expect(wasAtNotch).toBe(true);
        });

        test('returns false when not at notch', () => {
            const config = { ...defaultConfig, position: 'A' };
            const rotor = new Rotor(config, rotorWiring);
            const wasAtNotch = rotor.step();
            expect(wasAtNotch).toBe(false);
        });
    });

    describe('isAtNotch', () => {
        test('returns true when at notch position', () => {
            const config = { ...defaultConfig, position: 'Q' };
            const rotor = new Rotor(config, rotorWiring);
            expect(rotor.isAtNotch()).toBe(true);
        });

        test('returns false when not at notch', () => {
            const config = { ...defaultConfig, position: 'A' };
            const rotor = new Rotor(config, rotorWiring);
            expect(rotor.isAtNotch()).toBe(false);
        });
    });

    describe('setPosition', () => {
        test('sets position by letter', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            rotor.setPosition('M');
            expect(rotor.getPosition()).toBe('M');
        });

        test('sets position by index', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            rotor.setPosition(12);
            expect(rotor.getPosition()).toBe('M');
        });
    });

    describe('reset', () => {
        test('resets to initial position', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            rotor.step();
            rotor.step();
            expect(rotor.getPosition()).not.toBe('A');
            rotor.reset();
            expect(rotor.getPosition()).toBe('A');
        });
    });

    describe('forward and backward', () => {
        test('forward transforms letter', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            // With position A and ring 1, A should map to E (first letter of wiring)
            const result = rotor.forward('A');
            expect(result).toBe('E');
        });

        test('backward is inverse of forward', () => {
            const rotor = new Rotor(defaultConfig, rotorWiring);
            const forward = rotor.forward('A');
            const backward = rotor.backward(forward);
            expect(backward).toBe('A');
        });
    });

    describe('getState', () => {
        test('returns correct state object', () => {
            const config = { ...defaultConfig, position: 'B', ringoffset: 3 };
            const rotor = new Rotor(config, rotorWiring);
            const state = rotor.getState();
            expect(state.name).toBe('I');
            expect(state.position).toBe('B');
            expect(state.ringOffset).toBe(3);
            expect(state.notch).toBe('Q');
        });
    });
});
