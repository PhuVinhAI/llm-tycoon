import { expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { assemblePackage, type PackageIO } from '../src/build/assemble.ts';
import { runBuild } from '../src/build/build.ts';
import { MANIFEST, PACKAGE_NAME } from '../src/build/manifest.ts';
import { zipPackage } from '../src/build/zip.ts';
import { PATHS } from '../src/config/paths.ts';

const io: PackageIO = {
  read: (path) => readFileSync(join(PATHS.root, path), 'utf8'),
  list: (path) =>
    readdirSync(join(PATHS.root, path), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name),
};
const files = assemblePackage(MANIFEST, io, '1.0.0');
const readme = files.find((file) => file.path === 'README.md')?.content ?? '';

test('one root README maps every shipped file and all routing paths exist', () => {
  const paths = new Set(files.map((file) => file.path));
  expect(files.filter((file) => /(^|\/)README\.md$/.test(file.path)).map((f) => f.path)).toEqual([
    'README.md',
  ]);
  expect(readme).toContain('## Complete file map');
  for (const file of files) {
    expect(readme).toContain(`[${file.path}](${file.path})`);
  }
  for (const file of files.filter((file) => file.path.endsWith('.md'))) {
    for (const match of file.content.matchAll(/`((?:[\w-]+\/)*[\w.-]+\.(?:md|json|py))`/g)) {
      const path = match[1] ?? '';
      if (
        !path.startsWith('session/') &&
        !['save.json', 'events.jsonl', 'package-index.json'].includes(path)
      ) {
        expect(paths.has(path)).toBe(true);
      }
    }
  }
  for (const group of ['rules', 'content', 'scenarios', 'ui', 'runtime']) {
    for (const name of io
      .list(`game/${group}`)
      .filter((name) => /\.(md|json|py)$/.test(name) && name !== 'README.md')) {
      expect(paths.has(`${group}/${name}`)).toBe(true);
    }
  }
  const projectRules =
    files.find((file) => file.path === 'rules/08_model_projects.md')?.content ?? '';
  const routingRows = readme
    .split('\n')
    .filter((line) => line.startsWith('|'))
    .join('\n');
  for (const match of routingRows.matchAll(/\*\*([^*]+)\*\*/g)) {
    expect(projectRules).toContain(`## ${match[1]}`);
  }
});

test('index hashes describe final content including the generated README map', () => {
  const index = JSON.parse(
    files.find((file) => file.path === 'package-index.json')?.content ?? '{}',
  );
  expect(index.version).toBe('1.0.0');
  expect(index.entrypoint).toBe('README.md');
  expect(index.files.length).toBe(files.length - 1);
  for (const record of index.files) {
    const actual = files.find((file) => file.path === record.path);
    expect(actual).toBeDefined();
    expect(record.bytes).toBe(Buffer.byteLength(actual?.content ?? ''));
    expect(record.sha256).toBe(
      createHash('sha256')
        .update(actual?.content ?? '')
        .digest('hex'),
    );
    for (const section of record.sections) {
      const line = actual?.content.split('\n')[section.line - 1] ?? '';
      expect(line).toBe(`${'#'.repeat(section.level)} ${section.heading}`);
    }
  }
});

test('release keeps full game content and excludes mutable state and retired prompt formats', () => {
  expect(files.some((file) => file.path === 'engine.md')).toBe(true);
  expect(files.some((file) => file.path === 'reference/terms.md')).toBe(true);
  for (const file of files) {
    expect(file.path).not.toMatch(
      /(^session\/|^(dev|system|shared|definitions|meta)\/|runtime\/(state|exports|archives)\/|screens_(desktop|mobile)|00_header|99_footer|example_turn)/,
    );
    if (file.path.endsWith('.md')) {
      expect(file.content).not.toContain('<!--');
      expect(file.content).not.toMatch(
        /SAVE [Bb]lock|UI Profile|llm_unlocked|v0\.4|Time and Tuens/,
      );
    }
  }
  expect(files.some((f) => f.path === 'content/08_events_calendar.md')).toBe(true);
  expect(files.some((f) => f.path === 'content/15_papers.md')).toBe(true);
  const scenario = JSON.parse(
    files.find((f) => f.path === 'scenarios/home_lab.json')?.content ?? '{}',
  );
  expect(scenario.resources).toEqual({ cash: 10000, researchPoints: 0, fame: 0 });
  expect(scenario.clock).toEqual({ date: '2013-01', turn: 1 });
  expect(scenario.hardware.inventory).toEqual([]);
});

test('ZIP is deterministic and rejects unsafe or duplicate paths', () => {
  expect(zipPackage(files)).toEqual(zipPackage(assemblePackage(MANIFEST, io, '1.0.0')));
  for (const path of ['../save.json', '/absolute.md', 'x\\file.md', 'x/./file.md', 'x//file.md']) {
    expect(() => zipPackage([{ path, content: '', topic: '' }])).toThrow();
  }
  const one = { path: 'README.md', content: 'one', topic: 'one' };
  expect(() => zipPackage([one, one])).toThrow();
});

test('Python verifies CRC, extracts the release and saves/resumes using the shipped helper', () => {
  const directory = mkdtempSync(join(tmpdir(), 'llmt-package-'));
  try {
    const archive = join(directory, 'game.zip');
    writeFileSync(archive, zipPackage(files));
    const script = `
import importlib.util, json, pathlib, sys, zipfile
root = pathlib.Path(sys.argv[2]) / 'extracted'
with zipfile.ZipFile(sys.argv[1]) as archive:
    assert archive.testzip() is None
    assert archive.namelist().count('README.md') == 1
    archive.extractall(str(root))
spec = importlib.util.spec_from_file_location('tycoon', root / 'runtime/state.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
runtime = module.runtime
assert runtime.root == root / 'session'
assert not (root / 'session').exists()
index = json.loads((root / 'package-index.json').read_text(encoding='utf-8'))
for record in index['files']:
    for section in record['sections']:
        selected = module.read_document(record['path'], section['heading'])
        assert selected.startswith('#' * section['level'] + ' ' + section['heading'])
wizard = module.read_document('ui/views.md', 'S12 — Project Wizard')
assert '## S13' not in wizard
assert 'argparse' not in (root / 'runtime/state.py').read_text(encoding='utf-8')
state = runtime.commit(module.new_state('Player', 'Studio', 'vi'),
    {'actionId': 'new', 'type': 'new_game', 'label': 'New Game', 'date': '2013-01', 'turn': 1}, 0)
save = runtime.export_bundle()
resumed = module.Runtime(root / 'resumed').import_save(save)
assert resumed['resources'] == state['resources']
assert resumed['meta']['runId'] == state['meta']['runId']
assert len(module.Runtime(root / 'resumed').events()) == 2
assert not (root / 'runtime/state').exists()
print('verified')
`;
    const python = process.platform === 'win32' ? ['py', '-3.7'] : ['python3'];
    const result = Bun.spawnSync([...python, '-c', script, archive, directory]);
    expect(result.stderr.toString()).toBe('');
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString().trim()).toBe('verified');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('built artifact exactly matches current sources and root README', () => {
  expect(
    readFileSync(join(PATHS.root, 'build', `${PACKAGE_NAME}.zip`)).equals(zipPackage(files)),
  ).toBe(true);
  expect(readFileSync(join(PATHS.root, 'build', PACKAGE_NAME, 'README.md'), 'utf8')).toBe(readme);
});

test('rebuild removes retired package files while preserving session data', () => {
  const temporary = mkdtempSync(join(tmpdir(), 'llmt-rebuild-'));
  const root = join(temporary, 'package');
  try {
    runBuild({ outputRoot: root });
    const previous = JSON.parse(readFileSync(join(root, 'package-index.json'), 'utf8'));
    previous.files.push({ path: 'retired.md' });
    writeFileSync(join(root, 'retired.md'), 'retired instructions');
    writeFileSync(join(root, 'package-index.json'), JSON.stringify(previous));
    const session = join(root, 'session');
    mkdirSync(session, { recursive: true });
    writeFileSync(join(session, 'player-progress.json'), 'preserved progress');
    writeFileSync(join(root, 'unmanaged.txt'), 'preserved user file');
    runBuild({ outputRoot: root });
    expect(() => readFileSync(join(root, 'retired.md'))).toThrow();
    expect(readFileSync(join(session, 'player-progress.json'), 'utf8')).toBe('preserved progress');
    expect(readFileSync(join(root, 'unmanaged.txt'), 'utf8')).toBe('preserved user file');
    expect(readFileSync(join(temporary, 'package.zip')).equals(zipPackage(files))).toBe(true);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
