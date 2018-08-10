import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { ConfigLoader } from '../utils/config-loader';
import { BMGConfig, BMGSolution } from '../consts';

import { configure } from 'vscode/lib/testrunner';
import { get } from 'lodash';
import { ResourceDictionary } from '../utils/ngx-translate/resource-dictionary';
export class BmgLoadSolutionCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.solution');
  }
  Run() {
    if (vscode.workspace.rootPath != null) {
      BmgLoadSolutionCommand.LoadBmgSolution();
    } else
      vscode.window.showInformationMessage(
        'You have to open a folder to run this command'
      );
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
}
