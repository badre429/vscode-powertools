import * as path from 'path';
import * as fs from 'fs';
var ignore = require('ignore');
export class FilesIgnoreHelper {
  constructor(private rootPath) {
    this.LoadExcludeRules(rootPath);
  }
  public GitIgnoreRules: string[] = ['.git'];
  static replaceAll(str: string, find: string, replace: string) {
    return str.replace(
      new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'),
      replace
    );
  }

  LoadExcludeRules(directoryPath) {
    this.GitIgnoreRules = [];
    var excludePath = path.join(directoryPath, '.gitignore');
    var includePath = path.join(directoryPath, '.gitinclude');
    var excludeRules = this.LoadRulesFromFile(excludePath);
    var includeRules = this.LoadRulesFromFile(includePath);
    excludeRules.push('.git');
    excludeRules.forEach(o => {
      if (includeRules.indexOf(o) < 0) this.GitIgnoreRules.push(o);
    });
    return this.GitIgnoreRules;
  }

  // list all files from the rootPath after applling .gitginore rules
  public GetGitFilteredFiles(): any[] {
    var allIncludedFiles = this.GetIncludedFiles(this.rootPath);
    const ig = ignore().add(this.GitIgnoreRules);

    allIncludedFiles = ig.filter(allIncludedFiles) as any[];
    return allIncludedFiles;
  }
  LoadRulesFromFile(path) {
    var ret = [];

    if (fs.existsSync(path)) {
      var rules = fs
        .readFileSync(path)
        .toString()
        .split('\n');
      for (var i in rules) {
        var val;
        try {
          var rule = rules[i];
          val = rule;
          if (rule != null && rule != '' && rule.length > 0) {
            rule = rule.trim();
            var sharpIndex = rule.indexOf('#');
            if (sharpIndex == 0 || rule.length == 0) continue;
            if (sharpIndex > 0) {
              rule = rule.substr(0, sharpIndex + 1).trim();
              if (rule == '') continue;
            }
            ret.push(rule);
          }
        } catch (error) {}
      }
    }
    return ret;
  }

  IsFileIncluded(path) {
    return true;
  }
  FileMask(fileName, fileMask): boolean {
    // fileMask = FilesIgnoreHelper.replaceAll(fileMask, '\\', '/');
    // fileName = FilesIgnoreHelper.replaceAll(fileName, "\\", "/");
    if (fileName == fileMask) return true;
  }

  GetIncludedFiles(directoryInfo) {
    var file_lst = [];
    fs.readdirSync(directoryInfo).forEach(directory => {
      directory = path.join(directoryInfo, directory);
      if (fs.statSync(directory).isDirectory()) {
        var locaname = path.basename(directory); // to do check function
        var relativePath = path.relative(this.rootPath, directory); // to do check function
        if (
          this.IsFileIncluded('\\' + relativePath + '\\') &&
          this.IsFileIncluded('\\' + relativePath) &&
          this.IsFileIncluded(locaname + '\\')
        ) {
          var results = this.GetIncludedFiles(directory);
          results.forEach(o => file_lst.push(o));
        }
      }
    });

    fs.readdirSync(directoryInfo).forEach(file => {
      file = path.join(directoryInfo, file);
      if (!fs.statSync(file).isDirectory()) {
        var locaname = path.basename(file); // to do check function
        var relativePath = path.relative(this.rootPath, file); // to do check function
        if (
          this.IsFileIncluded('\\' + relativePath) &&
          this.IsFileIncluded(locaname)
        )
          file_lst.push(relativePath);
      }
    });

    return file_lst;
  }
}
