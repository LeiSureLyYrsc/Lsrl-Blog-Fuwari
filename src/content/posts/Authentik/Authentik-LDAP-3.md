---
title: 为 Authentik 配置 OIDC 认证服务 - 其三
published: 2026-02-07
description: ''
image: ''
tags: [SSO, Authentik]
category: 'SSO'
draft: false 
lang: 'zh_CN'
---

## 前情提要
除了 `OIDC` 以外，也有其他服务会使用上 `LDAP` 这个服务 (比如 `Jellyfin`,`LDAP`)
`Jellyfin` 的 `OIDC` 插件只有**官方客户端和网页**才能正常登录，若使用没有适配的第三方客户端会大事不妙😰

因此，此文章就讲述该如何在 `Authentik` 里面配置 `LDAP` 认证服务！

### 系列总览
- 其一 - 使用 `Docker` 部署 `Authentik` 统一认证服务 - [点我这里跳转](/posts/authentik/authentik-docker-setup-1/)
- 其二 - 为 `Authentik` 配置 `OIDC` 认证服务 - [点我这里跳转](/posts/authentik/authentik-oidc-2/)
- 其三 - 为 `Authentik` 配置 `OIDC` 认证服务 - [点我这里跳转](/posts/authentik/authentik-ldap-3/)

> [!TIP]
> `LDAP` 是什么？   
> `LDAP`（轻量级目录访问协议）是一种用于访问和管理目录服务的协议。   
> 主要提供一种集中式的方式来存储和管理用户、设备、组织等信息，并支持快速查询和身份验证。它广泛应用于企业环境中，用于统一身份认证、访问控制以及用户管理。

