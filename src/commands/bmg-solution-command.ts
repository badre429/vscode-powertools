import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { ConfigLoader } from '../utils/solution-loader';
import { BMGConfig, BMGSolution } from '../consts';

import * as path from 'path';

import { get } from 'lodash-es';

import { ResourceDictionary } from '../utils/ngx-translate/resource-dictionary';
import { saveJsonOjbect } from '../utils/files';
import { IBmgProject } from '../utils/interfaces';
export class BmgI18nAddKeyCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context);
    this.paramsLoader.push({
      key: 'Project',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect(
        'Project',
        BMGSolution.projects.map((v) => v.key)
      ),
    });

    this.paramsLoader.push({
      key: 'Key',
      command: this,
      value: null,
      load: this.LoadFunctionOfValue('Key'),
    });
    BMGSolution.i18nLanguages.forEach((lang) => {
      this.paramsLoader.push({
        key: lang,
        command: this,
        value: null,
        load: this.LoadFunctionOfValue(lang),
      });
    });
  }
  Run() {
    Object.keys(this.params).forEach((key) => {
      if (key != null && this.params[key] == null) {
        return;
      }
    });
    var project = BMGSolution.projects.find(
      (v) => v.key == this.params['Project']
    );
    var key = this.params['Key'];

    if (project != null) {
      this.addI18KeyToProject(project, key);
      this.addI18KeyToProject(
        BMGSolution,
        this.params['Project'] + '.' + key,
        true
      );
      BMGSolution.i18nKeys.push(this.params['Project'] + '.' + key);
    } else {
      this.addI18KeyToProject(BMGSolution, key);
      BMGSolution.i18nKeys.push(key);
    }
    resetI18nAutocomplete();
  }

  private addI18KeyToProject(
    project: Partial<IBmgProject>,
    key: any,
    ignoreSave = false
  ) {
    var sol = BMGSolution;
    sol.i18nLanguages.forEach((lang) => {
      if (project.i18n == null) {
        project.i18n = {};
      }
      if (project.i18n[lang] == null) {
        project.i18n[lang] = {};
      }
      project.i18n[lang][key] = this.params[lang];
      if (project.i18nPath[lang] != null && !ignoreSave) {
        saveJsonOjbect(
          path.join(project.rootPath, project.i18nPath[lang]),
          project.i18n[lang]
        );
      }
    });
  }
}
export class BmgSolutionCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.solution');

    this.paramsLoader.push({
      key: 'cmd',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('cmd', [
        'Reload BMG Solution',
        'Save I18n Output',
        'Add I18n Key',
      ]),
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
      case 'Add I18n Key':
        {
          var cmd = new BmgI18nAddKeyCommand(this.context);
          cmd.GetNextParam();
        }
        break;
      case 'Reload BMG Solution':
        BmgSolutionCommand.LoadBmgSolution();
        break;
      case 'Save I18n Output':
        BmgSolutionCommand.saveI18n();
        break;
    }
  }
  static async LoadBmgSolution() {
    var cl = new ConfigLoader(vscode.workspace.rootPath);
    var z = Object.assign(BMGConfig, cl);
    var Config = await cl.Load();
    var ze = Object.assign(BMGSolution, Config);
    // console.log(BMGSolution);

    resetI18nAutocomplete();
  }
  static saveI18n() {
    var s = BMGSolution;
    s.i18nLanguages.forEach((lang) => {
      const i18n = s.i18n[lang];
      var dists = s.i18nPathOut[lang];
      dists.forEach((distI18n) => {
        var ur = path.join(s.rootPath, distI18n);

        saveJsonOjbect(ur, i18n);
      });
    });
  }
}
function resetI18nAutocomplete() {
  let resourceDictionary: vscode.CompletionItem[] = [];
  BMGSolution.i18nKeys.forEach(function (key) {
    var x = {
      label: `i18n:${key}`,
      detail: get(BMGSolution.i18n[BMGSolution.i18nLanguages[0]], key, key),
      insertText: key,
      kind: vscode.CompletionItemKind.Text,
    };
    resourceDictionary.push(x);
  });
  ResourceDictionary.Instance.setResources(resourceDictionary);
}
