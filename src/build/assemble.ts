/** Build separate files and generate the root README's complete inventory. */
import { createHash } from 'node:crypto';
import type { ManifestEntry } from './manifest.ts';

export interface PackageIO {
  read(path: string): string;
  list(directory: string): string[];
}

export interface PackageFile {
  path: string;
  content: string;
  topic: string;
}

export function clean(markdown: string, keepComments = false): string {
  const body = keepComments ? markdown : markdown.replace(/<!--[\s\S]*?-->/g, '');
  return `${body
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

export function assemblePackage(
  manifest: readonly ManifestEntry[],
  io: PackageIO,
  version: string,
  keepComments = false,
): PackageFile[] {
  const files: PackageFile[] = [];
  for (const entry of manifest) {
    const paths = entry.directory
      ? io
          .list(entry.source)
          .filter((name) => /\.(md|json|py)$/.test(name) && name !== 'README.md')
          .sort()
      : [''];
    for (const name of paths) {
      const source = name ? `${entry.source}/${name}` : entry.source;
      const path = name ? `${entry.target}/${name}` : entry.target;
      const raw = io.read(source).replace(/\r\n/g, '\n');
      const content = source.endsWith('.md') ? clean(raw, keepComments) : raw;
      const topic = source.endsWith('.md')
        ? (content.match(/^# (.+)$/m)?.[1] ?? path)
        : source.endsWith('.py')
          ? 'Python state, transactions, import, export and history'
          : 'Machine-readable Home Lab starting state';
      files.push({ path, content, topic });
    }
  }
  files.sort((a, b) => a.path.localeCompare(b.path, 'en'));
  const readme = files.find((file) => file.path === 'README.md');
  if (!readme) throw new Error('Package must include a root README.md');
  const map = [
    '\n## Complete file map\n',
    'Every shipped file is listed here. Read a linked document only when its topic is relevant.\n',
    '| File | Purpose |',
    '|---|---|',
    ...files.map((file) => `| [${file.path}](${file.path}) | ${file.topic.replace(/\|/g, '/')} |`),
    '| [package-index.json](package-index.json) | Release version, paths, sizes and SHA-256 hashes |',
    '\nCreated during play (excluded from the release): \x60session/state/save.json\x60, \x60session/state/events.jsonl\x60, \x60session/state/transaction.json\x60, \x60session/exports/\x60 and \x60session/archives/\x60.\n',
  ];
  readme.content += `${map.join('\n')}\n`;
  const index = {
    game: 'LLM TYCOON',
    version,
    entrypoint: 'README.md',
    schema: 'llm-tycoon.package.v1',
    files: files.map((file) => ({
      path: file.path,
      topic: file.topic,
      sections: file.path.endsWith('.md') ? markdownSections(file.content) : [],
      bytes: Buffer.byteLength(file.content),
      sha256: createHash('sha256').update(file.content).digest('hex'),
    })),
  };
  files.push({
    path: 'package-index.json',
    topic: 'Release inventory',
    content: `${JSON.stringify(index, null, 2)}\n`,
  });
  return files;
}

/** Heading inventory for Python lookup; fenced code is not document structure. */
function markdownSections(
  content: string,
): Array<{ heading: string; level: number; line: number }> {
  const sections: Array<{ heading: string; level: number; line: number }> = [];
  let fence: string | undefined;
  for (const [index, line] of content.split('\n').entries()) {
    const marker = line.match(/^\s*([`~]{3,})/)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = undefined;
      continue;
    }
    if (fence) continue;
    const found = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (found?.[1] && found[2]) {
      sections.push({ heading: found[2], level: found[1].length, line: index + 1 });
    }
  }
  return sections;
}
