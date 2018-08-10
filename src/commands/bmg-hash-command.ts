// command to complete all i18n strings
import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { IParamsLoader } from '../utils/interfaces';
import { BmgCommandHelper } from './bmg-command-helper';

export class BmgHashCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.hash');

    this.paramsLoader.push({
      key: 'algorithm',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('algorithm', crypto.getHashes())
    });
    this.paramsLoader.push({
      key: 'encoding',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('encoding', ['latin1', 'hex', 'base64'])
    });
  }

  Run() {
    var algorithm = this.params['algorithm'];
    var encoding = this.params['encoding'];
    var selectedText = BmgCommandHelper.GetSelectedText();
    var hashText = '';

    hashText = crypto
      .createHash(algorithm)
      .update(selectedText)
      .digest(encoding);

    BmgCommandHelper.ReplaceEditorSelection(hashText);
  }
}
