/** Explicit sources for the GPT-6 1.0 ZIP. Nothing is flattened. */
export interface ManifestEntry {
  source: string;
  target: string;
  directory?: boolean;
}

export const PACKAGE_NAME = 'LLM-TYCOON-GPT6';
export const MANIFEST: readonly ManifestEntry[] = [
  { source: 'game/package/00_entrypoint.md', target: 'README.md' },
  { source: 'game/meta/01_game_info.md', target: 'meta/01_game_info.md' },
  { source: 'game/system', target: 'system', directory: true },
  { source: 'game/shared/glossary.md', target: 'shared/glossary.md' },
  { source: 'game/definitions', target: 'definitions', directory: true },
  { source: 'game/rules', target: 'rules', directory: true },
  { source: 'game/content', target: 'content', directory: true },
  { source: 'game/scenarios', target: 'scenarios', directory: true },
  { source: 'game/ui', target: 'ui', directory: true },
  { source: 'game/runtime', target: 'runtime', directory: true },
];
