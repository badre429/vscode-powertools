// command to complete all i18n strings
import { BmgCommand } from "./bmg-command";
import * as vscode from "vscode";
import { IParamsLoader } from "../utils/interfaces";
export class BmgI18nStringCommand extends BmgCommand {
    constructor(
        private context: vscode.ExtensionContext
    ) {

        super(context, "extension.bmg.i18n");

        this.paramsLoader.push({
            key: "string",
            command: this,
            value: null,
            load: (paramsLoader) => this.LoadKeys(paramsLoader)
        });

    }
    Run() {
        vscode.window.showInformationMessage(this.params["value"]);
    }
    public LoadKeys(paramsLoader: IParamsLoader) {

        var choices = ["abs", "test", "school"];
        for (var index = 0; index < 50; index++) {
            choices.push(index.toString());
        }
        vscode.window.showQuickPick(choices).then(v => {
            paramsLoader.command.params["value"] = v;
            paramsLoader.command.GetNextParam();
        });
    }
}