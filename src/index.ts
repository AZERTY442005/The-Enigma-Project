/**
 * The Enigma Project - Main Entry Point
 *
 * A TypeScript implementation of the Enigma I cipher machine.
 *
 * @author AZERTY
 * @license GPL-3.0
 */

import inquirer from 'inquirer';
import { EnigmaMachine } from './core/EnigmaMachine.js';
import { ConfigLoader } from './config/ConfigLoader.js';

const CONFIG_PATH = 'config.yaml';

async function main(): Promise<void> {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║         THE ENIGMA PROJECT                ║');
    console.log('║     Enigma I Machine Simulator            ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log();

    // Load configuration
    let config;
    try {
        config = ConfigLoader.loadFromYaml(CONFIG_PATH);
    } catch (error) {
        console.error('Error loading configuration:', error);
        process.exit(1);
    }

    // Display current settings
    console.log('Machine Configuration:');
    console.log(`  Rotors: ${config.rotors.map((r) => r.rotor).join(' - ')}`);
    console.log(
        `  Positions: ${config.rotors.map((r) => r.position).join('')}`,
    );
    console.log(
        `  Ring Settings: ${config.rotors.map((r) => r.ringoffset).join(' - ')}`,
    );
    console.log(`  Reflector: ${config.reflector.type}`);
    console.log(`  Plugboard: ${config.plugboard.connections || '(none)'}`);
    console.log();

    // Create the Enigma machine
    const enigma = new EnigmaMachine(config);

    // Get message to encrypt/decrypt
    let message: string;

    if (config.message) {
        message = config.message;
        console.log(`Input message: ${message}`);
    } else {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'message',
                message: 'Enter your message to encrypt/decrypt:',
                validate: (input: string) =>
                    input.length > 0 || 'Please enter a message',
            },
        ]);
        message = answers.message;
    }

    console.log();

    // Encrypt the message
    const result = enigma.encrypt(message);

    console.log('═══════════════════════════════════════════');
    console.log(`Input:  ${message.toUpperCase().replace(/[^A-Z]/g, '')}`);
    console.log(`Output: ${result}`);
    console.log('═══════════════════════════════════════════');
    console.log();

    // Show final rotor positions
    console.log(`Final rotor positions: ${enigma.getRotorPositions()}`);
}

// Run main with error handling
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
