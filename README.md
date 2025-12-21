# The Enigma Project 🔐

A TypeScript implementation of the **Enigma I cipher machine** used by Germany during World War II.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

## Features

- ✅ Accurate simulation of the Enigma I (1930) machine
- ✅ All 5 historical rotors (I-V) with correct wiring
- ✅ All 3 reflectors (A, B, C)
- ✅ Plugboard with up to 13 letter pairs
- ✅ Double-stepping mechanism
- ✅ Ring settings (Ringstellung)
- ✅ Brute-force cracker with keyword detection
- ✅ Comprehensive TypeScript types
- ✅ Unit tests with Jest

## Installation

```bash
# Clone the repository
git clone https://github.com/Enoal-Fauchille-Bolle/The-Enigma-Project.git
cd The-Enigma-Project

# Install dependencies
npm install

# Build the project
npm run build
```

## Quick Start

### Encrypt/Decrypt a Message

```bash
# Run interactively
npm start

# Or use development mode
npm run dev
```

### Configuration

Edit `config.yaml` to configure the machine:

```yaml
# Plugboard connections (letter pairs)
plugboard:
  connections: "BG CW DZ ET FO HL JQ NR PU VY"

# Rotors: left to right (slow to fast)
rotors:
  - rotor: III      # Rotor type (I, II, III, IV, V)
    position: X     # Initial position (A-Z)
    ringoffset: 5   # Ring setting (1-26)
  - rotor: II
    position: K
    ringoffset: 13
  - rotor: IV
    position: M
    ringoffset: 7

# Reflector (A, B, or C)
reflector:
  type: C

# Debug mode
debug: false

# Message (set to null for interactive prompt)
message: null
```

### Using as a Library

```typescript
import { EnigmaMachine, ConfigLoader } from './src/lib.js';

// Load from configuration file
const config = ConfigLoader.loadFromYaml('config.yaml');
const enigma = new EnigmaMachine(config);

// Encrypt a message
const encrypted = enigma.encrypt('HELLO');
console.log(encrypted); // e.g., "ILBDA"

// Decrypt (same operation with same settings)
enigma.reset();
const decrypted = enigma.encrypt(encrypted);
console.log(decrypted); // "HELLO"
```

## Project Structure

```txt
src/
├── core/               # Core machine components
│   ├── Alphabet.ts     # Letter utilities
│   ├── Plugboard.ts    # Plugboard implementation
│   ├── Rotor.ts        # Rotor implementation
│   ├── Reflector.ts    # Reflector implementation
│   └── EnigmaMachine.ts # Main machine class
├── config/             # Configuration
│   ├── ConfigLoader.ts # YAML loader
│   └── rotorData.ts    # Historical wiring data
├── cracker/            # Cryptanalysis tools
│   └── EnigmaCracker.ts # Brute force cracker
├── utils/              # Utilities
│   └── Logger.ts       # Debug logger
├── types/              # TypeScript definitions
│   └── index.ts
├── index.ts            # CLI entry point
├── crack.ts            # Cracker entry point
└── lib.ts              # Library exports

docs/
└── ENIGMA_MACHINE.md   # Machine documentation

tests/                  # Unit tests
└── *.test.ts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled application |
| `npm run dev` | Run directly with ts-node |
| `npm run crack` | Run the brute-force cracker |
| `npm test` | Run unit tests |
| `npm run lint` | Type-check without building |

## How Enigma Works

See [docs/ENIGMA_MACHINE.md](docs/ENIGMA_MACHINE.md) for a comprehensive guide.

**Signal Path:**

```txt
Keyboard → Plugboard → Rotors (R→L) → Reflector → Rotors (L→R) → Plugboard → Lampboard
```

**Key Features:**

- **Symmetric encryption**: encrypting twice returns the original message
- **No letter encrypts to itself**: a property exploited by codebreakers
- **Double-stepping**: middle rotor can advance twice in succession

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## Historical Context

The Enigma machine was used by Nazi Germany for secure military communications. Polish mathematicians first broke the cipher in 1932, and their work was shared with Britain before the war. At Bletchley Park, Alan Turing and his team developed the Bombe machine to automate decryption, helping shorten WWII by an estimated 2-4 years.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Credits

- Original JavaScript implementation: **AZERTY** ([@AZERTY442005](https://github.com/AZERTY442005))
- TypeScript refactoring: Enoal Fauchille-Bolle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
