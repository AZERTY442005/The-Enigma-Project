# The Enigma Machine

> A comprehensive guide to understanding the Enigma cipher machine

## Introduction

The Enigma machine was an encryption device used by Germany during World War II to secure military communications. It operates through a system of rotors that modify letters with each keypress, rendering messages undecipherable without the correct configuration. A plugboard (Steckerbrett) adds an additional layer of complexity by swapping pairs of letters. To decrypt a message, both sender and receiver needed to use the same rotor and cable configuration.

This project recreates the **Enigma I model (1930)** in TypeScript, taking into account all parameters of the original machine.

---

## How It Works

The signal path through the machine:

```txt
Keyboard → Plugboard → Rotors → Reflector → Rotors → Plugboard → Lampboard
```

### Rotors

The Enigma I has **3 rotors** and a **reflector**. Each rotor has 26 positions representing the 26 letters of the alphabet. On both sides of each rotor are 26 electrical contacts, one for each letter, allowing electrical contact between adjacent rotors. Inside each rotor, the wires connecting the contacts on both sides are scrambled.

**Key characteristics:**

- The reflector's role is to reverse the direction of the electrical current, sending it back through all 3 rotors
- The 3 rotors are installed in the machine, each having a **notch** that triggers the rotation of the rotor to its left (only at one specific position out of 26)
- The electrical current enters Rotor 1 first, then Rotor 2, then Rotor 3, passes through the reflector, and returns through Rotor 3, 2, and 1

**Stepping mechanism:**

- When a key is pressed, Rotor 1 (rightmost) advances one position
- When Rotor 1 reaches its notch position, Rotor 2 advances on the next keypress
- The same applies for Rotor 2 triggering Rotor 3
- This creates a **double-stepping** anomaly where the middle rotor can step twice in succession

### Plugboard (Steckerbrett)

The Plugboard consists of 26 sockets representing the 26 letters:

- Up to 13 cables can be used to connect letters in pairs
- When two letters are connected, they are swapped
- The standard configuration uses 10 cables, but fewer can be used

---

## Cryptanalysis

The British at Bletchley Park used **probable word analysis** to crack Enigma. Messages were likely to contain terms such as:

- "Keine besonderen Ereignisse" (nothing to report)
- "Eins" (number 1)
- "Wiederhole" (repeat)
- "Munition" (ammunition)
- "Wetter" (weather)

These probable words were called **"cribs"**.

---

## Technical Information

### Configuration Parameters

1. **Rotor Selection** - The machine includes 5 rotors total, but only 3 are used at a time
2. **Initial Rotor Positions** (Grundstellung) - Starting position for each rotor (A-Z)
3. **Ring Settings** (Ringstellung) - Offset of the rotor's alphabet ring
4. **Plugboard Connections** - Letter pairs to swap

### Letter Transformations

During signal processing, a letter can change **7 to 9 times**:

- 0 or 1 time at the plugboard (input)
- 7 times through the rotors and reflector
- 0 or 1 time at the plugboard (output)

### Total Combinations

Enigma has 4 main parameters, resulting in:

| Parameter | Combinations | Calculation |
| --------- | ------------ | ----------- |
| Rotor Selection | 60 | 5P3 (permutations of 3 from 5) |
| Initial Positions | 17,576 | 26³ |
| Ring Settings | 676 | 26² (first 2 rotors only) |
| Reflector Choice | 3 | A, B, or C |
| Plugboard | 150,738,274,937,250 | 10 pairs from 26 letters |

**Total: 322,376,061,981,751,858,080,000** (322 sextillion, 3.22 × 10²³)

---

## Glossary

| Term | Description |
| ---- | ----------- |
| **Rotor** (Walze) | Rotating cipher wheel |
| **Ring Setting** (Ringstellung) | Adjustment of the alphabet ring on a rotor |
| **Plugboard** (Steckerbrett) | Panel for swapping letter pairs |
| **Notch** (Kerbe) | Position that triggers next rotor advancement |
| **Rotor Order** (Walzenlage) | Arrangement of rotors left to right |
| **Initial Position** (Grundstellung) | Starting positions of rotors |
| **Step** (Schritt) | Single advancement of a rotor |
| **Double Stepping** | Anomaly where middle rotor steps twice |
| **Polyalphabetic Cipher** | Encryption using multiple substitution alphabets |

---

## Historical Notes

- The **Enigma M4** (Naval variant) used 4 rotors instead of 3
- Enigma was cracked by Polish mathematicians before WWII, led by Marian Rejewski
- Alan Turing and the team at Bletchley Park developed the **Bombe** machine to automate decryption
- Breaking Enigma is estimated to have shortened WWII by 2-4 years

---

## References

- [How did the Enigma Machine work?](https://www.youtube.com/watch?v=ybkkiGtJmkM)
- [Bletchley Park - Official Website](https://bletchleypark.org.uk/)
- [Crypto Museum - Enigma](https://www.cryptomuseum.com/crypto/enigma/)
