import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { ConfigLoader } from '../utils/solution-loader';
import { BMGConfig, BMGSolution } from '../consts';
import * as fs from 'fs';
import * as path from 'path';
import { configure } from 'vscode/lib/testrunner';
import { get } from 'lodash';
import * as stringify from 'json-stable-stringify';

import { ResourceDictionary } from '../utils/ngx-translate/resource-dictionary';

export class BmgSolutionCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.solution');

    this.paramsLoader.push({
      key: 'cmd',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('cmd', ['Reload', 'SaveI18n'])
    });
  }
  Run() {
    var encoding = this.params['cmd'];

    //  hashText = crypto.createHash(algorithm).update(selectedText).digest(encoding);
    switch (encoding) {
      case 'Reload':
        {
          if (vscode.workspace.rootPath != null) {
            BmgSolutionCommand.LoadBmgSolution();
          } else
            vscode.window.showInformationMessage(
              'You have to open a folder to run this command'
            );
        }
        break;
      case 'SaveI18n':
        {
          if (BMGSolution.rootPath != null) {
            BmgSolutionCommand.saveI18n();
          } else vscode.window.showInformationMessage('No solution is loaded');
        }
        break;
    }
  }
  static LoadBmgSolution() {
    var cl = new ConfigLoader(vscode.workspace.rootPath);
    var z = Object.assign(BMGConfig, cl);
    var Config = cl.Load();
    var ze = Object.assign(BMGSolution, Config);
    console.log(BMGSolution);

    let resourceDictionary: vscode.CompletionItem[] = [];
    Config.i18nKeys.forEach(function(key) {
      var x = {
        label: `ngx-translate: ${key}`,
        detail: get(Config.i18n[Config.i18nLanguages[0]], key, key), // resources[key],
        insertText: key,
        kind: vscode.CompletionItemKind.Text
      };
      resourceDictionary.push(x);
    });
    ResourceDictionary.Instance.setResources(resourceDictionary);
  }
  static saveI18n() {
    var s = BMGSolution;
    s.i18nLanguages.forEach(lang => {
      const i18n = s.i18n[lang];
      var dists = s.i18nPathOut[lang];
      dists.forEach(distI18n => {
        var ur = path.join(s.rootPath, distI18n);

        fs.writeFileSync(
          ur,
          stringify(i18n, {
            space: '  ',
            cmp: (a, b) => {
              if (a != null && b != null) {
                return a.key.toLowerCase() > b.key.toLowerCase() ? 1 : -1;
              } else return a.key > b.key ? 1 : -1;
            }
          })
        );
      });
    });
  }
}
