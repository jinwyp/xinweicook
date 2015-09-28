## Req

GET `/api/user/weixin/oauthcode`

##### 获取微信 code 页面 /api/user/weixin/oauthcode 用于登录或注册成功后跳转到该页面。 如果用户已有openid，直接会调转到返回首页/mobile，否则跳转到获取Code授权页面, 用户授权后，微信服务器成功返回后跳转到获取OpenID页面(/api/user/weixin/openid)。
##### 然后如果用户已有openid，直接会调转到返回首页/mobile, 否则访问微信服务器获取OpenID，并保存到用户信息上，返回首页/mobile。



[微信官方文档](http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html)




## Res



### Body


