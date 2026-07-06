/**
 * tests/config.test.js — verifies the bug fixes to loadEnv:
 *  - Single OR double surrounding quotes are stripped (previously caused
 *    `parseInt('"100"') → NaN` since quotes ended up in the value).
 *  - Comment lines and blank lines are skipped.
 *  - Lines missing `=` are ignored.
 *
 * Uses temp files under `os.tmpdir()` so the real repo's .env is never
 * touched.
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadEnv } from '../config.js';

function withTempEnv(content, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'llmt-cfg-test-'));
  const path = join(dir, '.env');
  writeFileSync(path, content);
  try {
    return fn(path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('parses simple KEY=value', () => {
  withTempEnv('FOO=bar\nBAZ=qux\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.FOO, 'bar');
    assert.equal(env.BAZ, 'qux');
  });
});

test('strips double quotes (previous bug: parseInt("100") was NaN)', () => {
  withTempEnv('AI_RUNTIME_BASE_URL="https://api.example.com/v1"\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.AI_RUNTIME_BASE_URL, 'https://api.example.com/v1');
    assert.ok(!env.AI_RUNTIME_BASE_URL.startsWith('"'));
    assert.ok(!env.AI_RUNTIME_BASE_URL.endsWith('"'));
  });
});

test('strips single quotes', () => {
  withTempEnv("AI_RUNTIME_BASE_URL='https://api.example.com/v1'\n", (path) => {
    const env = loadEnv(path);
    assert.equal(env.AI_RUNTIME_BASE_URL, 'https://api.example.com/v1');
  });
});

test('strips trailing whitespace', () => {
  withTempEnv('FOO=bar    \n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.FOO, 'bar');
  });
});

test('skips full-line comments', () => {
  withTempEnv('# header comment\n# another comment\nFOO=bar\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.FOO, 'bar');
    assert.equal(Object.keys(env).length, 1);
  });
});

test('handles blank lines', () => {
  withTempEnv('FOO=bar\n\n\nBAZ=qux\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.FOO, 'bar');
    assert.equal(env.BAZ, 'qux');
  });
});

test('ignores lines without `=`', () => {
  withTempEnv('FOO=bar\nGARBAGE_NO_EQUALS\nBAZ=qux\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.FOO, 'bar');
    assert.equal(env.BAZ, 'qux');
    assert.equal(env.GARBAGE_NO_EQUALS, undefined);
  });
});

test('preserves spaces inside quoted values', () => {
  withTempEnv('NOTE="hello world"\n', (path) => {
    const env = loadEnv(path);
    assert.equal(env.NOTE, 'hello world');
  });
});

test('returns empty env object when file missing (lets callers decide)', () => {
  // Bug-fix history: the previous version called process.exit(1) on missing
  // file, which broke `npm run history` (and any other non-AI code path)
  // when the user hadn't set up an `.env` yet. We now return {} and let
  // config-aware callers (RUNTIME.apiKey getter) raise if a key is needed.
  const dir = mkdtempSync(join(tmpdir(), 'llmt-cfg-test-'));
  try {
    const env = loadEnv(join(dir, 'nonexistent.env'));
    assert.deepEqual(env, {});
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
