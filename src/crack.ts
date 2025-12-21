/**
 * Enigma Cracker Entry Point
 *
 * Attempts to crack Enigma-encrypted messages using brute force.
 */

import { EnigmaCracker } from './cracker/EnigmaCracker.js';

// Example encrypted message (you can modify this)
const CIPHERTEXT = process.argv[2] || 'HELLOWORLD';

async function main(): Promise<void> {
    console.log('╔═══════════════════════════════════════════╗');
    console.log('║         ENIGMA CRACKER                    ║');
    console.log('║     Brute Force Decryption Tool           ║');
    console.log('╚═══════════════════════════════════════════╝');
    console.log();

    console.log(`Attempting to crack: ${CIPHERTEXT}`);
    console.log(
        `Total combinations to try: ${new EnigmaCracker().getTotalCombinations().toLocaleString()}`,
    );
    console.log();

    const cracker = new EnigmaCracker();

    console.log('Cracking... (this may take a while)');
    console.log();

    const startTime = Date.now();

    const results = cracker.crack(CIPHERTEXT, 5, (tried, total) => {
        const percent = ((tried / total) * 100).toFixed(2);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(
            `\rProgress: ${percent}% (${tried.toLocaleString()} / ${total.toLocaleString()}) - ${elapsed}s`,
        );
    });

    console.log('\n');

    if (results.length === 0) {
        console.log('No results found matching keywords.');
    } else {
        console.log(`Found ${results.length} potential match(es):`);
        console.log();

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            console.log(`═══ Result ${i + 1} ═══════════════════════════`);
            console.log(
                `Rotors: ${result.rotors.map((r) => `${r.rotor}(${r.position})`).join(' - ')}`,
            );
            console.log(`Reflector: ${result.reflector}`);
            console.log(`Decrypted: ${result.decrypted}`);
            console.log(`Keywords found: ${result.matchedKeywords.join(', ')}`);
            console.log();
        }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Total time: ${elapsed} seconds`);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
