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

const keywords = [
    "ENIGMA",
    "BLETCHLEY",
    "TURING",
    "CRACK",
    "DECRYPT",
    "SECRET",
    "CODE",
    "MESSAGE",
    "SIGNAL",
    "INTELLIGENCE",
    "OPERATION",
    "MISSION",
    "AGENT",
    "SPY",
    "ENEMY",
    "ATTACK",
    "DEFENSE",
    "CIPHER",
    "CRYPTO",
    "CRYPTANALYSIS",
    "BREAK",
    "WAR",
    "PEACE",
    "VICTORY",
    "DEFEAT",
    "ALLIES",
    "WEAPON",
    "NUCLEAR",
    "BOMB",
    "AMMO",
    "SOLDIER",
    "ARMY",
    "NAVY",
    "AIRFORCE",
    "MARINE",
    "COMMAND",
    "CONTROL",
    "INVASION",
    "EVACUATION",
    "SURVIVAL",
    "RESCUE",
    "RECOVERY",
    "RECONNAISSANCE",
    "WEATHER",
    "RADAR",
    "SONAR",
    "SONIC",
    "SATELLITE",
    "TELEMETRY",
    "COMMUNICATION",
    "TRANSMISSION",
    "RECEPTION",
    "BROADCAST",
    "INTERCEPTION",
    "ENCRYPTION",
    "DECRYPTION",
    "DESTRUCTION",
    "RECONSTRUCTION",
    "RESTORATION",
    "REPAIR",
    "MAINTENANCE",
    "UPGRADE",
    "UPDATE",
    "REVISION",
    "REVIEW",
    "RENEWAL",
    "REFRESH",
    "REFORM",
    "REORGANIZATION",
    "RESTRUCTURE",
    "REBUILD",
    "RESTART",
    "REBOOT",
    "RELOAD",
    "REINSTALL",
    "REINSTALLATION"
]

const etw = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const plugboard = [];

const rotorswiring = [
    {
        rotor: "I",
        wiring: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
        notch: "Q"
    },
    {
        rotor: "II",
        wiring: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
        notch: "E"
    },
    {
        rotor: "III",
        wiring: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
        notch: "V"
    },
    {
        rotor: "IV",
        wiring: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
        notch: "J"
    },
    {
        rotor: "V",
        wiring: "VZBRGITYUPSDNHLXAWMJQOFECK",
        notch: "Z"
    }
];

const reflectorswiring = [
    {
        reflector: "A",
        wiring: "EJMZALYXVBWFCRQUONTSPIKHGD"
    },
    {
        reflector: "B",
        wiring: "YRUHQSLDPXNGOKMIEBFZCWVJAT"
    },
    {
        reflector: "C",
        wiring: "FVPJIAOYEDRZXWGCTKUQSBNMHL"
    }
];

/**
 * enigma(message, etw, plugboard, rotors, rotorWiring, reflector, debug = false)
 * @param {string} message
 * @param {Array<string>} etw
 * @param {Array<{input: string, output: string}>} plugboard
 * @param {Array<{rotor: string, position: string, ringoffset: number, offset: number, notch: string, moving: boolean}>} rotors
 * @param {Array<{rotor: string, wiring: string, notch: string}>} rotorWiring
 * @param {string} reflector
 * @param {boolean} debug
 * @returns {string} result
 */

/**
 * There are 5 rotors (I, II, III, IV, V)
 * There are 3 reflectors (A, B, C)
 * There are 26 plugboard connections (A-Z)
 * There are 10 pairs of plugboard connections (eg. AB, CD, EF, ...)
 *
 * The machine is only using 3 rotors, 1 reflector, and between 0 and 10 pairs of plugboard connections
 * The 3 rotors can be set to any of the 5 rotors
 * Each rotor can be set to any of the 26 positions
 * Each rotor can be set to any of the 26 ring settings
 * The reflector can be set to any of the 3 reflectors
 * The plugboard connections can be set to any of the 26 plugboard connections
 *
 * The combinations are:
 *  - Rotors: 5 * 4 * 3 = 60
 *  - Rotor Positions: 26 * 26 * 26 = 17,576
 *  - Ring Settings: 26 * 26 = 676
 *  - Reflectors: 3
 *  - Plugboard: 26!/(6!*2^10) = 150,738,274,937,250
 * - Total: 60 * 17,576 * 676 * 3 * 150,738,274,937,250
 * - Total: 322,376,061,981,751,858,080,000 (322 Sextillion, 3.22 * 10^23)
 */

/**
 * Function that returns the entire list of combination of rotors (walzenlage, ringstellung & grundstellung), reflectors, and plugboards
 * generateCombinations()
 * @returns {Array<{rotors: Array<string>, reflector: string, plugboard: Array<{input: string, output: string}>}>}
 */

/**
 * Function that returns the entire list of combination of rotors (walzenlage, ringstellung & grundstellung)
 * @returns {Array<{rotor: string, position: string, ringoffset: number, offset: number, notch: string, moving: boolean}>}
 */

function generateRotorCombinations() {
    const rotors = [];
    const rotorPositions = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ringSettings = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let rotor of rotorswiring) {
        for (let rotorPosition of rotorPositions) {
            for (let ringSetting of ringSettings) {
                rotors.push({
                    rotor: rotor.rotor,
                    position: rotorPosition,
                    ringoffset: ringSetting.charCodeAt(0) - "A".charCodeAt(0) + 1,
                    offset: rotorPosition.charCodeAt(0) - "A".charCodeAt(0) + 1 - 1,
                    notch: rotor.notch,
                    moving: false
                });
            }
        }
    }

    return rotors;
}

const allRotorCombinations = generateRotorCombinations();
// console.log(allRotorCombinations);
// console.log(allRotorCombinations.length);



/**
 * Function that returns the entire list of combination of reflectors
 * @returns {Array<string>}
 */

function generateReflectorCombinations() {
    return reflectorswiring.map(reflector => reflector.reflector);
}
// console.log(generateReflectorCombinations());
// console.log(generateReflectorCombinations().length);



function* generateRotorsCombinations() {
    const rotorCombinations = generateRotorCombinations();
    const totalRotors = rotorswiring.length;

    for (let i = 0; i < totalRotors; i++) {
        for (let j = 0; j < totalRotors; j++) {
            if (j === i) continue; // éviter les duplications
            for (let k = 0; k < totalRotors; k++) {
                if (k === i || k === j) continue; // éviter les duplications

                const rotor1Combinations = rotorCombinations.filter(rc => rc.rotor === rotorswiring[i].rotor);
                const rotor2Combinations = rotorCombinations.filter(rc => rc.rotor === rotorswiring[j].rotor);
                const rotor3Combinations = rotorCombinations.filter(rc => rc.rotor === rotorswiring[k].rotor);

                for (let comb1 of rotor1Combinations) {
                    for (let comb2 of rotor2Combinations) {
                        for (let comb3 of rotor3Combinations) {
                            // yield { rotors: [comb1, comb2, comb3] }; // utilise `yield` pour économiser de la mémoire
                            yield [comb1, comb2, comb3]; // utilise `yield` pour économiser de la mémoire
                        }
                    }
                }
            }
        }
    }
}

// Exemple d'utilisation avec un générateur
const rotorGen = generateRotorsCombinations();
// let count = 0;

// for (const combination of rotorGen) {
//     count++;
//     // Traite chaque combinaison ici ou stocke dans un tableau si nécessaire
//     console.log(combination);
// }

// console.log(count); // Affiche le nombre total de combinaisons générées

console.log(rotorGen.next().value);



