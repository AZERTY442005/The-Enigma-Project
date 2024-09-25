// ©2024 AZERTY. All rights Reserved | Discord: @AZERTY442005
const fs = require("fs");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const enigma = require("./enigma");

(async () => {

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

    // Reading config file
    let config = {};
    try {
        config = yaml.load(fs.readFileSync("config.yaml", "utf8"));
        // console.log(config);
    } catch (error) {
        console.error(`Unable to read config file:`, error);
    }

    // Setting up plugboard connections
    const plugboard = config.plugboard.connections.split(" ").flatMap(connection => {
        const input = connection[0].toUpperCase();
        const output = connection[1].toUpperCase();
        return [
            { input, output },
            { input: output, output: input }
        ];
    });
    // Include characters that are not connected
    const etw = config.etw.split("");
    etw.forEach(character => {
        if (!plugboard.find(connection => connection.input === character || connection.output === character)) {
            plugboard.push({ input: character, output: character });
        }
    });

    // Setting up rotors
    const rotors = config.rotors.map(rotor => {
        // rotor.position = rotor.position.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        // rotor.notch = rotor.notch.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        rotor.offset = rotor.position.charCodeAt(0) - 'A'.charCodeAt(0) + 1 - 1;
        rotor.notch = config.rotorswiring.find(rotorWiring => rotorWiring.rotor === rotor.rotor).notch;
        rotor.moving = false;
        return rotor;
    });
    if (config.debug) console.log(rotors);
    const rotorWiring = config.rotorswiring

    // Setting up reflector
    const reflector = config.reflectorswiring.find(reflector => reflector.reflector === config.reflector.type)?.wiring


    /**
     * Enigma Machine Encryption Steps
     * 1. Keyboard
     * 2. Plugboard
     * 3. Rotors
     * 4. Reflector
     * 5. Rotors
     * 6. Plugboard
     * 7. Lampboard
    */

    // Keyboard
    let message = "";
    if (config.message == null) {
        try {
            const answers = await prompt([
                {
                    type: "input",
                    name: "message",
                    message: "Enter your message to encrypt/decrypt:"
                }
            ]);
            message = answers.message;
        } catch (error) {
            console.error("Error during prompt:", error);
        }
    } else {
        message = config.message;
        console.log(message);
    }

    console.log(etw)
    console.log(plugboard)
    console.log(rotors)
    console.log(rotorWiring)
    console.log(reflector)
    result = enigma(message, etw, plugboard, rotors, rotorWiring, reflector, config.debug);
    console.log(result);
    console.log();

})();
