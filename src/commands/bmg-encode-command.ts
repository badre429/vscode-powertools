// command to complete all i18n strings
import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import * as crypto from 'crypto';
import { IParamsLoader } from '../utils/interfaces';
import { BmgCommandHelper } from './bmg-command-helper';
import { encode, decode } from 'html-entities';

export class BmgEncodeCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.encode');

    this.paramsLoader.push({
      key: 'encoding',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('encoding', [
        'HTML',
        'URL',
        'HTML Non UTF',
        'HTML Non ASCII',
        'JSON Multiline code',
        'JSON Multiline snippet',
        'latin1',
        'hex',
        'base64',
      ]),
    });
  }

  Run() {
    var encoding = this.params['encoding'];
    var selectedText = BmgCommandHelper.GetSelectedText();
    var hashText = '';

    //  hashText = crypto.createHash(algorithm).update(selectedText).digest(encoding);
    switch (encoding) {
      case 'HTML':
        hashText = encode(selectedText);
        break;
      case 'HTML Non UTF':
        hashText = encode(selectedText);
        break;
      case 'HTML Non ASCII':
        hashText = encode(selectedText);
        break;
      case 'URL':
        hashText = encodeURI(selectedText);
        break;
      case 'URL':
        hashText = encodeURI(selectedText);
        break;
      case 'base64':
        {
          let bufferObj = Buffer.from(selectedText, 'utf8');
          hashText = bufferObj.toString('base64');
        }
        break;
      case 'latin1':
        {
          let bufferObj = Buffer.from(selectedText, 'utf8');
          hashText = bufferObj.toString('latin1');
        }
        break;
      case 'hex':
        {
          let bufferObj = Buffer.from(selectedText, 'utf8');
          hashText = bufferObj.toString('hex');
        }
        break;
      case 'JSON Multiline code':
        hashText = selectedText
          .split('\n')
          .map((e) => JSON.stringify(e + '\n'))
          .join('+\n');

        break;
      case 'JSON Multiline snippet':
        hashText = selectedText
          .split('\n')
          .map((e) => JSON.stringify(e))
          .join(',\n');

        break;
      default:
        hashText = selectedText;
        break;
    }
    BmgCommandHelper.ReplaceEditorSelection(hashText);
  }
}
