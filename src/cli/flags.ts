/**
 * flags.ts — meow CLI definition + subcommand/mode resolution.
 *
 * Grammar:
 *   llm-tycoon build [--keep-comments]
 *   llm-tycoon play  [--new|--resume|--continue] [--plain] [--verbose] [session-id]
 *   llm-tycoon history
 *   llm-tycoon            (no subcommand → play, auto-detect resume)
 */

import meow from 'meow';
import type { RunMode } from '../engine/events.ts';

export type Command = 'build' | 'play' | 'history';

export interface ParsedCli {
  command: Command;
  /** For play: the run mode, or 'auto' (resume if a save exists, else new). */
  mode: RunMode | 'auto';
  keepComments: boolean;
  plain: boolean;
  verbose: boolean;
  sessionId: string | undefined;
}

export const cli = meow(
  `
  Sử dụng
    $ llm-tycoon <lệnh> [tuỳ chọn]

  Lệnh
    build            Ghép tài liệu game thành build/LLM-TYCOON.md
    play             Chạy play-test (mặc định) — UI React Ink
    history          In lịch sử các ván (không gọi AI)

  Tuỳ chọn
    --new            Bắt đầu ván mới
    --resume         Tiếp tục ván đang lưu (game_state.json)
    --continue, -c   Chơi tiếp từ ván trước (save + bài học)
    --plain          Ép chế độ console (bỏ qua Ink) — dùng cho CI
    --verbose, -v    In nhiều log hơn
    --keep-comments  (build) Giữ comment tiếng Việt — chỉ để review

  Ví dụ
    $ llm-tycoon build
    $ llm-tycoon play --new
    $ llm-tycoon history
`,
  {
    importMeta: import.meta,
    flags: {
      new: { type: 'boolean', default: false },
      resume: { type: 'boolean', default: false },
      continue: { type: 'boolean', default: false, shortFlag: 'c' },
      plain: { type: 'boolean', default: false },
      verbose: { type: 'boolean', default: false, shortFlag: 'v' },
      keepComments: { type: 'boolean', default: false },
    },
  },
);

/** Resolve argv into a structured command + mode, validating exclusivity. */
export function parseCli(argv = cli): ParsedCli {
  const [rawCommand, maybeId] = argv.input;
  const command: Command = rawCommand === 'build' || rawCommand === 'history' ? rawCommand : 'play';

  const f = argv.flags;
  const chosen = [f.new && 'new', f.resume && 'resume', f.continue && 'continue'].filter(
    Boolean,
  ) as RunMode[];
  if (chosen.length > 1) {
    console.error('❌ Chỉ dùng một trong: --new, --resume, --continue');
    process.exit(1);
  }

  const mode: RunMode | 'auto' = chosen[0] ?? 'auto';

  return {
    command,
    mode,
    keepComments: f.keepComments,
    plain: f.plain,
    verbose: f.verbose,
    sessionId: maybeId,
  };
}
