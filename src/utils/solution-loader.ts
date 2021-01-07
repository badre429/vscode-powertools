import { IBmgConfig, IBmgSolution, IBmgProject } from './interfaces';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';

import axios from 'axios';

import { uniq } from 'lodash-es';
export function LoadKeys(i18n, keys: string[], subName?) {
  if (subName == null) {
    subName = '';
  } else {
    subName = subName + '.';
  }
  Object.keys(i18n).forEach((key) => {
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
  public async Load(): Promise<Partial<IBmgSolution>> {
    var local_path = path.join(this.rootPath, 'bmg.solution.json');
    if (fs.existsSync(local_path)) {
      var json_string = fs.readFileSync(local_path).toString();
      const config = <IBmgSolution>JSON.parse(json_string);
      var allprojs = config.projectPaths || [];

      var ret = <IBmgSolution>(<any>config);
      ret.projects = [];
      ret.i18nKeys = [];
      ret.permissionKeys = [];
      ret.rootPath = this.rootPath;
      ret.i18nLanguages = [];
      ret.i18n = {};

      this.loadI18n(ret);

      allprojs.forEach((projPath) => {
        try {
          var projectsUrl = path.join(this.rootPath, projPath);
          var projjson_string = fs.readFileSync(projectsUrl).toString();
          var projDir = path.dirname(projectsUrl);

          var proj = <IBmgProject>JSON.parse(projjson_string);
          proj.rootPath = projDir;
          proj.i18nLanguages = [];
          proj.i18n = {};
          if (proj.i18nPath != null) {
            this.loadI18n(proj);
          }

          ret.projects.push(proj);
          ret.i18nLanguages = uniq([
            ...ret.i18nLanguages,
            ...proj.i18nLanguages,
          ]);
          if (proj.i18nLanguages.length > 0) {
            for (let index = 0; index < ret.i18nLanguages.length; index++) {
              LoadKeys(
                proj.i18n[proj.i18nLanguages[index]],
                ret.i18nKeys,
                proj.key
              );
              if (ret.i18n[proj.i18nLanguages[index]] == null) {
                ret.i18n[proj.i18nLanguages[index]] = {};
              }
              ret.i18n[proj.i18nLanguages[index]][proj.key] =
                proj.i18n[proj.i18nLanguages[index]];
            }
          }
        } catch (error) {}
      });
      // load abp.io configuration
      if (config.abp?.url != null) {
        await this.loadAbpIOData(config.abp?.url, ret);
      }
      return ret;
    }
    return {};
  }

  private async loadAbpIOData(url: string, ret: IBmgSolution) {
    try {
      var ru = await axios.get(url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      var abdata = ru.data;
      if (abdata) {
        try {
          var lpath = path.join(this.rootPath, 'tmp', 'tmp.abp.json');
          fs.writeFileSync(lpath, JSON.stringify(abdata, null, 4));
        } catch (error) {}
      }
      this.loadAbpioData(abdata, ret);
    } catch (error) {
      var lpath = path.join(this.rootPath, 'tmp', 'tmp.abp.json');

      try {
        if (fs.existsSync(lpath)) {
          var abdata = JSON.parse(fs.readFileSync(lpath).toString());

          this.loadAbpioData(abdata, ret);
        }
      } catch (error) {}
    }
  }

  private loadAbpioData(abdata: any, ret: IBmgSolution) {
    if (abdata.auth?.policies) {
      ret.permissionKeys.push(...Object.keys(abdata.auth?.policies));
    }
    if (abdata.localization?.values) {
      var keys = Object.keys(abdata.localization?.values);
      var lang = 'en';
      if ((ret.i18nLanguages.length = 0)) {
        ret.i18nLanguages.push(lang);
      } else {
        lang = ret.i18nLanguages[0];
      }
      if (ret.i18n[lang] == null) {
        ret.i18n[lang] = {};
      }

      keys.forEach((res) => {
        Object.keys(abdata.localization?.values[res]).forEach((k) => {
          var key = res + '::' + k;
          ret.i18nKeys.push(key);
          ret.i18n[lang][key] = abdata.localization?.values[res][k];
        });
      });
    }
  }

  private loadI18n(proj: {
    i18nPath: string;
    i18n: any;
    i18nLanguages: string[];
    rootPath?: string;
  }) {
    try {
      if (typeof proj.i18nPath == 'string') {
        var i18n = fs
          .readFileSync(path.join(proj.rootPath, proj.i18nPath))
          .toString();
        proj.i18n = { en: JSON.parse(i18n) };
        proj.i18nLanguages = ['en'];
      } else if (typeof proj.i18nPath == 'object') {
        proj.i18n = {};
        Object.keys(proj.i18nPath).forEach((key) => {
          proj.i18nLanguages.push(key);
          var i18n = fs
            .readFileSync(path.join(proj.rootPath, proj.i18nPath[key]))
            .toString();
          proj.i18n[key] = JSON.parse(i18n);
        });
      }
    } catch (error) {}
  }
}
