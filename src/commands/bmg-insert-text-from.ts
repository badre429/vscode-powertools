import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { BmgInsertTextFromListCommand } from './bmg-insert-text-from-list-command';
import { MaterialIcons } from './consts/material-icons';

export class BmgInsertTextFromCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.insert-text');

    this.paramsLoader.push({
      key: 'cmd',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('cmd', ['Material ICONS']),
    });
  }
  Run() {
    var encoding = this.params['cmd'];
    if (vscode.workspace.rootPath == null) {
      vscode.window.showInformationMessage(
        'You have to open a folder to run this command'
      );
      return;
    }
    //  hashText = crypto.createHash(algorithm).update(selectedText).digest(encoding);
    switch (encoding) {
      case 'Material ICONS':
        {
          {
            var cmdd = new BmgInsertTextFromListCommand(
              this.context,
              'Icon',
              MaterialIcons
            );
            cmdd.GetNextParam();
          }
        }
        break;
    }
  }
}
