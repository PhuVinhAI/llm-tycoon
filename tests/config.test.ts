/**
 * config.test.ts — loadEnv quote-stripping / comment / blank-line handling.
 * Uses temp files under os.tmpdir() so the real .env is never touched.
 */
import { expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadEnv } from '../src/config/env.ts';

function withTempEnv<T>(content: string, fn: (path: string) => T): T {
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
    expect(env.FOO).toBe('bar');
    expect(env.BAZ).toBe('qux');
  });
});

test('strips double quotes', () => {
  withTempEnv('AI_RUNTIME_BASE_URL="https://api.example.com/v1"\n', (path) => {
    const env = loadEnv(path);
    expect(env.AI_RUNTIME_BASE_URL).toBe('https://api.example.com/v1');
  });
});

test('strips single quotes', () => {
  withTempEnv("AI_RUNTIME_BASE_URL='https://api.example.com/v1'\n", (path) => {
    const env = loadEnv(path);
    expect(env.AI_RUNTIME_BASE_URL).toBe('https://api.example.com/v1');
  });
});

test('strips trailing whitespace', () => {
  withTempEnv('FOO=bar    \n', (path) => {
    expect(loadEnv(path).FOO).toBe('bar');
  });
});

test('skips full-line comments', () => {
  withTempEnv('# header comment\n# another comment\nFOO=bar\n', (path) => {
    const env = loadEnv(path);
    expect(env.FOO).toBe('bar');
    expect(Object.keys(env).length).toBe(1);
  });
});

test('handles blank lines', () => {
  withTempEnv('FOO=bar\n\n\nBAZ=qux\n', (path) => {
    const env = loadEnv(path);
    expect(env.FOO).toBe('bar');
    expect(env.BAZ).toBe('qux');
  });
});

test('ignores lines without `=`', () => {
  withTempEnv('FOO=bar\nGARBAGE_NO_EQUALS\nBAZ=qux\n', (path) => {
    const env = loadEnv(path);
    expect(env.FOO).toBe('bar');
    expect(env.BAZ).toBe('qux');
    expect(env.GARBAGE_NO_EQUALS).toBeUndefined();
  });
});

test('preserves spaces inside quoted values', () => {
  withTempEnv('NOTE="hello world"\n', (path) => {
    expect(loadEnv(path).NOTE).toBe('hello world');
  });
});

test('returns empty env object when file missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'llmt-cfg-test-'));
  try {
    expect(loadEnv(join(dir, 'nonexistent.env'))).toEqual({});
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
