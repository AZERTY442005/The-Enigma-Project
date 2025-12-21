/**
 * Tests for Plugboard class
 */

import { Plugboard } from '../src/core/Plugboard.js';

describe('Plugboard', () => {
    describe('constructor', () => {
        test('creates empty plugboard with no connections', () => {
            const plugboard = new Plugboard();
            expect(plugboard.getPairCount()).toBe(0);
        });

        test('creates plugboard with connection string', () => {
            const plugboard = new Plugboard('AB CD EF');
            expect(plugboard.getPairCount()).toBe(3);
        });

        test('throws error for invalid pair length', () => {
            expect(() => new Plugboard('ABC')).toThrow();
        });

        test('throws error for duplicate connections', () => {
            expect(() => new Plugboard('AB AC')).toThrow();
        });
    });

    describe('swap', () => {
        test('swaps connected letters', () => {
            const plugboard = new Plugboard('AB');
            expect(plugboard.swap('A')).toBe('B');
            expect(plugboard.swap('B')).toBe('A');
        });

        test('returns unconnected letters unchanged', () => {
            const plugboard = new Plugboard('AB');
            expect(plugboard.swap('C')).toBe('C');
            expect(plugboard.swap('Z')).toBe('Z');
        });

        test('handles lowercase input', () => {
            const plugboard = new Plugboard('AB');
            expect(plugboard.swap('a')).toBe('B');
            expect(plugboard.swap('b')).toBe('A');
        });
    });

    describe('getConnections', () => {
        test('returns all connections', () => {
            const plugboard = new Plugboard('AB CD');
            const connections = plugboard.getConnections();
            expect(connections.length).toBe(2);
        });

        test('returns empty array for no connections', () => {
            const plugboard = new Plugboard();
            expect(plugboard.getConnections()).toEqual([]);
        });
    });

    describe('reset', () => {
        test('removes all connections', () => {
            const plugboard = new Plugboard('AB CD');
            expect(plugboard.getPairCount()).toBe(2);
            plugboard.reset();
            expect(plugboard.getPairCount()).toBe(0);
        });
    });

    describe('addConnection', () => {
        test('adds a new connection', () => {
            const plugboard = new Plugboard();
            plugboard.addConnection('A', 'B');
            expect(plugboard.getPairCount()).toBe(1);
            expect(plugboard.swap('A')).toBe('B');
        });

        test('throws error if letter already connected', () => {
            const plugboard = new Plugboard('AB');
            expect(() => plugboard.addConnection('A', 'C')).toThrow();
        });
    });
});
