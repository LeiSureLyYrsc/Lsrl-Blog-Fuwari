---
title: 使用自己的 SSO 单点登录 Cloudflare
published: 2026-07-21
description: ''
image: ''
tags: [Cloudflare, SSO]
category: 'SSO'
draft: false 
lang: 'zh_CN'
---

# 前情提要
我去我去，Cloudflare 居然可以通过自己的 SSO 登录了！！！   

在使用之前，你可能需要一个有效的 `银行卡` 去注册 `ZeroTurst Free Plan`:

- MasterCard (万事达)   
- VISA   
- AMEX (美国运通)   
- UnionPay (银联) - 必须为 **信用卡**   
- Discover Card   

可以使用 `银联信用卡` 进行验证，也可以使用国内办理的 `MasterCard-万事达` 借记卡进行验证   
至少来说，`招商银行`的`万事达借记卡普卡`是可以验证的   
我没有 `VISA` `AMEX` 等卡，可以自行测试

# 开始配置
:::IMPORTANT[不知道写啥了]
我将使用 `Authentik` 作为我的私有 SSO 配置 Cloudflare 的单点登录   
其他的自建 SSO 配置大同小异，可以自行探索
:::

## 一.创建应用程序 (私有 SSO)

为 `Authentik` 配置 OIDC 认证服务 - 其二 - [点我这里跳转](/posts/authentik/authentik-oidc-2/)   
:::IMPORTANT[额外提醒]
**还需要添加签名密钥** - [点我这里跳转](/posts/authentik/authentik-oidc-2/#添加签名密钥)   
:::

:::IMPORTANT[注意]
`OIDC` 返回的 `email` 必须为你配置私有域的邮箱
:::

## 二.创建一个 IDP(身份提供者) (Cloudflare)

1.登录进 `Cloudflare Dashboard`，点击侧边栏的 `Zero Turst`
<img src="/Cloudflare/CF-ZeroTurstSSO-1.png" alt="如何进入 Zero Turst 门户" width="600" height="600" />

2.找到并打开 **集成 - 标识提供程序**，点击 **添加标识提供程序**
:::CAUTION[必须注意的事情]
开启 SSO 登录后，你的私有域邮箱将**无法使用密码登录**！   
建议你在 **二.2** 的流程中再勾选一个 `One-time PIN` (邮箱验证码) 保证你对账户的访问   
`One-time PIN` 只需要你点一下即可直接加入   

其他补救方案 - [文章最下面](/posts/cloudflare/cloudflare-zeroturst-sso-login-configure/#主播我的邮箱和SSO都报废了怎么办？)
:::
<img src="/Cloudflare/CF-ZeroTurstSSO-2.png" alt="如何进入 Zero Turst 门户" width="600" height="600" />
<img src="/Cloudflare/CF-ZeroTurstSSO-9.png" alt="如何进入 Zero Turst 门户" width="600" height="600" />


3.选择 **OpenID Connect**，填写图下配置，配置完后点击保存
<img src="/Cloudflare/CF-ZeroTurstSSO-5.png" alt="如何进入 Zero Turst 门户" width="600" height="600" />
*推荐打开 **代码交换证明密钥 (PKCE)** - 如果可用* 

4.点击测试，若授权成功会显示以下内容
<img src="/Cloudflare/CF-ZeroTurstSSO-6.png" alt="如何进入 Zero Turst 门户" width="600" height="600" />

## 三.配置单点登录 (Cloudflare)
1.返回到主门户，找到并打开 **管理账户-成员-设置**，点击 **添加域** 进行对象域的 **TXT 验证**
<img src="/Cloudflare/CF-ZeroTurstSSO-7.png" alt="7" width="600" height="600" />
验证成功后，启用此域

2.退出登录，输入私有域，Enjoy😋
<img src="/Cloudflare/CF-ZeroTurstSSO-8.png" alt="8" width="600" height="600" />

# 主播我的邮箱和SSO都报废了怎么办？
*适用于主账号为私有域的情况下*

Cloudflare 提供了一种基于 `API Key` 的补救方式，如图，创建后请妥善保存你的 `API Key`   
不做使用教程，如果你需要就请使用 `AI搜索`
<img src="/Cloudflare/CF-ZeroTurstSSO-10.png" alt="10" width="600" height="600" />
或者，添加一个**私有域**外的 `Super Administrator` 作为补救方案
<img src="/Cloudflare/CF-ZeroTurstSSO-11.png" alt="11" width="600" height="600" />

## 主播那我都没有怎么办?
那没招了，你的某种服务维护能力到达了一种超乎常人的境界   
那么恭喜你！你可以选择如下人物和称号作为你的人设:
- `丰川祥子` - **神人**
- `永雏塔菲` - **糖丸**   
*自己去找官方人员发工单处理，祝你好运*
