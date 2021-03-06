# 新味服务端

## Mac 本地开发环境



## 安装 Homebrew
``` bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## 安装 nodejs 和 mongodb
``` bash
brew install nodejs mongodb redis
```

[mongodb], [redis] 和 [nginx] 的启动方法可以用 `brew info mongodb redis` 查看。为了方便启动这些系统服务，可以用 `gem install lunchy` 安装 [lunchy]。



## 启动 mongodb
``` bash
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
```

## 更新npm包然后启动nodejs服务器，注意 coffeescript 需要全局安装

### 使用 Nodejs 下的 Nodemon 工具启动服务器
使用 `nodemon index.coffee` 启动服务。 注意 nodemon 配置文件为 nodemon.json

### 使用 Gulp 启动服务器
安装好 Gulp 和 CoffeeScript 后 命令行运行 `gulp` 即可启动服务器



## 文档
`doc` 下的文档使用 [GitBook] 编写，每隔十分钟自动同步到测试服务器。[可以在这里在线阅读](http://新味.com/api-test/doc/)。

#### 文档生成工具
编辑好文档后，运行 `gulp doc` 生成 GitBook 文档



## 初始化数据

1. 使用 [PAW] 的 init-Data 分组中的接口初始化数据，或用浏览器访问 http://127.0.0.1:3003/api/administrator/initadminuser 初始化管理员
2. 使用默认的管理员密码登录 http://127.0.0.1:3003/admin/src



## 远程部署



### 使用 PM2 部署

首先需要安装 PM2 `npm install pm2 -g` [PM2 文档](https://github.com/Unitech/pm2)

先确认自己的公钥已经加到服务器上，对应的私钥存储在 `~/.ssh/id_rsa` 中，

更新服务器开发分支代码并重启 `pm2 deploy ecosystem.json dev`





[Homebrew]: https://brew.sh
[nodejs]: https://nodejs.org
[mongodb]: https://www.mongodb.org
[redis]: http://redis.io
[nginx]: http://nginx.org
[GitBook]: https://gitbook.com
[lunchy]: https://github.com/eddiezane/lunchy
[paw]: https://luckymarmot.com/paw