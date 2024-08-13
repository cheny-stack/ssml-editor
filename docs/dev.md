### 打包发布 
1. 打包
```shell
yarn build
```
2. 发布
```shell
## 查看你的.npmrc设置，确保你的 registry 是https://www.npmjs.com/, 而不是淘宝源
# 在终端npm login，登录你的账号
set http_proxy=http://10.10.217.176:9787
set https_proxy=http://10.10.217.176:9787
npm login --registry https://registry.npmjs.org/ 
npm publish --access public --registry https://registry.npmjs.org/ 
```
