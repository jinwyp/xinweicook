# 新味服务端

## 环境

0. [Homebrew](https://brew.sh)
1. [Vagrant](https://vagrantup.com)
2. [Ansible](http://ansible.com)

## 虚拟机环境

1. nodejs
2. mongodb
3. redis
4. nginx

## 本地调试

``` bash
rake test # 在 VirtualBox 中测试 API
rake server # 在 VirtualBox 中创建干净的开发环境
```

## 远程部署

``` bash
rake deploy # 自动设置服务端环境并部署服务
rake update # 自动更新服务端代码
```
