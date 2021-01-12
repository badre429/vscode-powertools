import * as vscode from 'vscode';
import { ListDirectoryFiles } from '../../utils/files';
import { CommonRecivedMessage } from './commons';
import * as fs from 'fs';

import * as path from 'path';
export function getI18nHtmlForWebview(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
) {
  // And the uri we use to load this script in the webview
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'i18n.js')
  );

  const scriptVueUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'external', 'vue.js')
  );
  // Local path to css styles
  const scriptVuetifyUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'external', 'vuetify.js')
  );

  // Uri to load styles into webview
  const stylesVuetifyResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'external', 'vuetify.css')
  );
  const stylesVscodeResetUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'media', 'vscode.css')
  );
  const stylesMaterialDesignUri = webview.asWebviewUri(
    vscode.Uri.joinPath(
      extensionUri,
      'media',
      'external',
      'material-design-icons.css'
    )
  );

  return ` 
    <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>MAP CLIENT</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link
  rel="stylesheet"
  type="text/css"
  media="screen"
  href="${stylesVuetifyResetUri}"
/>

<link
  rel="stylesheet"
  type="text/css"
  media="screen"
  href="${stylesVscodeResetUri}"
/>
<link
  rel="stylesheet"
  type="text/css"
  media="screen"
  href="${stylesMaterialDesignUri}"
/>

<script src="${scriptVueUri}"></script>
<script src="${scriptVuetifyUri}"></script>
<style>
  table {
    position: relative;
  }
  th {
    position: sticky;
    background-color: rgb(226, 226, 226);
    z-index: 5;
    top: 0; /* Don't forget this, required for the stickiness */
  }
  .v-data-table__wrapper {
    overflow-x: visible !important;
    overflow-y: visible !important;
  }
  .v-text-field {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
  .v-input__slot {
    margin-bottom: 0 !important;
  }
  .v-text-field__details {
    display: none !important;
  }
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    height: 26px !important;
    padding-left: 4px !important;
    padding-right: 4px !important;
  }
</style>
</head>

<body>
<div id="main-toolbar">
<v-app>
<v-main>
  <v-container dark>  
      <v-snackbar v-model="cancelMessage" color="success">
        Download Canceled
        <v-btn dark @click="cancelMessage = false"> Close </v-btn>
      </v-snackbar>
      <v-snackbar v-model="successMessage" color="success">
        Download Stared
        <v-btn dark @click="successMessage = false"> Close </v-btn>
      </v-snackbar>

      <div style="display: flex">
        <v-select
          style="margin: 4px"
          style="flex-grow: 1"
          v-model="i18nConfig"
          item-text="name"
          item-value="name"
          v-on:change="i18nConfigChange"
          :items="i18nConfigs"
          label="Select I18n Config"
        >
        </v-select>
        <div v-if="i18nConfig">
          <v-btn
            style="margin: 4px"
            v-if="i18nConfigChange"
            v-on:click="save"
            class="push-c control"
          >
            <v-icon>save</v-icon>
            Save
          </v-btn>

          <v-btn
            style="margin: 4px"
            v-on:click="addLanguage"
            class="push-c control"
          >
            <v-icon>save</v-icon>
            Add language
          </v-btn>
        </div>
      </div>

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>
                Keys:
                <v-btn v-on:click="addKey( )" icon color="blue">
                  <v-icon> add</v-icon>
                </v-btn>
              </th>
              <th v-for="key in languages" class="text-left">{{key}}</th>
              <th style="max-width: 48px;margin: 0;padding: 0;">
                <v-btn v-on:click="save" icon color="blue">
                  <v-icon>save</v-icon>
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in keys">
              <td>{{key}}</td>
              <td v-for="lang in languages">
                <v-text-field autofocus v-model="i18nConfigDic[lang][key]">
                </v-text-field>
              </td>
              <td style="max-width: 48px">
                <v-btn v-on:click="deleteKey(key)" icon color="red">
                  <v-icon> delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      </v-container>
    </v-main>
  </v-app>
</div>

<script   src="${scriptUri}"></script>
</body>
</html>

    `;
}

export function I18nUI(context: vscode.ExtensionContext) {
  {
    const panel = vscode.window.createWebviewPanel(
      'Bmg.I18N.view',
      'Bmg I18N',
      vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'media'),
        ],
      } // Webview options. More on these later.
    );
    panel.webview.html = getI18nHtmlForWebview(
      panel.webview,
      context.extensionUri
    );

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (await CommonRecivedMessage(message, panel)) return;
        switch (message.command) {
          case 'getList':
            var rootPath = vscode.workspace.rootPath;
            var files = ListDirectoryFiles(rootPath).allIncludedFiles;
            var ret = [];
            var NamePathDic = {};
            var NameResourceDic = {};
            (panel as any).NamePathDic = NamePathDic;
            (panel as any).NameResourceDic = NameResourceDic;
            var engFiles = files.filter((k) => k.endsWith('en.json'));
            engFiles.forEach((fl) => {
              var di = path.dirname(fl);
              var prefix = null;
              var name = path.basename(di);
              var df = di;
              var i = 0;
              while (NamePathDic[name] && df != null && i++ < 10) {
                df = path.dirname(df);
                name = path.basename(df) + '.' + name;
              }
              if (NamePathDic[name] == null) {
                var resource = { key: name, files: [] };
                NamePathDic[name] = path.join(rootPath, di);
                NameResourceDic[name] = resource;
                files
                  .filter((k) => k.startsWith(di) && k.endsWith('.json'))
                  .forEach((element) => {
                    resource.files.push({
                      key: path.parse(element).name,
                      content: fs
                        .readFileSync(path.join(rootPath, element))
                        .toString(),
                    });
                  });
                //     foreach (var item in di.EnumerateFiles("*.json"))
                //     {
                //         resource.Files.Add(new I18nFileContent(Path.GetFileNameWithoutExtension(item.Name), System.IO.File.ReadAllText(item.FullName)));
                //     }
              }
            });
            ret = Object.keys(NameResourceDic);
            panel.webview.postMessage({
              command: 'getList',
              data: ret,
            });
            return;
          case 'getItem':
            panel.webview.postMessage({
              command: 'getItem',
              data: (panel as any).NameResourceDic[message.data],
            });
            return;
          case 'setItem':
            var content = message.data;
            (panel as any).NameResourceDic[message.data.key] = message.data;
            var directoryPath = (panel as any).NamePathDic[message.data.key];
            content.files.forEach((item) => {
              var lp = item.key + '.json';
              lp = path.join(directoryPath, lp);
              fs.writeFileSync(lp, item.content);
            });

            panel.webview.postMessage({
              command: 'setItem',
              data: 'ak',
            });
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  }
}
// get time;
// return Ok(NameResourceDic[id]);

// save
// if (!NameResourceDic.ContainsKey(id))
// {
//     return NotFound();
// }
// NameResourceDic[id] = content;
// var directoryPath = NamePathDic[id];
// foreach (var item in content.Files)
// {
//     var path = item.Key + ".json";
//     path = Path.Join(directoryPath, path);
//     System.IO.File.WriteAllText(path, item.Content);
// }
