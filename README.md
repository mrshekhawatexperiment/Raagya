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

## How to Publish to raagyamusic.free.nf

You've chosen InfinityFree (free.nf domain). Here's the exact process:

### Step 1: Sign up at InfinityFree
1. Go to **https://infinityfree.com**
2. Create a free account with your email: mrshekhewatexperiments@gmail.com
3. Click **"Create Account"**

### Step 2: Create a hosting account
1. In your dashboard, click **"Create Account"**
2. Choose a subdomain — type `ragyamusic` → it becomes `raagyamusic.free.nf`
3. Wait 5-10 minutes for activation

### Step 3: Upload files
**Option A — File Manager (easiest):**
1. Go to your InfinityFree control panel
2. Click **"File Manager"** → navigate to `htdocs` folder
3. Delete any default files
4. Upload ALL files from this ZIP keeping the folder structure:
   - `index.html` → directly in `htdocs/`
   - `css/style.css` → in `htdocs/css/`
   - `js/audio.js` etc → in `htdocs/js/`

**Option B — FTP (FileZilla):**
1. Download FileZilla from filezilla-project.org
2. Use the FTP credentials from your InfinityFree control panel
3. Connect and upload the `raagya/` contents to `htdocs/`

### Step 4: Access your site
Visit: **https://raagyamusic.free.nf**

Your Raagya harmonium is now live! 🎵

---

## Alternative Free Hosts (if InfinityFree is slow)

| Host | URL | Notes |
|------|-----|-------|
| **Netlify** | netlify.com | Fastest, drag & drop, free SSL |
| **GitHub Pages** | pages.github.com | Free forever, needs GitHub account |
| **Vercel** | vercel.com | Instant deploy, free tier |
| **Cloudflare Pages** | pages.cloudflare.com | Global CDN, totally free |

For Netlify (recommended): Just drag the raagya folder onto netlify.com and it deploys in 30 seconds.

---

## Copyright

© 2025 Raagya — Made by **Devendra Singh**  
Website: https://raagyamusic.free.nf  
Email: mrshekhewatexperiments@gmail.com

All Rights Reserved. This software, its code, design, brand name, and audio engine are the exclusive intellectual property of Devendra Singh / Raagya. Unauthorized reproduction, distribution, or commercial use is strictly prohibited without prior written permission.
