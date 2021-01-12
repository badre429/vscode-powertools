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

function saveAppState() {
  vscode.setState({
    i18nConfigDic: vueApp.i18nConfigDic,
    successMessage: vueApp.successMessage,
    cancelMessage: vueApp.cancelMessage,
    i18nConfig: vueApp.i18nConfig,
    i18nConfigs: vueApp.i18nConfigs,
    keys: vueApp.keys,
    languages: vueApp.languages,
    i18nConfigData: vueApp.i18nConfigData,
    searchTerm: vueApp.searchTerm,
    searchKeys: vueApp.searchKeys,
    currentType: vueApp.currentType,
    workingLangs: vueApp.workingLangs,
  });
}
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
      currentType: 1,
      keys: [],
      items: [],
      languages: [],
      workingLangs: [],
      searchKeys: [],
      searchTerm: null,
    },
    created: async function () {
      // `this` points to the vm instance
      //   this.i18nConfigs = await (await fetch('/api/i18n/configs')).json();

      var appstate = vscode.getState();
      if (appstate) {
        this.i18nConfigDic = appstate.i18nConfigDic;
        this.successMessage = appstate.successMessage;
        this.cancelMessage = appstate.cancelMessage;
        this.i18nConfig = appstate.i18nConfig;
        // this.i18nConfigs = appstate.i18nConfigs;
        this.keys = appstate.keys;
        this.languages = appstate.languages;
        this.i18nConfigData = appstate.i18nConfigData;
        this.searchTerm = appstate.searchTerm;
        this.searchKeys = appstate.searchKeys;
        this.currentType = appstate.currentType;
        this.workingLangs = appstate.workingLangs;
      }
      this.i18nConfigs = await getPromiseFromVscode('getList');
    },
    methods: {
      // @ts-ignore
      search: function (key) {
        this.searchTerm = key;

        this.searchKeys =
          key == null
            ? this.keys
            : this.keys.filter(
                (k) => k.toLowerCase().indexOf(key.toLowerCase()) >= 0
              );

        saveAppState();
      },
      addLanguage: async function (e) {
        var lng = await getPromiseFromVscode('prompt', { name: 'language' });
        if (lng != null && lng.length && this.languages.indexOf(lng) < 0) {
          this.languages.push(lng);
          this.i18nConfigDic[lng] = {};
        }
      },
      editKeys: async function (oldKey) {
        var newKey = await getPromiseFromVscode('prompt', {
          name: 'key',
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
          this.search(this.searchTerm);

          this.languages.indexOf(newKey);
        }
        saveAppState();
      },
      setData: function (lng, key, value) {
        this.i18nConfigDic[lng][key] = value;
        saveAppState();
      },
      addKey: async function () {
        var key = await getPromiseFromVscode('prompt', { name: 'key' });
        if (key != null && key != '' && this.keys.indexOf(key) < 0) {
          this.keys.push(key);
        }
        saveAppState();
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
        saveAppState();
      },
      save: async function () {
        var savedata = {
          key: this.i18nConfig,
          prefix: this.i18nConfigData.prefix,
          files: this.languages.map((key) => {
            return {
              key: key,
              content: JSON.stringify(
                this.currentType == 0
                  ? {
                      culture: key,
                      texts: this.i18nConfigDic[key],
                    }
                  : this.i18nConfigDic[key],
                null,
                2
              ),
            };
          }),
        };

        saveAppState();
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
          this.languages.push(element.key);
          try {
            var contentJson = JSON.parse(element.content);
            if (
              contentJson.texts &&
              typeof contentJson.texts == 'object' &&
              contentJson.culture
            ) {
              this.currentType = 0;
              this.i18nConfigDic[element.key] = contentJson.texts;
            } else {
              this.currentType = 1;
              this.i18nConfigDic[element.key] = contentJson;
            }
            Object.keys(this.i18nConfigDic[element.key]).forEach(
              (k) => (kys[k] = true)
            );
          } catch (error) {
            if (this.i18nConfigDic[element.key] == null)
              this.i18nConfigDic[element.key] = {};
          }
        });
        this.keys = Object.keys(kys);

        this.search(this.searchTerm);
        console.log(this.i18nConfigDic);
      },
    },
  });
})();
