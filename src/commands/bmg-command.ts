import * as vscode from 'vscode';
import { IBmgCommand, IBmgConfig, IParamsLoader } from '../utils/interfaces';
export class BmgCommand implements IBmgCommand {
  public params: {} = {};
  public paramsLoader: IParamsLoader[] = [];
  public Run() {}
  Disposable: vscode.Disposable;
  public GetNextParam() {
    var keys = Object.keys(this.params);
    var index = keys.length;
    if (index == this.paramsLoader.length) {
      this.Run();
      this.params = {};
    } else {
      var _paramLoader = this.paramsLoader[index];
      _paramLoader.load(_paramLoader);
    }
  }
  public config: IBmgConfig;
  constructor(context: vscode.ExtensionContext, commandName: string) {
    this.Disposable = vscode.commands.registerCommand(commandName, () =>
      this.GetNextParam()
    );
    context.subscriptions.push(this.Disposable);
  }

  public LoadFunctionOfValue(
    paramName: string
  ): (IParamsLoader: IParamsLoader) => any {
    return (paramsLoader: IParamsLoader) => {
      vscode.window.showInputBox({ placeHolder: paramName }).then(v => {
        paramsLoader.command.params[paramName] = v;
        paramsLoader.command.GetNextParam();
      });
    };
  }
  public LoadFunctionOfSelect(
    paramName: string,
    options: any[]
  ): (IParamsLoader: IParamsLoader) => any {
    return (paramsLoader: IParamsLoader) => {
      vscode.window
        .showQuickPick(options, { placeHolder: paramName })
        .then(v => {
          paramsLoader.command.params[paramName] = v;
          paramsLoader.command.GetNextParam();
        });
    };
  }
}
