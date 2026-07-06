/**
 * manifest.ts — assembly order for the single-file game build.
 *
 * Each entry is a PART of the build output:
 *  - `title: null`   → no PART banner (header/game-info/footer, and dev modules
 *                      which continue PART 0).
 *  - `dir`           → every *.md in the dir except README.md, sorted by name.
 *  - `file`          → exactly one file.
 *  - `devOnly: true` → included ONLY in LLM-TYCOON-DEV.md.
 *
 * Paths are relative to repo root. The game-content dirs live under `game/`.
 */

export interface ManifestEntry {
  title: string | null;
  dir?: string;
  file?: string;
  devOnly?: boolean;
}

export const MANIFEST: readonly ManifestEntry[] = [
  { title: null, file: 'game/meta/00_header.md' },
  { title: null, file: 'game/meta/01_game_info.md' },
  { title: 'PART 0 — GAME ENGINE (SYSTEM)', dir: 'game/system' },
  { title: null, dir: 'game/dev', devOnly: true },
  { title: 'PART 1 — GLOSSARY', file: 'game/shared/glossary.md' },
  { title: 'PART 2 — DEFINITIONS', dir: 'game/definitions' },
  { title: 'PART 3 — RULES', dir: 'game/rules' },
  { title: 'PART 4 — CONTENT (GAME DATA)', dir: 'game/content' },
  { title: 'PART 5 — SCENARIO', dir: 'game/scenarios' },
  { title: 'PART 6 — USER INTERFACE (SCREENS)', dir: 'game/ui' },
  { title: null, file: 'game/meta/99_footer.md' },
];

export interface BuildTarget {
  file: string;
  includeDev: boolean;
  label: string;
}

export const TARGETS: readonly BuildTarget[] = [
  { file: 'LLM-TYCOON.md', includeDev: false, label: 'bản chuẩn (người chơi)' },
  { file: 'LLM-TYCOON-DEV.md', includeDev: true, label: 'bản DEV (kèm Dev Mode)' },
];
