import { FilesIgnoreHelper } from './files-helpers';
import * as stringify from 'json-stable-stringify';

import * as path from 'path';
import * as fs from 'fs';
// import * as archiver from 'archiver';
const zl = require('zip-lib');
// import * as zl from 'zip-lib';
import { execSync } from 'child_process';
// const { exec, execSync } = require('child_process');

export function ListDirectoryFiles(directoryPath: any) {
  directoryPath = directoryPath == null ? __dirname : directoryPath;
  var allIncludedFiles: string[] = [];
  try {
    var stdout = [
      ...execSync('git ls-files', {
        cwd: directoryPath,
      })
        .toString()
        .split('\n'),
      ...execSync('git ls-files -o  --exclude-standard', {
        cwd: directoryPath,
      })
        .toString()
        .split('\n'),
    ];
    allIncludedFiles = stdout;
  } catch (error) {}
  if (allIncludedFiles.length == 0) {
    var ih = new FilesIgnoreHelper(directoryPath);
    allIncludedFiles = ih.GetGitFilteredFiles();
  }
  return { allIncludedFiles, directoryPath };
}

export function saveJsonOjbect(ur: string, i18n: any) {
  fs.writeFileSync(
    ur,
    stringify(i18n, {
      space: '  ',
      cmp: (a, b) => {
        if (a != null && b != null) {
          return a.key.toLowerCase() > b.key.toLowerCase() ? 1 : -1;
        } else return a.key > b.key ? 1 : -1;
      },
    })
  );
}
