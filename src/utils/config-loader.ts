import { IBmgConfig, IBmgSolution, IBmgProject } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { uniq } from 'lodash';
export function LoadKeys(i18n, keys: string[], subName?) {
  if (subName == null) {
    subName = '';
  } else {
    subName = subName + '.';
  }
  Object.keys(i18n).forEach(key => {
    var val = i18n[key];
    if (val != null) {
      if (typeof val == 'string') {
        var l = subName + key;
        if (keys.indexOf(l) < 0) keys.push(l);
      }
      if (typeof val == 'object') {
        LoadKeys(val, keys, subName + key);
      }
    }
  });
}
export class ConfigLoader {
  constructor(private rootPath: string) {}
  public Load(): Partial<IBmgSolution> {
    var local_path = path.join(this.rootPath, 'bmg.solution.json');
    if (fs.existsSync(local_path)) {
      var json_string = fs.readFileSync(local_path).toString();
      const config = <IBmgConfig>JSON.parse(json_string);
      var allprojs = config.projects || [];
      var ret = <IBmgSolution>(<any>config);
      ret.projects = [];
      ret.i18nKeys = [];
      ret.i18nLanguages = [];
      ret.i18n = {};
      this.loadI18n(ret, this.rootPath);
      allprojs.forEach(projPath => {
        try {
          var projectsUrl = path.join(this.rootPath, projPath);
          var projjson_string = fs.readFileSync(projectsUrl).toString();
          var projDir = path.dirname(projectsUrl);

          var proj = <IBmgProject>JSON.parse(projjson_string);
          proj.i18nLanguages = [];
          proj.i18n = {};
          if (proj.i18nPath != null) {
            this.loadI18n(proj, projDir);
          }

          ret.projects.push(proj);
          if (proj.i18nLanguages.length > 0) {
            LoadKeys(proj.i18n[proj.i18nLanguages[0]], ret.i18nKeys, proj.key);
            if (ret.i18n[proj.i18nLanguages[0]] == null) {
              ret.i18n[proj.i18nLanguages[0]] = {};
            }
            ret.i18n[proj.i18nLanguages[0]][proj.key] =
              proj.i18n[proj.i18nLanguages[0]];
          }
          ret.i18nLanguages = uniq([
            ...ret.i18nLanguages,
            ...proj.i18nLanguages
          ]);
        } catch (error) {}
      });
      return ret;
    }
    return {};
  }

  private loadI18n(
    proj: { i18nPath: string; i18n: any; i18nLanguages: string[] },
    projDir: string
  ) {
    if (typeof proj.i18nPath == 'string') {
      var i18n = fs.readFileSync(path.join(projDir, proj.i18nPath)).toString();
      proj.i18n = { en: JSON.parse(i18n) };
      proj.i18nLanguages = ['en'];
    } else if (typeof proj.i18nPath == 'object') {
      Object.keys(proj.i18nPath).forEach(key => {
        proj.i18nLanguages.push(key);
        proj.i18n = {};
        var i18n = fs
          .readFileSync(path.join(projDir, proj.i18nPath[key]))
          .toString();
        proj.i18n[key] = JSON.parse(i18n);
      });
    }
  }
}
