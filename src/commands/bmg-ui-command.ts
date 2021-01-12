import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';

import { getI18nHtmlForWebview, I18nUI } from './ui/i18n';

export class BmgUiCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.ui');

    this.paramsLoader.push({
      key: 'cmd',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('cmd', ['I18N JSON UI']),
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
      case 'I18N JSON UI':
        I18nUI(this.context);
        break;
    }
  }
}
