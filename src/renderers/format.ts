/**
 * format.ts — presentation helpers shared by the plain renderer and the Ink UI.
 * No React, no side effects — safe to import anywhere.
 */

import cliTruncate from 'cli-truncate';
import { formatTokens } from '../engine/tokens.ts';

export { formatTokens };

/** One-line preview of a possibly-multiline model response. */
export function preview(text: string, width = 150): string {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return cliTruncate(oneLine, width, { position: 'end' });
}

/** Human-readable duration from milliseconds (e.g. "1.5s", "2m 03s"). */
export function formatDuration(ms: number): string {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${String(rem).padStart(2, '0')}s`;
}

/** ASCII progress bar, `filled/total` of `width` cells. */
export function bar(fraction: number, width = 20): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  const filled = Math.round(clamped * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}
