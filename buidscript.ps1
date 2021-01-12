yarn
Remove-Item -Recurse -Force .\media\external\
New-Item -ItemType Directory .\media\external\

Copy-Item .\node_modules\vuetify\dist\vuetify.min.css .\media\external\vuetify.css
Copy-Item .\node_modules\vuetify\dist\vuetify.min.js .\media\external\vuetify.js
Copy-Item .\node_modules\vue\dist\vue.min.js .\media\external\vue.js


Copy-Item -Recurse .\node_modules\material-design-icons-iconfont\dist\* .\media\external\
Remove-Item -Force .\media\*.eot
Get-ChildItem -Force -Recurse .\media\**\*.eot | Remove-Item 
Get-ChildItem -Force -Recurse .\media\**\*.ttf | Remove-Item 
Get-ChildItem -Force -Recurse .\media\**\*.woff | Remove-Item 
Get-ChildItem -Force -Recurse .\media\external\**\*.map | Remove-Item 
Get-ChildItem -Force -Recurse .\media\external\**\*.json | Remove-Item 
Get-ChildItem -Force -Recurse .\media\**\LICENSE | Remove-Item 
npm run build 