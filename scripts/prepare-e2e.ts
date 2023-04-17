import { resolve } from 'path';
import fse from 'fs-extra';
import * as execa from 'execa';

const exampleDir = resolve(__dirname, '../e2e/playground/basic');

const ROOT = resolve(__dirname, '..');

const defaultExecaOpts = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  if (!fse.existsSync(resolve(__dirname, '../dist'))) {
    // pnpm build
    execa.commandSync('pnpm build', {
      cwd: ROOT,
      ...defaultExecaOpts
    });
  }
  execa.commandSync('npx playwright install', {
    cwd: ROOT,
    ...defaultExecaOpts
  });
  execa.commandSync('pnpm dev', {
    cwd: exampleDir,
    ...defaultExecaOpts
  });
}

prepareE2E();
