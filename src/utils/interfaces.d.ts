export interface IBmgConfig {
  name: string;
  description?: string;
  projects: string[];
}
export interface IBmgPermission {
  key: string;
  display: string | any;
  description?: string | any;
  childs?: IBmgPermission[];
}
export interface IBmgProject {
  name: string;
  description?: string;
  i18nPath: string | any;
  i18nPathOut: string | any;
  i18nLanguages: string[];
  i18n: any;
  key: string;
  serverKey: string;
  clientPath?: string;
  serverPath?: string;
  rootPath?: string;
  permissions: IBmgPermission[];
}

export interface AbpConfig {
  url?: string;
}
export interface IBmgSolution extends IBmgProject {
  abp: AbpConfig;
  i18nKeys?: string[];
  projects: IBmgProject[];
  projectPaths: string[];
}
export interface IBmgCommand {
  params: {};
  Run(): any;
  // this function must be called after selection of param
  GetNextParam(): any;
}

export interface IParamsLoader {
  key: string;
  command: IBmgCommand;
  value: string;
  load: (IParamsLoader: IParamsLoader) => any;
}
