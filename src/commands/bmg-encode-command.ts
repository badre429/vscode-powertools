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
    }
    BmgCommandHelper.ReplaceEditorSelection(hashText);
  }
}

// XML entities

// HTML validity and XSS attack prevention you can achieve from XmlEntities class.

// const Entities = require('html-entities').XmlEntities;

// const entities = new Entities();

// console.log(entities.encode('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;©®
// console.log(entities.encodeNonUTF('<>"\'&©®')); // &lt;&gt;&quot;&apos;&amp;&#169;&#174;
// console.log(entities.encodeNonASCII('<>"\'&©®')); // <>"\'&©®
// console.log(entities.decode('&lt;&gt;&quot;&apos;&amp;&copy;&reg;&#8710;')); // <>"'&&copy;&reg;∆
// All HTML entities encoding/decoding

// const Entities = require('html-entities').AllHtmlEntities;

// const entities = new Entities();

// console.log(entities.encode('<>"&©®∆')); // &lt;&gt;&quot;&amp;&copy;&reg;∆
// console.log(entities.encodeNonUTF('<>"&©®∆')); // &lt;&gt;&quot;&amp;&copy;&reg;&#8710;
// console.log(entities.encodeNonASCII('<>"&©®∆')); // <>"&©®&#8710;
// console.log(entities.decode('&lt;&gt;&quot;&amp;&copy;&reg;')); // <>"&©®
// Available classes

// const XmlEntities = require('html-entities').XmlEntities, // <>"'& + &#...; decoding
//       Html4Entities = require('html-entities').Html4Entities, // HTML4 entities.
//       Html5Entities = require('html-entities').Html5Entities, // HTML5 entities.
//       AllHtmlEntities = require('html-entities').AllHtmlEntities
