export interface IBmgConfig {
  name: string;
  description?: string;
  projects: string[];
}
export interface IBmgProject {
  name: string;
  description?: string;
  i18nPath: string;
  i18nLanguages: string[];
  i18n: any;
  key: string;
  clientPath?: string;
  serverPath?: string;
  permissions: [
    {
      key: string;
      display: string;
      description?: string;
    }
  ];
}

export interface IBmgSolution {
  name: string;
  description?: string;
  projects: IBmgProject[];
  i18nPath: string;
  i18n: any;
  i18nLanguages: string[];
  i18nKeys?: string[];
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
