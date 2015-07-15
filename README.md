# 新味服务端

## 本地开发环境

### Mac 物理机开发环境

0. [Homebrew]
1. [nodejs]
2. [mongodb]
3. [redis]
4. [nginx]

装完 [Homebrew] 后可以用以下命令按装这些依赖：

``` bash
brew install nodejs mongodb redis nginx
```

[mongodb], [redis] 和 [nginx] 的启动方法可以用 `brew info mongodb redis nginx` 查看。

为了方便启动服务，可以用 `gem install lunchy` 安装 [lunchy]。


#### 使用 Nodejs 下的Nodemon 工具启动服务器

然后 `nodemon index.coffee` 启动服务。 注意 nodemon 配置文件为 nodemon.json

#### 使用 Gulp 启动服务器

安装好 gulp 和 coffeescript 后 命令行运行gulp 即可启动服务器

#### 使用 Gulp 启动 Gitbook 文档工具
运行 gulp doc 启动生成 gitbook 文档的工具


#### 使用 Ruby 的 Rake 任务工具启动服务器

服务都启动后，用 `rake update_node` 更新 npm 依赖。

然后 `rake server` 启动服务。




### 本地虚拟机调试

本地虚拟机调试，主要用于测试服务是否能在各种纯净的发行版中成功部署，也可用于本地开发。依赖以下工具：

1. [Vagrant]
2. [VirtualBox]
3. [Ansible]

``` bash
rake vagrant_test # 在 VirtualBox 中测试 API
rake vagrant_server # 在 VirtualBox 中创建干净的开发环境
```



## 远程部署


### 使用 PM2 部署

首先需要安装 PM2 `npm install pm2 -g` [PM2 文档](https://github.com/Unitech/pm2)

更新服务器开发分支代码并重启 `pm2 deploy ecosystem.json devjin`



#### 运程部署使用 [Ansible] 实现。用于连接服务端的私钥可以放在 `./keys` 目录下，已经被 gitignore。

``` bash
rake deploy # 自动设置服务端环境并部署服务
rake update # 自动更新服务端代码
```

## 文档

`doc` 下的文档使用 [GitBook] 编写，通过我们的 CI 服务自动发布到文档服务器。


[Ansible]: http://ansible.com
[Homebrew]: https://brew.sh
[nodejs]: https://nodejs.org
[mongodb]: https://www.mongodb.org
[redis]: http://redis.io
[nginx]: http://nginx.org
[Vagrant]: https://vagrantup.com
[lunchy]: https://github.com/eddiezane/lunchy
[VirtualBox]: https://www.virtualbox.org
[GitBook]: https://gitbook.com
