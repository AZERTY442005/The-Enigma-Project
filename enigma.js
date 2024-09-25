function letterOffset(letter, offset) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const index = alphabet.indexOf(letter);
    if (index === -1) {
        return letter;
    }
    return alphabet[(index + offset + alphabet.length) % alphabet.length];
}

function enigma(message, etw, plugboard, rotors, rotorWiring, reflector, debug = false) {
    result = "";

    for (let i = 0; i < message.length; i++) {
        let character = message[i].toUpperCase();
        if (debug) console.log(character);

        if (!etw.includes(character)) {
            continue;
        }


        // Moving Rotors
        if (debug) console.log("\nRotors Movement")
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

        if (debug) console.log(rotors);


        // Plugboard
        if (debug) console.log("\nPlugboard")
        let plugboardConnection = plugboard.find(connection => connection.input === character);
        if (debug) console.log(plugboardConnection);
        character = plugboardConnection.output;
        if (debug) console.log(character);

        // ETW
        if (debug) console.log("\nETW")
        if (debug) console.log(etw)
        character = etw[etw.indexOf(character) % etw.length];
        if (debug) console.log(character);

        // Rotor 3 Offset
        character = etw[(etw.indexOf(character) + rotors[2].offset + etw.length) % etw.length];
        if (debug) console.log(character);

        // Rotors
        if (debug) console.log("\nRotors")
        /// Rotor 3
        let rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        if (debug) console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset}`)
        if (debug) console.log(etw)
        if (debug) console.log(rotor3)
        let rotor3backIndex = etw.indexOf(character);
        let rotor3backIndexOffset = (rotor3backIndex - rotors[2].ringoffset + etw.length) % etw.length;
        let rotor3backIndexTransfer = etw.indexOf(rotor3[rotor3backIndexOffset]);
        let rotor3backIndexTransferOffset = (rotor3backIndexTransfer + rotors[2].ringoffset + etw.length) % etw.length
        character = etw[rotor3backIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 2 Offset
        character = etw[(etw.indexOf(character) + (rotors[1].offset - rotors[2].offset) + etw.length) % etw.length];
        if (debug) console.log(character);

        /// Rotor 2
        let rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        if (debug) console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset} (${rotors[1].offset - rotors[2].offset})`)
        if (debug) console.log(etw)
        if (debug) console.log(rotor2)
        let rotor2backIndex = etw.indexOf(character);
        let rotor2backIndexOffset = (rotor2backIndex - rotors[1].ringoffset + etw.length) % etw.length;
        let rotor2backIndexTransfer = etw.indexOf(rotor2[rotor2backIndexOffset]);
        let rotor2backIndexTransferOffset = (rotor2backIndexTransfer + rotors[1].ringoffset + etw.length) % etw.length
        character = etw[rotor2backIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 1 Offset
        character = etw[(etw.indexOf(character) + (rotors[0].offset - rotors[1].offset) + etw.length) % etw.length];
        if (debug) console.log(character);

        /// Rotor 1
        let rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        if (debug) console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset} (${rotors[0].offset - rotors[1].offset})`)
        if (debug) console.log(etw)
        if (debug) console.log(rotor1)
        let rotor1backIndex = etw.indexOf(character);
        let rotor1backIndexOffset = (rotor1backIndex - rotors[0].ringoffset + etw.length) % etw.length;
        let rotor1backIndexTransfer = etw.indexOf(rotor1[rotor1backIndexOffset]);
        let rotor1backIndexTransferOffset = (rotor1backIndexTransfer + rotors[0].ringoffset + etw.length) % etw.length
        character = etw[rotor1backIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 1 Offset
        character = etw[(etw.indexOf(character) - rotors[0].offset + etw.length) % etw.length];
        if (debug) console.log(character);



        // Reflector
        if (debug) console.log("\nReflector")
        if (debug) console.log(etw)
        if (debug) console.log(reflector)
        character = reflector[etw.indexOf(character)];
        if (debug) console.log(character)



        // Rotor 1 Offset
        character = etw[(etw.indexOf(character) + rotors[0].offset + etw.length) % etw.length];
        if (debug) console.log(character);


        // Rotors
        if (debug) console.log("\nRotors")
        /// Rotor 1
        rotor1 = rotorWiring.find(rotor => rotor.rotor === rotors[0]?.rotor).wiring;
        if (debug) console.log(`Rotor 1 (${rotors[0].rotor}): ${rotors[0].offset}`)
        if (debug) console.log(rotor1)
        if (debug) console.log(etw)
        let rotor1forthIndex = etw.indexOf(character);
        let rotor1forthIndexOffset = (rotor1forthIndex - rotors[0].ringoffset + etw.length) % etw.length;
        let rotor1forthIndexTransfer = rotor1.indexOf(etw[rotor1forthIndexOffset]);
        let rotor1forthIndexTransferOffset = (rotor1forthIndexTransfer + rotors[0].ringoffset + etw.length) % etw.length
        character = etw[rotor1forthIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 1 Offset
        character = etw[(etw.indexOf(character) + (rotors[1].offset - rotors[0].offset) + etw.length) % etw.length];
        if (debug) console.log(character);

        /// Rotor 2
        rotor2 = rotorWiring.find(rotor => rotor.rotor === rotors[1]?.rotor).wiring;
        if (debug) console.log(`Rotor 2 (${rotors[1].rotor}): ${rotors[1].offset}`)
        if (debug) console.log(rotor2)
        if (debug) console.log(etw)
        let rotor2forthIndex = etw.indexOf(character);
        let rotor2forthIndexOffset = (rotor2forthIndex - rotors[1].ringoffset + etw.length) % etw.length;
        let rotor2forthIndexTransfer = rotor2.indexOf(etw[rotor2forthIndexOffset]);
        let rotor2forthIndexTransferOffset = (rotor2forthIndexTransfer + rotors[1].ringoffset + etw.length) % etw.length
        character = etw[rotor2forthIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 2 Offset
        character = etw[(etw.indexOf(character) + (rotors[2].offset - rotors[1].offset) + etw.length) % etw.length];
        if (debug) console.log(character);

        /// Rotor 3
        rotor3 = rotorWiring.find(rotor => rotor.rotor === rotors[2]?.rotor).wiring;
        if (debug) console.log(`Rotor 3 (${rotors[2].rotor}): ${rotors[2].offset} (${rotors[2].offset - rotors[1].offset})`)
        if (debug) console.log(rotor3)
        if (debug) console.log(etw)
        let rotor3forthIndex = etw.indexOf(character);
        let rotor3forthIndexOffset = (rotor3forthIndex - rotors[2].ringoffset + etw.length) % etw.length;
        let rotor3forthIndexTransfer = rotor3.indexOf(etw[rotor3forthIndexOffset]);
        let rotor3forthIndexTransferOffset = (rotor3forthIndexTransfer + rotors[2].ringoffset + etw.length) % etw.length
        character = etw[rotor3forthIndexTransferOffset];
        if (debug) console.log(character)

        // Rotor 3 Offset
        character = etw[(etw.indexOf(character) - rotors[2].offset + etw.length) % etw.length];
        if (debug) console.log(character);



        // Plugboard
        if (debug) console.log("\nPlugboard")
        plugboardConnection = plugboard.find(connection => connection.input === character);
        if (debug) console.log(plugboardConnection);
        character = plugboardConnection.output;
        if (debug) console.log(character);

        if (debug) console.log("\n###############################################\n")

        result += character;
    }
    // Lampboard
    result = result.toUpperCase();
    return result;
}
module.exports = enigma;