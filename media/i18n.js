var vueApp = {};

const vscode = acquireVsCodeApi();

const oldState = vscode.getState();
var promiseFunctions = {};
var promiseDictionary = {};
function getPromiseFromVscode(command, data) {
  if (promiseDictionary[command] == null) {
    promiseDictionary[command] = new Promise(
      (f) => (promiseFunctions[command] = f)
    );
    vscode.postMessage({
      command,
      data,
    });
  }
  return promiseDictionary[command];
}

window.addEventListener('message', (event) => {
  const message = event.data; // The json data that the extension sent
  console.log(event);
  if (promiseFunctions[message.command]) {
    promiseFunctions[message.command](message.data);
    promiseFunctions[message.command] = null;
    promiseDictionary[message.command] = null;
  }
});

window.addEventListener(
  'beforeunload',
  function (e) {
    // Do something
  },
  false
);
(function () {
  vueApp = new Vue({
    el: '#main-toolbar',
    // @ts-ignore
    vuetify: new Vuetify({ theme: { dark: false } }),
    data: {
      cancelMessage: null,
      successMessage: null,
      i18nConfigDic: {},
      i18nConfigData: null,
      i18nConfig: null,
      i18nConfigs: [],
      keys: [],
      items: [],
      languages: [],
      workingLangs: [],
    },
    created: async function () {
      // `this` points to the vm instance
      //   this.i18nConfigs = await (await fetch('/api/i18n/configs')).json();
      this.i18nConfigs = await getPromiseFromVscode('getList');
    },
    methods: {
      // @ts-ignore
      addLanguage: async function (e) {
        var lng = vscode
          ? prompt('new language')
          : await vscode.window.showInputBox({ placeHolder: paramName });
        if (lng != null && lng.length && this.languages.indexOf(lng) < 0) {
          this.languages.push(lng);
          this.i18nConfigDic[lng] = {};
        }
      },
      editKeys: async function (oldKey) {
        //   var newKey = prompt('edit language', oldKey);
        var newKey = vscode
          ? prompt('new key')
          : await vscode.window.showInputBox({
              placeHolder: paramName,
              value: oldKey,
            });
        if (newKey != null && newKey != '' && this.keys.indexOf(newKey) < 0) {
          this.keys.push(newKey);
          this.i18nConfigDic[newKey] = {};

          let index = this.keys.indexOf(oldKey);

          this.keys = [
            // part of the array before the specified index
            ...this.keys.slice(0, index),
            // inserted item
            newKey,
            // part of the array after the specified index
            ...this.keys.slice(index + 1),
          ];
          this.languages.indexOf(newKey);
        }
      },
      setData: function (lng, key, value) {
        this.i18nConfigDic[lng][key] = value;
      },
      addKey: async function () {
        // var key = vscode
        //   ? prompt('key')
        //   : await vscode.window.showInputBox({ placeHolder: paramName });
        var key = await getPromiseFromVscode('prompt', { name: 'key' });
        if (key != null && key != '' && this.keys.indexOf(key) < 0) {
          this.keys.push(key);
        }
      },
      deleteKey(key) {
        // if (confirm('Êtes-vous sûr?'))
        {
          this.keys.splice(this.keys.indexOf(key), 1);
          this.languages.forEach((lng) => {
            var d = this.i18nConfigDic[lng];
            delete d[key];
          });
        }
      },
      save: async function () {
        var savedata = {
          key: this.i18nConfig,
          files: this.languages.map((key) => {
            return {
              key: key,
              content: JSON.stringify(
                {
                  culture: key,
                  texts: this.i18nConfigDic[key],
                },
                null,
                2
              ),
            };
          }),
        };

        // await fetch('/api/i18n/configs/' + this.i18nConfig, {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(savedata),
        // });
        await getPromiseFromVscode('setItem', savedata);
        alert('opération terminé avec succès');
      },
      // @ts-ignore
      i18nConfigChange: async function (e) {
        // this.i18nConfigData = await (
        //   await fetch('/api/i18n/configs/' + e)
        // ).json();
        this.i18nConfigData = await getPromiseFromVscode('getItem', e);
        this.i18nConfig = e;
        this.i18nConfigDic = {};
        var kys = {};
        this.languages = [];
        this.i18nConfigData.files.forEach((element) => {
          try {
            this.languages.push(element.key);
            this.i18nConfigDic[element.key] = JSON.parse(element.content).texts;
            Object.keys(this.i18nConfigDic[element.key]).forEach(
              (k) => (kys[k] = true)
            );
          } catch (error) {
            this.i18nConfigDic[element.key] = {};
          }
        });
        this.keys = Object.keys(kys);
        console.log(this.i18nConfigDic);
      },
    },
  });
})();
