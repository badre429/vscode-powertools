// command to complete all i18n strings
import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { IParamsLoader } from '../utils/interfaces';
import { BmgCommandHelper } from './bmg-command-helper';
import { Html5Entities } from 'html-entities';

export class BmgDecodeCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.decode');

    this.paramsLoader.push({
      key: 'decoding',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('decoding', [
        'HTML',
        'URL',
        'HTML Non UTF',
        'HTML Non ASCII',
        'latin1',
        'hex',
        'base64'
      ])
    });
  }

  Run() {
    var decoding = this.params['decoding'];
    var selectedText = BmgCommandHelper.GetSelectedText();
    var hashText = '';

    switch (decoding) {
      case 'HTML':
        var entities = new Html5Entities();
        hashText = entities.decode(selectedText);
        break;
      case 'HTML Non UTF':
        var entities = new Html5Entities();
        hashText = entities.decode(selectedText);
        break;
      case 'HTML Non ASCII':
        var entities = new Html5Entities();
        hashText = entities.decode(selectedText);
        break;
      case 'URL':
        var entities = new Html5Entities();
        hashText = decodeURI(selectedText);
        break;
    }
    BmgCommandHelper.ReplaceEditorSelection(hashText);
  }
}