## 开始配置
> [!IMPORTANT]
> (●'◡'●) 仍然 ~~~ 还是一份免责声明！   
> 📕 本部署教程**很多** ~~(这太难了，长官！QAQ)~~ 步骤都借鉴了 `Authentik` 官方文档   
> 🌏最后的参考文献会指向对应网站   
> 😊相比起来官方文档，这里的优势是能用中文来讲解部署流程   
> 🕶如果你熟练英文，更推荐你翻到最下面的 `参考文献` 去寻找官方教程！[点我直达](#-参考文献)

### 一.创建 LDAP 自定义阶段
首先，你要去 `管理员门户` - `流程与阶段` - `阶段` 中创建**三个**新的 `阶段`
#### 1.Password Stage
建议命名为 `ldap-password-stage`   
命名完后直接点击 `创建` 即可
#### 2.Identification Stage
建议命名为 `ldap-identification-stage`   
**用户字段**选择 `用户名` 和 `电子邮箱`
**密码阶段**选择我们上个步骤创建的 `ldap-password-stage`
点击 `创建`
#### 3.User Login Stage
建议命名为 `ldap-userlogin-stage`
命名完后直接点击 `创建` 即可

### 二.创建 LDAP 认证流程
`阶段` 创建完后，你需要创建一个 `流程` 绑定这些 `阶段`
找到 `流程与阶段` - `流程` 并创建**一个**新的 `流程`

#### 1.创建流程
建议将**名称，标题，Slug**都命名为 `ldap-flow`   
**指定**选择 `身份验证`   
配置完后点击 `创建` 即可

#### 2.绑定流程
搜索 `ldap-flow` 点击 **蓝字超链接** 进入总览页面   
点击 `阶段绑定`，然后找到 `Bind existing Stage` (绑定已有阶段) 并顺序绑定以下 `阶段`
- `ldap-identification-stage` - 顺序 `10`
- `ldap-userlogin-stage` - 顺序 `30`
<img src="/Authentik/Ak-9.png" alt="放弃思考辣QAQ" width="600" height="600" />

### 三.创建 LDAP 应用程序
因为文本跟 `其二` 差不多，我直接搬过来了
- ① 在管理员门户里找到 `应用程序` 分类，展开并点击里面的 `应用程序` 类别 (我没说错，里面还有一个!)   
- ② 类别选中后，点击 `以提供程序创建` 来创建新的应用！
<img src="/Authentik/Ak-2.png" alt="添加应用程序" width="600" height="600" />

#### 1.应用程序
在弹出的页面中填入你 `应用程序` 中的基本信息
```bash
# 应用名 (必须): 在你用户门户里展示的名字
Application Name: LDAP
# 简写名 (必须): 在链接调用上使用的 ID，只能是英文，且必须小写
Slug: ldap
# 组 (可选): 可以让其在用户门户里分为同类
组(或者叫 Group):
# 其余不修改，也可按需配置，此处省略...
```
配置完后点击 `下一步`

#### 2.选择提供程序
在下图显示的界面中，选择 `LDAP Provider`   
然后点击 `下一步`
<img src="/Authentik/Ak-10.png" alt="提供程序" width="600" height="600" />

#### 3.配置提供程序
> [!WARNING]
> 请注意查看 `基于代码的 MFA 支持` 选项   
> 这可能会影响到你后续使用 `LDAP` 的体验！   

**绑定流程**选择 `ldap-flow`   
<img src="/Authentik/Ak-11.png" alt="提供程序" width="600" height="600" />
配置完后点击 `下一步`

#### 4.配置绑定
不管,直接下一步

#### 5.检查应用程序和提供程序 (配置概览)
检查你的配置无误后，点击 `提交`

### 四.创建一个服务账户
选择 `目录` - `用户`   
点击 `新建用户`
```bash
# 服务账户的用户名
用户名: ldapservice
```
配置完后点击 `创建用户`   
点击名字**左边箭头**展开其选项，然后点击 `设置密码` 为其配置一个密码
<img src="/Authentik/Ak-12.png" alt="创建用户" width="600" height="600" />

### 五.将 LDAP 的搜索权限分配给服务账户
#### 1.创建新角色
选择 `目录` - `角色`   
点击 `新建`
```bash
# 角色类别名
名称: LDAP Search
```
点击**蓝标超链接** 名字展开其总览，并点击 `用户`，然后点击 `添加已有用户` 给 `ldapservice` 分配进去
<img src="/Authentik/Ak-13.png" alt="创建角色" width="600" height="600" />
<img src="/Authentik/Ak-14.png" alt="分配角色" width="600" height="600" />

#### 2.分配角色给 LDAP 提供程序
选择 `应用程序` - `提供程序`   
找到 `Provider for LDAP`，点击其 **蓝字超链接** 进入总览页面   
点击 `权限`，然后点击 `Assign Object Permission`
<img src="/Authentik/Ak-15.png" alt="Assign Object Permission" width="600" height="600" />
<img src="/Authentik/Ak-16.png" alt="Assign Object Permission" width="600" height="600" />
```bash
角色: LDAP Search
选择 Search full LDAP directory
```
<img src="/Authentik/Ak-17.png" alt="配置 LDAP 权限" width="600" height="600" />
配置完后点击 `分配`

### 六.创建一个应用前哨
*因为作者的本地网络环境发力，因此转向生产环境进行示例*   
选择 `应用程序` - `前哨`，然后点击 `创建`   
以下是基础配置
```bash
# 前哨名字
Outpost Name: LDAP
类型: LDAP
```
<img src="/Authentik/Ak-18.png" alt="配置 LDAP 权限" width="600" height="600" />
点击 `创建`

### 七.验证配置
你可以在 `Linux` 和 `macOS` 上使用 `ldapsearch` 工具，或在 `Windows` 上使用 `dsquery` 工具来测试 `LDAP` 提供商
```bash
ldapsearch \
  -x \
  -H ldap://<LDAP outpost IP address>:389 \
  -D 'cn=ldapservice,ou=users,DC=ldap,DC=goauthentik,DC=io' \
  -w '<ldapuserpassword>' \
  -b 'DC=ldap,DC=goauthentik,DC=io' \
  '(objectClass=user)'
```
```bash
dsquery * -s <LDAP outpost IP address> -u "cn=ldapservice,ou=users,DC=ldap,DC=goauthentik,DC=io" -p <ldapuserpassword> -b "DC=ldap,DC=goauthentik,DC=io" -filter "(objectClass=user)"
```

出现一大串一大排输出就证明你的配置成了！🚀
