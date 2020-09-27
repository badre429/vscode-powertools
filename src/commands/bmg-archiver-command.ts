// npm install --save-dev ignore;
// npm install --save-dev archiver;

import { FilesIgnoreHelper } from '../utils/files-helpers';
import * as path from 'path';
// import * as fs from 'fs';
// import * as archiver from 'archiver';
const zl = require('zip-lib');
// import * as zl from 'zip-lib';
import { BmgCommandHelper } from './bmg-command-helper';
import * as vscode from 'vscode';
import { BmgCommand } from './bmg-command';
import { execSync } from 'child_process';
// const { exec, execSync } = require('child_process');

export class BmgArchiverCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.archiver');
  }
  Run() {
    if (vscode.workspace.rootPath != null) {
      BmgArchiverCommand.CreateArchive(vscode.workspace.rootPath);
    } else {
      vscode.window.showInformationMessage(
        'You have to open a folder to run this command'
      );
    }
  }
  public static CreateArchive(directoryPath = null) {
    var startTime = new Date();
    directoryPath = directoryPath == null ? __dirname : directoryPath;
    var allIncludedFiles = [];
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
    // the *entire* stdout and stderr (buffered)
    vscode.window.showInformationMessage(
      'start compression of ' + allIncludedFiles.length + ' files'
    );
    var zippath = path.join(
      path.join(directoryPath, '..'),
      path.basename(directoryPath) +
        '_' +
        startTime.toISOString().replace(':', '-').replace(':', '-') +
        '.zip'
    );

    const zip = new zl.Zip();
    // Adds a file from the file system

    allIncludedFiles.forEach((file) => {
      var abs_file = path.join(directoryPath, file);

      zip.addFile(abs_file, path.join(path.basename(directoryPath), file));
    });
    // Adds a folder from the file system, putting its contents at the root of archive

    // Generate zip file.
    zip.archive(zippath).then(
      function () {
        console.log('done');
        BmgCommandHelper.OpenInExplorer(zippath);
      },
      function (err) {
        console.log(err);
      }
    );

    // var output = fs.createWriteStream(zippath);
    // var archive = (<any>archiver)('zip', {
    //   zlib: {
    //     level: 9,
    //   }, // Sets the compression level.
    // });
    // output.on('close', function () {
    //   BmgCommandHelper.OpenInExplorer(zippath);
    // });

    // archive.pipe(output);
    // allIncludedFiles.forEach(function (file) {
    //   var abs_file = path.join(directoryPath, file);

    //   archive.file(abs_file, {
    //     name: path.join(path.basename(directoryPath), file),
    //   });
    // });

    // archive.finalize();
  }
}
