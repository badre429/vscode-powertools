// command to complete all i18n strings
import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { IParamsLoader } from '../utils/interfaces';
import { BmgCommandHelper } from './bmg-command-helper';
import { decode } from 'html-entities';

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
        'base64',
      ]),
    });
  }

  Run() {
    var decoding = this.params['decoding'];
    var selectedText = BmgCommandHelper.GetSelectedText();
    var hashText = '';

    switch (decoding) {
      case 'HTML':
        hashText = decode(selectedText);
        break;
      case 'HTML Non UTF':
        hashText = decode(selectedText);
        break;
      case 'HTML Non ASCII':
        hashText = decode(selectedText);
        break;

      case 'hex': {
        let bufferObj = Buffer.from(selectedText, 'hex');
        hashText = bufferObj.toString('utf8');
      }

      case 'latin1': {
        let bufferObj = Buffer.from(selectedText, 'latin1');
        hashText = bufferObj.toString('utf8');
      }

      case 'base64':
        {
          let bufferObj = Buffer.from(selectedText, 'base64');
          hashText = bufferObj.toString('utf8');
        }
        break;
      case 'URL':
        hashText = decodeURI(selectedText);
        break;
    }
    BmgCommandHelper.ReplaceEditorSelection(hashText);
  }
}
