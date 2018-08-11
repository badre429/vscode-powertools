'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BmgArchiverCommand } from './commands/bmg-archiver-command';
import { ConfigLoader } from './utils/solution-loader';
import { BmgI18nStringCommand } from './commands/bmg-i18n-string-command';
import { BmgSortCommand } from './commands/bmg-sort-command';
import { BmgHashCommand } from './commands/bmg-hash-command';
import { BmgEncodeCommand } from './commands/bmg-encode-command';
import { BmgDecodeCommand } from './commands/bmg-decode-command';
import { BmgSolutionCommand } from './commands/bmg-solution-command';
import { createCompletionItemProvider } from './utils/ngx-translate/completionItemProvider';
import { createHoverProvider } from './utils/ngx-translate/hoverProvider';
import { createHighlightProvider } from './utils/ngx-translate/highlightProvider';
import { BMGSolution } from './consts';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  var Config = {};

  if (vscode.workspace.rootPath != null && BMGSolution.rootPath == null) {
    try {
      BmgSolutionCommand.LoadBmgSolution();
    } catch (error) {}
  }
  // Register all commands
  var i18ncmd = new BmgI18nStringCommand(context);
  var sortcmd = new BmgSortCommand(context);
  var hashcmd = new BmgHashCommand(context);
  var archivercmd = new BmgArchiverCommand(context);
  var encodecmd = new BmgEncodeCommand(context);
  var decodecmd = new BmgDecodeCommand(context);
  var loadsolution = new BmgSolutionCommand(context);

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'html',
      createCompletionItemProvider(),
      '"',
      "'"
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      'typescript',
      createCompletionItemProvider(),
      '"',
      "'"
    )
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('html', createHoverProvider())
  );
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('typescript', createHoverProvider())
  );

  createHighlightProvider(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
