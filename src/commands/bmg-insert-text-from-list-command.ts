import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { BmgCommandHelper } from './bmg-command-helper';


export class BmgInsertTextFromListCommand extends BmgCommand {
  constructor(
    private context: vscode.ExtensionContext,
    private key,
    private list
  ) {
    super(context);
    this.paramsLoader.push({
      key: this.key,
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect(this.key, this.list),
    });
  }
  Run() {
    Object.keys(this.params).forEach((key) => {
      if (key != null && this.params[key] == null) {
        return;
      }
    });
    var Permission = this.params[this.key];

    BmgCommandHelper.ReplaceEditorSelection(Permission);
  }
}
