---
title: 为 Authentik 配置 OIDC 认证服务 - 其二
published: 2026-02-06
description: ''
image: ''
tags: [SSO, Authentik]
category: 'SSO'
draft: false 
lang: 'zh_CN'
---

## 前情提要
在上一篇文章: `使用 Docker 部署 Authentik 统一认证服务 - 其一` 中你已成功使用 `Docker` 部署好了一个 `Authentik` 实例并成功进行了初始化，哦咩得多(恭喜你)！🎉   

那么呢 ~~~ 此文章就讲述该如何在 `Authentik` 里面配置 `OIDC` 认证服务！

### 系列总览
- 其一 - 使用 `Docker` 部署 `Authentik` 统一认证服务 - [点我这里跳转](/posts/authentik/authentik-docker-setup-1/)
- 其二 - 为 `Authentik` 配置 `OIDC` 认证服务 - [点我这里跳转](/posts/authentik/authentik-oidc-2/)
- 其三 - 为 `Authentik` 配置 `LDAP` 认证服务 - [点我这里跳转](/posts/authentik/authentik-ldap-3/)

> [!TIP]
> `OIDC` 是什么？   
> `OpenID Connect (OIDC)`是一种基于 `OAuth 2.0` 协议的身份验证协议，旨在让应用程序能够验证用户的身份，同时还能获取关于用户的基本信息 (称为 `身份令牌`)

## 开始配置
> [!IMPORTANT]
> (●'◡'●) 仍然 ~~~ 和上个文章一样的免责声明！   
> 📕 本部署教程**部分** ~~(确实是太简单了 QwQ)~~ 步骤都借鉴了 `Authentik` 官方文档   
> 🌏最后的参考文献会指向对应网站   
> 😊相比起来官方文档，这里的优势是能用中文来讲解部署流程   
> 🕶如果你熟练英文，更推荐你翻到最下面的 `参考文献` 去寻找官方教程！[点我直达](#-参考文献)
### 一.打开管理员门户
首先，在浏览器打开并登录部署好的 `Authentik` 实例，随后点击 `管理员界面`
<img src="/Authentik/Ak-1.png" alt="管理员界面指向" width="600" height="600" />

### 二.添加应用程序
- ① 在管理员门户里找到 `应用程序` 分类，展开并点击里面的 `应用程序` 类别 (我没说错，里面还有一个!)   
- ② 类别选中后，点击 `以提供程序创建` 来创建新的应用！
<img src="/Authentik/Ak-2.png" alt="添加应用程序" width="600" height="600" />

#### 1.应用程序
在弹出的页面中填入你 `应用程序` 中的基本信息
```bash
# 应用名 (必须): 在你用户门户里展示的名字
Application Name: 测试
# 简写名 (必须): 在链接调用上使用的 ID，只能是英文，且必须小写
Slug: test
# 组 (可选): 可以让其在用户门户里分为同类
组(或者叫 Group):
# 其余不修改，也可按需配置，此处省略...
```
配置完后点击 `下一步`
<img src="/Authentik/Ak-3.png" alt="应用程序" width="600" height="600" />

#### 2.选择提供程序
在下图显示的界面中，选择 `Oauth2/OpenID Provider`   
然后点击 `下一步`
<img src="/Authentik/Ak-4.png" alt="提供程序" width="600" height="600" />

#### 3.配置提供程序
在下图显示的界面中，填入你 `提供程序` 中的基本信息
```bash
# 此处懂得都懂
提供程序名: Provider for Test
# 授权流程，建议选择 explicit 字段
授权流程: default-provider-authorization-explicit-consent (Authorize Application)
# 其余不修改，也可按需配置，此处省略...
```
配置完后点击 `下一步`
<img src="/Authentik/Ak-5.png" alt="配置提供程序" width="600" height="600" />

#### 4.配置绑定
不管,直接下一步

#### 5.检查应用程序和提供程序 (配置概览)
检查你的配置无误后，点击 `提交`

### 二.查看 OIDC 配置信息
- ① 在管理员门户里找到 `应用程序` 分类，展开并点击里面的 `提供程序` 类别
- ② 点击刚刚创建的 `提供程序`
<img src="/Authentik/Ak-6.png" alt="查看 OIDC 配置信息" width="600" height="600" />

> [!TIP]
> 如果你是**用户** (我指的是**直接使用其他成品服务**的)     
> 你理应只需要了解 `OpenID 配置 URL`，`客户端 ID`,`客户端 Secret` (点击 `编辑` 即可查看)    
> `重定向 UIR/Origin` 不需要你自行配置，`Authentik` 会帮助你把第一个过了验证的 `OIDC` 客户端给加入进去

<img src="/Authentik/Ak-7.png" alt="查看信息" width="600" height="600" />
<img src="/Authentik/Ak-8.png" alt="查看客户端机密" width="600" height="600" />

## 📕 参考文献
- https://docs.goauthentik.io/add-secure-apps/providers/oauth2/create-oauth2-provider/ - `Authentik` 官方文档: 创建一个 `OIDC` 认证服务