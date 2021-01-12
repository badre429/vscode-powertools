import * as vscode from 'vscode';

export async function CommonRecivedMessage(message, panel) {
  switch (message.command) {
    case 'alert':
      vscode.window.showErrorMessage(message.data);
      return true;

    case 'prompt':
      var val = await vscode.window.showInputBox({
        placeHolder: message.data?.name,
        value: message.data?.value,
      });
      panel.webview.postMessage({ command: 'prompt', data: val });
      return true;

    case 'confirm':
      var val = await vscode.window.showQuickPick(['yes', 'no'], {
        placeHolder: message.data,
      });
      panel.webview.postMessage({
        command: 'confirm',
        data: val == 'yes' ? true : false,
      });
      return true;
    case 'select':
      var val = await vscode.window.showQuickPick(message.data.value, {
        placeHolder: message.data.name,
      });
      panel.webview.select({
        command: 'select',
        data: val,
      });
      return true;
  }
  return false;
}
