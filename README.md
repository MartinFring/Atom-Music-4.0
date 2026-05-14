<p align="center">
  <img src="assets/youtube-music.png" width="120" alt="Atom Music 4.0 Logo" />
</p>

<h1 align="center">Atom Music 4.0 — Arch Linux Build</h1>

<p align="center">
  <strong>An optimized fork of <a href="https://github.com/IsSlashy/Atom-Music-4.0">Atom Music 4.0</a> with streamlined Arch Linux support</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Electron-40.6.1-47848F?logo=electron&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Solid.js-1.9-2C4F7C?logo=solid&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite_(Rolldown)-7.x-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## About This Fork

This is a fork of the original **Atom Music 4.0** project, optimized specifically for **Arch Linux** users. It provides:

- ✅ **PKGBUILD** for seamless Arch Linux installation via `pacman`
- ✅ **Streamlined build process** for Arch systems
- ✅ **Cleaner installation scripts** with better package management
- ✅ **All features** from the original Atom Music 4.0

For the full original documentation and feature breakdown, see the [Atom Music 4.0 repository](https://github.com/IsSlashy/Atom-Music-4.0).

---

## What is Atom Music 4.0?

Atom Music 4.0 is a **ground-up redesign** of the YouTube Music Desktop experience, originally forked from [pear-desktop](https://github.com/pear-devs/pear-desktop) (30k+ stars). Every layer of the original app has been rebuilt with:

- **Modern UI Framework** — Solid.js reactive components with glassmorphic design
- **Superior Performance** — 3.5x faster builds, 30-50% less CPU usage, intelligent caching
- **Latest Tech Stack** — Electron 40.6.1, TypeScript 5.9, Rolldown-Vite 7.x, FFmpeg WASM
- **31 Built-in Plugins** — Ad blocking, Discord integration, ambient mode, precise volume, and more
- **Full TypeScript** — Strict mode throughout with complete type safety

This is not a fork with patches. This is a **complete revamp**.

---

## Installation

### Prerequisites

- **Arch Linux** (or compatible distribution)
- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 10
- `base-devel` package group (for building): `sudo pacman -S base-devel`

---

### Option 1: Install via PKGBUILD (Recommended) ⭐

The cleanest method for Arch Linux users:

```bash
git clone https://github.com/MartinFring/Atom-Music-4.0.git
cd Atom-Music-4.0
makepkg -si
```

This will:
- ✅ Build the application
- ✅ Install to `/opt/youtube-music/`
- ✅ Create symlink: `/usr/bin/youtube-music`
- ✅ Register desktop entry and icon
- ✅ Make available as `youtube-music` command

**Uninstall:**
```bash
sudo pacman -R youtube-music
```

Or to also remove unused dependencies:
```bash
sudo pacman -Rs youtube-music
```

---

### Option 2: Build from Source (Manual)

For development or if PKGBUILD doesn't work for your setup:

```bash
git clone https://github.com/MartinFring/Atom-Music-4.0.git
cd Atom-Music-4.0
pnpm install
pnpm dist:linux
sudo ./install-arch.sh
```

**Manual Uninstall:**
```bash
sudo rm -rf /opt/youtube-music
sudo rm /usr/bin/youtube-music
sudo rm /usr/share/applications/youtube-music.desktop
sudo rm /usr/share/pixmaps/youtube-music.png
sudo update-desktop-database
```

---

### Option 3: Development Build (Hot Reload)

If you want to contribute or test changes:

```bash
git clone https://github.com/MartinFring/Atom-Music-4.0.git
cd Atom-Music-4.0
pnpm install
pnpm dev        # Launches with hot reload on code changes
```

---

## Architecture

```
src/
├── index.ts              # Main process (1100+ lines)
├── renderer.ts           # Renderer with glassmorphic UI (1600+ lines)
├── preload.ts            # Secure API bridge
├── config/               # Configuration management + defaults
├── loader/               # Context-aware plugin loader (main/renderer/preload/menu)
├── plugins/              # 31 built-in plugins
│   ├── adblocker/        # Cached ad blocking engine
│   ├── ambient-mode/     # Dynamic canvas background
│   ├── discord/          # Rich Presence
│   ├── downloader/       # FFmpeg WASM audio converter
│   ├── in-app-menu/      # Solid.js glassmorphic menu
│   ├── performance-improvement/  # CPU Tamer + RM3
│   └── ...
├── providers/            # Song info, controls, protocol handler
├── theme/                # Design tokens + global styles (28KB+)
├── types/                # Full TypeScript type definitions
├── utils/                # Shared utilities
└── i18n/                 # Internationalization resources

vite-plugins/
├── plugin-loader.mts     # AST-based context stripping
├── plugin-importer.mts   # Virtual module generation
└── i18n-importer.mts     # i18n compile-time bundling
```

---

## Features

### Performance Optimizations
| Metric | Improvement |
|--------|-------------|
| **Build Time** | ~3.5x faster (Rolldown-Vite) |
| **Ad Blocker Init** | ~10x faster (24h binary cache) |
| **Plugin Bundle Size** | ~40% smaller (context-stripped) |
| **Idle CPU Usage** | 30-50% reduction (CPU Tamer) |

### Built-in Plugins (31 total)
- 🛡️ **Ad Blocker** — Ghostery-based with 24h cache
- 🎨 **Ambient Mode** — Dynamic canvas backgrounds
- 🎮 **Discord** — Rich Presence integration
- 📥 **Downloader** — FFmpeg WASM MP3/FLAC/WAV conversion
- 🎵 **Precise Volume** — Mouse wheel + hotkey control with HUD
- 🚀 **Performance** — CPU Tamer + RM3 render throttling
- ⌨️ **Shortcuts** — Global hotkeys + MPRIS (Linux media keys)
- 📱 **Taskbar Media Control** — Windows/Linux media controls
- ... and 23 more utilities

### UI/UX
- **Glassmorphic Design** — Modern frosted glass aesthetic
- **Design Tokens** — Centralized theming system
- **Spring Animations** — Smooth 60fps interactions
- **Responsive Layout** — Adapts to window size
- **Dark Theme** — Eye-friendly dark-first palette

---

## License

MIT — See [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>Built with precision. Every pixel, every millisecond, every byte — optimized.</em>
</p>
