// ©2024 AZERTY. All rights Reserved | Discord: @AZERTY442005
const fs = require("fs");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

(async () => {

    // AntiCrash
    process.on("uncaughtException", function (err) {
        console.error("Caught exception: ", err);
        while (true) { }
    });
    process.on("unhandledRejection", function (reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
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
    // console.log(plugboard);

    /**
     * config:
        * rotors:
        *   - rotor: I
        *       position: A
        *       notch: Q
        *   - rotor: II
        *       position: B
        *       notch: E
        *   - rotor: III
        *       position: C
        *       notch: V
     */

    // Setting up rotors
    const rotors = config.rotors.map(rotor => {
        // rotor.position = rotor.position.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        // rotor.notch = rotor.notch.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        rotor.offset = rotor.position.charCodeAt(0) - 'A'.charCodeAt(0) + 1 - 1;
        rotor.notch = config.rotorswiring.find(rotorWiring => rotorWiring.rotor === rotor.rotor).notch;
        rotor.moving = false;
        return rotor;
    });
    console.log(rotors);
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
    // let message = "hello world";
    let message = "AG";
    // let message = "ceci est une phrase";
    // let message = "J";
    // let message = "Z";
    // let message = "";
    // try {
    //     const answers = await prompt([
    //         {
    //             type: "input",
    //             name: "message",
    //             message: "Enter your message to encrypt:"
    //         }
    //     ]);
    //     message = answers.message;
    // } catch (error) {
    //     console.error("Error during prompt:", error);
    // }
    // console.log(message);

    message = message.split("");


    for (let i = 0; i < message.length; i++) {
        let character = message[i].toUpperCase();
        console.log(character);

        if (!etw.includes(character)) {
            continue;
        }


        // Moving Rotors
        console.log("\nRotors Movement")
        /// Pawl 3
        rotors[2].moving = true;
        /// Pawl 2
        // console.log(`A: ${rotors[2].position} - ${rotors[2].notch}`)
        if (rotors[2].position === rotors[2].notch) {
            rotors[2].moving = true;
            rotors[1].moving = true;
        }
        /// Pawl 1
        // console.log(`B: ${rotors[1].position} - ${rotors[1].notch}`)
        if (rotors[1].position === rotors[1].notch) {
            rotors[1].moving = true;
            rotors[0].moving = true;
        }

        if (rotors[0].moving) {
            // console.log(`I: ${rotors[0].position}`)
            rotors[0].position = String.fromCharCode((rotors[0].position.charCodeAt(0) + 1 - 'A'.charCodeAt(0)) % 26 + 'A'.charCodeAt(0));
            rotors[0].offset = (rotors[0].offset + 1) % 26;
            // console.log(`I: ${rotors[0].position}`)
            rotors[0].moving = false;
        }
        if (rotors[1].moving) {
            // console.log(`II: ${rotors[1].position}`)
            rotors[1].position = String.fromCharCode((rotors[1].position.charCodeAt(0) + 1 - 'A'.charCodeAt(0)) % 26 + 'A'.charCodeAt(0));
            rotors[1].offset = (rotors[1].offset + 1) % 26;
            // console.log(`II: ${rotors[1].position}`)
            rotors[1].moving = false;
        }
        if (rotors[2].moving) {
            // console.log(`III: ${rotors[2].position}`)
            rotors[2].position = String.fromCharCode((rotors[2].position.charCodeAt(0) + 1 - 'A'.charCodeAt(0)) % 26 + 'A'.charCodeAt(0));
            rotors[2].offset = (rotors[2].offset + 1) % 26;
            // console.log(`III: ${rotors[2].position}`)
            rotors[2].moving = false;
        }

        console.log(rotors);


        // Plugboard
        console.log("\nPlugboard")
        let plugboardConnection = plugboard.find(connection => connection.input === character);
        console.log(plugboardConnection);
        character = plugboardConnection.output;
        console.log(character);

        // ETW
        console.log("\nETW")
        console.log(config.etw)
        character = config.etw[config.etw.indexOf(character) % config.etw.length];
        console.log(character);

        // Rotor 3 Offset
        character = config.etw[(config.etw.indexOf(character) + rotors[2].offset + config.etw.length) % config.etw.length];
        console.log(character);

        // Rotors
        console.log("\nRotors")
        /// Rotor 3
        let rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset}`)
        console.log(config.etw)
        console.log(rotor1)
        character = rotor1[config.etw.indexOf(character)];
        console.log(character)

        // Rotor 2 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[1].offset - rotors[2].offset) + config.etw.length) % config.etw.length];
        console.log(character);

        /// Rotor 2
        let rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset} (${rotors[1].offset - rotors[2].offset})`)
        console.log(config.etw)
        console.log(rotor2)
        character = rotor2[config.etw.indexOf(character) % config.etw.length];
        console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[0].offset - rotors[1].offset) + config.etw.length) % config.etw.length];
        console.log(character);

        /// Rotor 1
        let rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset} (${rotors[0].offset - rotors[1].offset})`)
        console.log(config.etw)
        console.log(rotor3)
        character = rotor3[config.etw.indexOf(character) % config.etw.length];
        console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) - rotors[0].offset + config.etw.length) % config.etw.length];
        console.log(character);



        // Reflector
        console.log("\nReflector")
        console.log(config.etw)
        console.log(reflector)
        character = reflector[config.etw.indexOf(character)];
        console.log(character)



        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + rotors[0].offset + config.etw.length) % config.etw.length];
        console.log(character);


        // Rotors
        console.log("\nRotors")
        /// Rotor 1
        rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset}`)
        console.log(rotor3)
        console.log(config.etw)
        character = config.etw[rotor3.indexOf(character) % config.etw.length];
        console.log(character)

        // Rotor 1 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[1].offset - rotors[0].offset) + config.etw.length) % config.etw.length];
        console.log(character);

        /// Rotor 2
        rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset}`)
        console.log(rotor2)
        console.log(config.etw)
        character = config.etw[rotor2.indexOf(character) % config.etw.length];
        console.log(character)

        // Rotor 2 Offset
        character = config.etw[(config.etw.indexOf(character) + (rotors[2].offset - rotors[1].offset) + config.etw.length) % config.etw.length];
        console.log(character);

        /// Rotor 3
        rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset} (${rotors[2].offset - rotors[1].offset})`)
        console.log(rotor1)
        console.log(config.etw)
        character = config.etw[rotor1.indexOf(character) % config.etw.length];
        console.log(character)

        // Rotor 3 Offset
        character = config.etw[(config.etw.indexOf(character) - rotors[2].offset + config.etw.length) % config.etw.length];
        console.log(character);





        // Plugboard
        console.log("\nPlugboard")
        plugboardConnection = plugboard.find(connection => connection.input === character);
        console.log(plugboardConnection);
        character = plugboardConnection.output;
        console.log(character);

        console.log("\n###############################################\n")

        message[i] = character;
    }
    // Lampboard
    message = message.join("").toLowerCase();
    console.log(message);

})();
