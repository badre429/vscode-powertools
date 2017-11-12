'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { BmgArchiverCommand } from "../commands/bmg-archiver-command";
import { ConfigLoader } from "../utils/config-loader";
import { BmgI18nStringCommand } from "../commands/bmg-i18n-string-command";
import { BmgSortCommand } from "../commands/bmg-sort-command";
import { BmgHashCommand } from "../commands/bmg-hash-command";
import { BmgEncodeCommand } from "../commands/bmg-encode-command";
import { BmgDecodeCommand } from "../commands/bmg-decode-command";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    var Config = {};

    if (vscode.workspace.rootPath != null) {
        var cl = new ConfigLoader(vscode.workspace.rootPath);
        Config = cl.Load();
    }
    // Register all commands 
    var i18ncmd = new BmgI18nStringCommand(context);
    var sortcmd = new BmgSortCommand(context);
    var hashcmd = new BmgHashCommand(context);
    var archivercmd = new BmgArchiverCommand(context);
    var encodecmd = new BmgEncodeCommand(context);
    var decodecmd = new BmgDecodeCommand(context);


}

// this method is called when your extension is deactivated
export function deactivate() {
}