// npm install --save-dev ignore;
// npm install --save-dev archiver;

import { FilesIgnoreHelper } from '../utils/files-helpers';
import * as path from 'path';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { BmgCommandHelper } from './bmg-command-helper';
import * as vscode from 'vscode';
import { BmgCommand } from './bmg-command';
export class BmgArchiverCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.archiver');
  }
  Run() {
    if (vscode.workspace.rootPath != null) {
      BmgArchiverCommand.CreateArchive(vscode.workspace.rootPath);
    } else
      vscode.window.showInformationMessage(
        'You have to open a folder to run this command'
      );
  }
  public static CreateArchive(directoryPath = null) {
    var startTime = new Date();
    directoryPath = directoryPath == null ? __dirname : directoryPath;
    var ih = new FilesIgnoreHelper(directoryPath);
    var allIncludedFiles = ih.GetGitFilteredFiles();

    var zippath = path.join(
      path.join(directoryPath, '..'),
      path.basename(directoryPath) +
        '_' +
        startTime
          .toISOString()
          .replace(':', '-')
          .replace(':', '-') +
        '.zip'
    );

    var output = fs.createWriteStream(zippath);
    var archive = (<any>archiver)('zip', {
      zlib: {
        level: 9
      } // Sets the compression level.
    });

    archive.pipe(output);
    allIncludedFiles.forEach(function(file) {
      var abs_file = path.join(directoryPath, file);

      // add local file

      archive.append(fs.createReadStream(abs_file), {
        name: path.join(path.basename(directoryPath), file)
      });
    });

    archive.finalize();
    BmgCommandHelper.OpenInExplorer(zippath);
  }
}
