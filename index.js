// ©2024 AZERTY. All rights Reserved | Discord: @AZERTY442005
const fs = require("fs");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

function letterOffset(letter, offset) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const index = alphabet.indexOf(letter);
    if (index === -1) {
        return letter;
    }
    return alphabet[(index + offset + alphabet.length) % alphabet.length];
}

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
                    message: "Enter your message to encrypt:"
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

    // Define the result variable
    result = "";

    for (let i = 0; i < message.length; i++) {
        let character = message[i].toUpperCase();
        if (config.debug) console.log(character);

        if (!etw.includes(character)) {
            continue;
        }


        // Moving Rotors
        if (config.debug) console.log("\nRotors Movement")
        /// Pawl 3
        rotors[2].moving = true;
        /// Pawl 2
        if (rotors[2].position === rotors[2].notch) {
            rotors[2].moving = true;
            rotors[1].moving = true;
        }
        /// Pawl 1
        if (rotors[1].position === rotors[1].notch) {
            rotors[1].moving = true;
            rotors[0].moving = true;
        }

        if (rotors[0].moving) {
            rotors[0].position = letterOffset(rotors[0].position, 1);
            rotors[0].offset = (rotors[0].offset + 1) % 26;
            rotors[0].moving = false;
        }
        if (rotors[1].moving) {
            rotors[1].position = letterOffset(rotors[1].position, 1);
            rotors[1].offset = (rotors[1].offset + 1) % 26;
            rotors[1].moving = false;
        }
        if (rotors[2].moving) {
            rotors[2].position = letterOffset(rotors[2].position, 1);
            rotors[2].offset = (rotors[2].offset + 1) % 26;
            rotors[2].moving = false;
        }

        if (config.debug) console.log(rotors);


        // Plugboard
        if (config.debug) console.log("\nPlugboard")
        let plugboardConnection = plugboard.find(connection => connection.input === character);
        if (config.debug) console.log(plugboardConnection);
        character = plugboardConnection.output;
        if (config.debug) console.log(character);

        // ETW
        if (config.debug) console.log("\nETW")
        if (config.debug) console.log(config.etw)
        character = config.etw[config.etw.indexOf(character) % config.etw.length];
        if (config.debug) console.log(character);

        // Rotor 3 Offset
        character = config.etw[(config.etw.indexOf(character) + rotors[2].offset + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);

        // Rotors
        if (config.debug) console.log("\nRotors")
        /// Rotor 3
        let rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset}`)
        if (config.debug) console.log(config.etw)
        if (config.debug) console.log(rotor3)
        let rotor3backIndex = config.etw.indexOf(character);
        let rotor3backIndexOffset = (rotor3backIndex - rotors[2].ringoffset + config.etw.length) % config.etw.length;
        let rotor3backIndexTransfer = config.etw.indexOf(rotor3[rotor3backIndexOffset]);
        let rotor3backIndexTransferOffset = (rotor3backIndexTransfer + rotors[2].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor3backIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 2 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[1].offset - rotors[2].offset) + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);

        /// Rotor 2
        let rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset} (${rotors[1].offset - rotors[2].offset})`)
        if (config.debug) console.log(config.etw)
        if (config.debug) console.log(rotor2)
        let rotor2backIndex = config.etw.indexOf(character);
        let rotor2backIndexOffset = (rotor2backIndex - rotors[1].ringoffset + config.etw.length) % config.etw.length;
        let rotor2backIndexTransfer = config.etw.indexOf(rotor2[rotor2backIndexOffset]);
        let rotor2backIndexTransferOffset = (rotor2backIndexTransfer + rotors[1].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor2backIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[0].offset - rotors[1].offset) + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);

        /// Rotor 1
        let rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset} (${rotors[0].offset - rotors[1].offset})`)
        if (config.debug) console.log(config.etw)
        if (config.debug) console.log(rotor1)
        let rotor1backIndex = config.etw.indexOf(character);
        let rotor1backIndexOffset = (rotor1backIndex - rotors[0].ringoffset + config.etw.length) % config.etw.length;
        let rotor1backIndexTransfer = config.etw.indexOf(rotor1[rotor1backIndexOffset]);
        let rotor1backIndexTransferOffset = (rotor1backIndexTransfer + rotors[0].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor1backIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) - rotors[0].offset + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);



        // Reflector
        if (config.debug) console.log("\nReflector")
        if (config.debug) console.log(config.etw)
        if (config.debug) console.log(reflector)
        character = reflector[config.etw.indexOf(character)];
        if (config.debug) console.log(character)



        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + rotors[0].offset + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);


        // Rotors
        if (config.debug) console.log("\nRotors")
        /// Rotor 1
        rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset}`)
        if (config.debug) console.log(rotor1)
        if (config.debug) console.log(config.etw)
        let rotor1forthIndex = config.etw.indexOf(character);
        let rotor1forthIndexOffset = (rotor1forthIndex - rotors[0].ringoffset + config.etw.length) % config.etw.length;
        let rotor1forthIndexTransfer = rotor1.indexOf(config.etw[rotor1forthIndexOffset]);
        let rotor1forthIndexTransferOffset = (rotor1forthIndexTransfer + rotors[0].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor1forthIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[1].offset - rotors[0].offset) + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);

        /// Rotor 2
        rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset}`)
        if (config.debug) console.log(rotor2)
        if (config.debug) console.log(config.etw)
        let rotor2forthIndex = config.etw.indexOf(character);
        let rotor2forthIndexOffset = (rotor2forthIndex - rotors[1].ringoffset + config.etw.length) % config.etw.length;
        let rotor2forthIndexTransfer = rotor2.indexOf(config.etw[rotor2forthIndexOffset]);
        let rotor2forthIndexTransferOffset = (rotor2forthIndexTransfer + rotors[1].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor2forthIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 2 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[2].offset - rotors[1].offset) + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);

        /// Rotor 3
        rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        if (config.debug) console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset} (${rotors[2].offset - rotors[1].offset})`)
        if (config.debug) console.log(rotor3)
        if (config.debug) console.log(config.etw)
        let rotor3forthIndex = config.etw.indexOf(character);
        let rotor3forthIndexOffset = (rotor3forthIndex - rotors[2].ringoffset + config.etw.length) % config.etw.length;
        let rotor3forthIndexTransfer = rotor3.indexOf(config.etw[rotor3forthIndexOffset]);
        let rotor3forthIndexTransferOffset = (rotor3forthIndexTransfer + rotors[2].ringoffset + config.etw.length) % config.etw.length
        character = config.etw[rotor3forthIndexTransferOffset];
        if (config.debug) console.log(character)

        // Rotor 3 Offset
        character = config.etw[(config.etw.indexOf(character) - rotors[2].offset + config.etw.length) % config.etw.length];
        if (config.debug) console.log(character);



        // Plugboard
        if (config.debug) console.log("\nPlugboard")
        plugboardConnection = plugboard.find(connection => connection.input === character);
        if (config.debug) console.log(plugboardConnection);
        character = plugboardConnection.output;
        if (config.debug) console.log(character);

        if (config.debug) console.log("\n###############################################\n")

        result += character;
    }
    // Lampboard
    result = result.toUpperCase();
    console.log(result);
    console.log();

})();
