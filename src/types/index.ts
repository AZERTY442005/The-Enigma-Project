/**
 * TypeScript type definitions for the Enigma Machine
 */

/**
 * Configuration for a single rotor in the machine
 */
export interface RotorConfig {
    /** Rotor identifier (I, II, III, IV, V) */
    rotor: string;
    /** Initial position (A-Z) */
    position: string;
    /** Ring offset (1-26) */
    ringoffset: number;
}

/**
 * Rotor wiring specification
 */
export interface RotorWiring {
    /** Rotor identifier */
    rotor: string;
    /** 26-character wiring string */
    wiring: string;
    /** Notch position (letter that triggers next rotor) */
    notch: string;
}

/**
 * Reflector wiring specification
 */
export interface ReflectorWiring {
    /** Reflector identifier (A, B, C) */
    reflector: string;
    /** 26-character wiring string */
    wiring: string;
}

/**
 * Plugboard connection pair
 */
export interface PlugboardConnection {
    input: string;
    output: string;
}

/**
 * Plugboard configuration from YAML
 */
export interface PlugboardConfig {
    /** Space-separated letter pairs, e.g., "AB CD EF" */
    connections: string;
}

/**
 * Reflector configuration from YAML
 */
export interface ReflectorConfig {
    /** Reflector type (A, B, C) */
    type: string;
}

/**
 * Complete Enigma machine configuration from YAML
 */
export interface EnigmaYamlConfig {
    plugboard: PlugboardConfig;
    rotors: RotorConfig[];
    reflector: ReflectorConfig;
    debug: boolean;
    message: string | null;
    etw: string;
    rotorswiring: RotorWiring[];
    reflectorswiring: ReflectorWiring[];
}

/**
 * Runtime rotor state
 */
export interface RotorState {
    rotor: string;
    position: string;
    ringoffset: number;
    offset: number;
    notch: string;
    moving: boolean;
}

/**
 * Result from the Enigma cracker
 */
export interface CrackerResult {
    rotors: RotorConfig[];
    reflector: string;
    decrypted: string;
    matchedKeywords: string[];
}
