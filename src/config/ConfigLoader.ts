/**
 * Configuration loader for the Enigma Machine
 * Loads and validates configuration from YAML files
 */

import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import {
    EnigmaYamlConfig,
    RotorWiring,
    ReflectorWiring,
} from '../types/index.js';
import { ROTOR_WIRINGS, REFLECTOR_WIRINGS } from './rotorData.js';

/**
 * Load Enigma configuration from a YAML file
 */
export class ConfigLoader {
    /**
     * Load configuration from a YAML file
     * @param path - Path to the YAML configuration file
     * @returns Parsed configuration object
     */
    static loadFromYaml(path: string): EnigmaYamlConfig {
        try {
            const fileContents = readFileSync(path, 'utf8');
            const config = yaml.load(fileContents) as EnigmaYamlConfig;

            // Use built-in wiring data if not provided in config
            if (!config.rotorswiring) {
                config.rotorswiring = ROTOR_WIRINGS;
            }
            if (!config.reflectorswiring) {
                config.reflectorswiring = REFLECTOR_WIRINGS;
            }

            ConfigLoader.validate(config);
            return config;
        } catch (error) {
            throw new Error(`Failed to load configuration: ${error}`);
        }
    }

    /**
     * Validate the configuration object
     * @param config - Configuration to validate
     * @throws Error if configuration is invalid
     */
    static validate(config: EnigmaYamlConfig): void {
        // Check required fields
        if (!config.rotors || config.rotors.length !== 3) {
            throw new Error('Configuration must have exactly 3 rotors');
        }

        // Validate each rotor
        for (const rotor of config.rotors) {
            if (!rotor.rotor || !rotor.position) {
                throw new Error(
                    'Each rotor must have a rotor type and position',
                );
            }

            const wiring = ConfigLoader.findRotorWiring(config, rotor.rotor);
            if (!wiring) {
                throw new Error(`Unknown rotor type: ${rotor.rotor}`);
            }
        }

        // Validate reflector
        if (!config.reflector?.type) {
            throw new Error('Configuration must specify a reflector type');
        }

        const reflectorWiring = ConfigLoader.findReflectorWiring(
            config,
            config.reflector.type,
        );
        if (!reflectorWiring) {
            throw new Error(`Unknown reflector type: ${config.reflector.type}`);
        }

        // Validate plugboard (optional)
        if (config.plugboard?.connections) {
            const connections = config.plugboard.connections.trim().split(' ');
            for (const conn of connections) {
                if (conn && conn.length !== 2) {
                    throw new Error(`Invalid plugboard connection: ${conn}`);
                }
            }
        }
    }

    /**
     * Find rotor wiring by name
     */
    static findRotorWiring(
        config: EnigmaYamlConfig,
        name: string,
    ): RotorWiring | undefined {
        return config.rotorswiring.find((r) => r.rotor === name);
    }

    /**
     * Find reflector wiring by name
     */
    static findReflectorWiring(
        config: EnigmaYamlConfig,
        name: string,
    ): ReflectorWiring | undefined {
        return config.reflectorswiring.find((r) => r.reflector === name);
    }
}
