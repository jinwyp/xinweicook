# 新味服务端

## Mac 本地开发环境

``` bash
# 安装 Homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# 安装 nodejs 和 mongodb
brew install nodejs mongodb
# 启动 mongodb
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
# 更新 node 包然后启动服务，启动服务也可以用 nodemon index.coffee 或 gulp
rake update && rake server
```

## 文档工具

运行 `gulp doc` 启动生成 GitBook 文档的工具


## 初始化数据

1. 使用 [PAW] 的 init-Data 分组中的接口初始化数据，或用浏览器访问 http://127.0.0.1:3003/api/administrator/initadminuser 初始化管理员
2. 使用默认的管理员密码登录 http://127.0.0.1:3003/admin/src



## 远程部署



### 使用 PM2 部署

首先需要安装 PM2 `npm install pm2 -g` [PM2 文档](https://github.com/Unitech/pm2)

先确认自己的公钥已经加到服务器上，对应的私钥存储在 `~/.ssh/id_rsa` 中，

更新服务器开发分支代码并重启 `pm2 deploy ecosystem.json dev`



## 文档

`doc` 下的文档使用 [GitBook] 编写，每隔十分钟自动同步到测试服务器。[可以在这里在线阅读](http://新味.com/api-test/doc/)。



[Homebrew]: https://brew.sh
[nodejs]: https://nodejs.org
[mongodb]: https://www.mongodb.org
[GitBook]: https://gitbook.com
[lunchy]: https://github.com/eddiezane/lunchy
[paw]: https://luckymarmot.com/paw