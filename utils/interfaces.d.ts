
export interface IBmgConfig {
    i18n?: {};

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
    load:  (IParamsLoader:IParamsLoader) =>any;

}