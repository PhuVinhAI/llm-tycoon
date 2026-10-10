import { runBuild } from './build.ts';

runBuild({ keepComments: process.argv.includes('--keep-comments') });
