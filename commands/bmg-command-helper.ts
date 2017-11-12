import * as vscode from "vscode";
export class BmgCommandHelper {
    public static ReplaceEditorSelection(text: string) {
        const editor = vscode.window.activeTextEditor;
        const selections = editor.selections;

        editor.edit((editBuilder) => {
            selections.forEach((selection) => {
                editBuilder.replace(selection, '');
                editBuilder.insert(selection.active, text);
            });
        });
    }
    public static OpenInExplorer(path: string) {
        const os = require('os');
        var ostype = (os.type());
        switch (ostype) {
            case "Windows_NT":
                var exec = require('child_process').exec;
                var cmd = 'explorer.exe /select,' + path;

                exec(cmd, function (error, stdout, stderr) {
                    // command output is in stdout
                });
                break;

            default:
                break;
        }

    }

    public static GetSelectedText() {
        var textEditor = vscode.window.activeTextEditor;
        var selection = textEditor.selection;
        var text = textEditor.document.getText(new vscode.Range(selection.start, selection.end));
        // vscode.window.showInformationMessage(text);
        return text;

    }
}