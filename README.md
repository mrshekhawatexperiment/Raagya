# Raagya — Web Harmonium 🎵
### रागया · The Living Harmonium

**Made by: Devendra Singh**  
**Website: https://raagyamusic.free.nf**  
**Email: mrshekhewatexperiments@gmail.com**  
**© 2025 Raagya · All Rights Reserved**

---

## About Raagya

Raagya (*Raag* = Indian melody + *Pragya* = wisdom) is a handcrafted web harmonium built entirely with HTML, CSS, and the Web Audio API. No plugins, no frameworks, no server needed. Every instrument sound is synthesized from scratch in real time inside your browser.

---

## What Makes Each Instrument Unique

| Instrument | How it's synthesized |
|------------|---------------------|
| **Harmonium** | 3 reed layers detuned from each other (creates real "beating" chorus), 9 additive partials per reed, slow bellows-pressure vibrato |
| **Bansuri** | Pure sine + minimal overtones + filtered breath noise layer, fast flutter vibrato — sounds airy and hollow |
| **Sarangi** | Odd harmonics dominant (bowed-string characteristic), bow noise, slow tremolo from bow pressure — gritty and rich |
| **Sitar** | Sharp attack, bright plucked partials, jawari buzz noise burst, sympathetic string ring — percussive and metallic |

---

## Full Keyboard Map

### Octave 3 (Home Row + Top Row blacks)
| White | Key | Black | Key |
|-------|-----|-------|-----|
| C3    | A   | C#3   | W   |
| D3    | S   | D#3   | E   |
| E3    | D   |       |     |
| F3    | F   | F#3   | T   |
| G3    | G   | G#3   | Y   |
| A3    | H   | A#3   | U   |
| B3    | J   |       |     |

### Octave 4 (Right home row + bottom row)
| White | Key | Black | Key |
|-------|-----|-------|-----|
| C4    | K   | C#4   | O   |
| D4    | L   | D#4   | P   |
| E4    | ;   |       |     |
| F4    | '   | F#4   | [   |
| G4    | ]   | G#4   | \   |
| A4    | Z   | A#4   | X   |
| B4    | C   |       |     |

### Octave 5 (Bottom row + Number row)
| White | Key | Black | Key |
|-------|-----|-------|-----|
| C5    | V / 1 | C#5 | Q / 2 |
| D5    | B / 3 | D#5 | R / 4 |
| E5    | N / 5 |     |       |
| F5    | M / 6 | F#5 | I / 7 |
| G5    | , / 8 | G#5 | / / 9 |
| A5    | . / 0 | A#5 | -     |
| B5    | =     |     |       |

### Special Keys
| Key | Action |
|-----|--------|
| `R` | Record / Stop recording |
| `P` | Play back recording |
| `X` | Clear recording |
| `↑` | Octave up |
| `↓` | Octave down |
| `Space` | Stop all drones |

---

## Project Structure

```
raagya/
├── index.html          ← Main page (self-contained)
├── css/
│   └── style.css       ← Deep dark obsidian gold theme, light mode, animations
├── js/
│   ├── audio.js        ← Realistic sound engine (4 unique instrument voices)
│   ├── keyboard.js     ← 36-key layout, number + letter + symbol key support
│   ├── ui.js           ← Visualizer, bellows, particles, sliders, drone, theme
│   └── app.js          ← Main orchestrator, record/playback system
├── README.md           ← This file
├── LICENSE.txt         ← Copyright notice
├── netlify.toml        ← Netlify deploy config
└── vercel.json         ← Vercel deploy config
```

---

## Copyright

© 2025 Raagya — Made by **Devendra Singh**  
Website: https://raagyamusic.free.nf  
Email: mrshekhewatexperiments@gmail.com

All Rights Reserved. This software, its code, design, brand name, and audio engine are the exclusive intellectual property of Devendra Singh / Raagya. Unauthorized reproduction, distribution, or commercial use is strictly prohibited without prior written permission.
