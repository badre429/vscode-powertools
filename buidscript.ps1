Remove-Item -Recurse -Force .\media\external\
New-Item -ItemType Directory .\media\external\

Copy-Item .\node_modules\vuetify\dist\vuetify.css .\media\external\
Copy-Item .\node_modules\vuetify\dist\vuetify.js .\media\external\
Copy-Item .\node_modules\vue\dist\vue.js .\media\external\

Copy-Item -Recurse .\node_modules\material-design-icons-iconfont\dist\* .\media\external\

 