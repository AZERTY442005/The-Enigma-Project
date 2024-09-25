// The goal of this program is to crack the enigma code
// By trying all possible combinations of rotors, reflectors, and plugboards
// And detect keywords in the decrypted message

const enigma = require("./enigma");

// AntiCrash
process.on("uncaughtException", function (err) {
    console.error("Caught exception: ", err);
    // Keep the process alive
    while (true) { }
});
process.on("unhandledRejection", function (reason, p) {
    console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // Keep the process alive
    while (true) { }
});

/**
 * enigma(message, etw, plugboard, rotors, rotorWiring, reflector, debug = false)
 * @param {string} message
 * @param {Array<string>} etw
 * @param {Array<{input: string, output: string}>} plugboard
 * @param {Array<{rotor: string, position: string, ringoffset: number, offset: number, notch: string, moving: boolean}>} rotors
 * @param {Array<{rotor: string, wiring: string, notch: string}>} rotorWiring
 * @param {string} reflector
 * @param {boolean} debug
 */

