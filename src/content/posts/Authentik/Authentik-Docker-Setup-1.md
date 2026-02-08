---
title: 使用 Docker 部署 Authentik 统一认证服务 - 其一
published: 2026-02-05
description: ''
image: ''
tags: [SSO, Authentik]
category: 'SSO'
draft: false 
lang: 'zh_CN'
---

## 前情提要
主播有一些服务想分享给我的朋友，但是让朋友**给每个服务都注册且设置密码**非常麻烦   
虽然我目前也在使用朋友提供的 `SSO(单点认证)` 服务，但是他的服务面向于自己人，因此决定自建   
朋友目前用的是 `Authentik`，因此我也使用

> [!TIP]
> `Authentik` 是什么?   
> `Authentik` 是一个现代化的开源身份管理和身份验证平台，专为企业和个人提供身份验证、授权和访问管理解决方案

::github{repo="goauthentik/authentik"}

### 系列总览
- 其一 - 使用 `Docker` 部署 `Authentik` 统一认证服务 - [点我这里跳转](/posts/authentik/authentik-docker-setup-1/)
- 其二 - 为 `Authentik` 配置 `OIDC` 认证服务 - [点我这里跳转](/posts/authentik/authentik-oidc-2/)
- 其三 - 为 `Authentik` 配置 `LDAP` 认证服务 - [点我这里跳转](/posts/authentik/authentik-ldap-3/)

## 准备材料
- 一台装有 `Docker` 的 `Linux 发行版` 服务器
- 一个正常的网络环境

## 开始部署
> [!IMPORTANT]
> 📕本部署教程**很多**步骤都借鉴了 `Authentik` 官方文档   
> 🌏最后的参考文献会指向对应网站   
> 🤔相比起来官方文档，这里的优势是能用中文来讲解部署流程   
> 🕶如果你熟练英文，更推荐你翻到最下面的 `参考文献` 去寻找官方教程！[点我直达](#-参考文献)

### 一.🐋 获取官方编排
`Authentik` 的官方提供了一个 `Docker Compose(编排)` 脚本，请打开你的终端并执行以下命令
```bash
wget https://docs.goauthentik.io/docker-compose.yml
```
此命令会帮助你下载官方的编排文件   

> [!WARNING]
> **始终建议你的编排文件保存在一个单独的文件夹里面**   
> 比如 `mkdir Authentik && cd Authentik` 然后下载编排文件

如果呢 ~ 不方便下载的话，以下是 `Authentik` 的编排原文！ `2026-2-8`
```bash
services:
  postgresql:
    env_file:
    - .env
    environment:
      POSTGRES_DB: ${PG_DB:-authentik}
      POSTGRES_PASSWORD: ${PG_PASS:?database password required}
      POSTGRES_USER: ${PG_USER:-authentik}
    healthcheck:
      interval: 30s
      retries: 5
      start_period: 20s
      test:
      - CMD-SHELL
      - pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}
      timeout: 5s
    image: docker.io/library/postgres:16-alpine
    restart: unless-stopped
    volumes:
    - database:/var/lib/postgresql/data
  server:
    command: server
    depends_on:
      postgresql:
        condition: service_healthy
    env_file:
    - .env
    environment:
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY:?secret key required}
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.12.3}
    ports:
    - ${COMPOSE_PORT_HTTP:-9000}:9000
    - ${COMPOSE_PORT_HTTPS:-9443}:9443
    restart: unless-stopped
    volumes:
    - ./data:/data
    - ./custom-templates:/templates
  worker:
    command: worker
    depends_on:
      postgresql:
        condition: service_healthy
    env_file:
    - .env
    environment:
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB:-authentik}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER:-authentik}
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY:?secret key required}
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.12.3}
    restart: unless-stopped
    user: root
    volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - ./data:/data
    - ./certs:/certs
    - ./custom-templates:/templates
volumes:
  database:
    driver: local
```

### 二.🗒 在当前目录下生成配置文件
因为这是第一次安装，所以你需要生成两个东西:`密码` 和 `密钥`,请使用终端执行以下命令
```bash
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" >> .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" >> .env
```

### 三.🚀 ak，启动！
现在，你可以使用终端执行以下命令启动 `Authentik` 了
```bash
docker compose up -d
```
现在你可以访问 `http://<你服务器的 IP 地址>:9000/` 去访问你刚刚部署好的 `Authentik` 了！🎉   


**等等！**看了一会你会发现有点不对劲: 为什么访问 `http://<你服务器的 IP 地址>:9000` 是**直接到登录页面**的，我也没开始注册呀🤔，急急急！🤯   
也请您稍安勿躁，请看下面👇

#### ⚙ 访问初始化地址
实际上，`Authentik` 提供了一个**链接**来让你完成初始化⚙   
请使用你的浏览器访问以下地址
```bash
http://<你服务器的 IP 地址>:9000/if/flow/initial-setup/
```
完成初始配置后，你将登录并进入到 `Authentik` 的用户门户里

这下，真的恭喜你已经全部完成部署流程了！🚀


### 四.📧 配置全局邮箱(可选但推荐)
`Authentik` 可以在配置文件里配置 `SMTP 发件服务器` 用于向管理员们推送`警报，配置问题和新版本推送`   
也请不用担心你的发信次数少得可怜或者目前不想配置，`Authentik` 仍然可以为**每个注册，忘记密码的流程里**单独配置其独特的 `SMTP 发信服务器`

使用你的文本编辑器打开 `.env` 文件添加以下文本
```bash
# 填写你的 SMTP 服务器提供者地址
AUTHENTIK_EMAIL__HOST=localhost
AUTHENTIK_EMAIL__PORT=25
# 填写你的邮箱名和密码
AUTHENTIK_EMAIL__USERNAME=
AUTHENTIK_EMAIL__PASSWORD=
# 是否使用 StartTLS，端口为 587
AUTHENTIK_EMAIL__USE_TLS=false
# 是否使用 SSL，端口为 465
AUTHENTIK_EMAIL__USE_SSL=false
AUTHENTIK_EMAIL__TIMEOUT=10
# 邮件是从哪个地址发出的，填写其邮箱地址
AUTHENTIK_EMAIL__FROM=authentik@localhost
```

## 📕 参考文献
- https://docs.goauthentik.io/install-config/install/docker-compose/ - `Authentik` 官方文档: 使用 `Docker Compose` 安装
- https://docs.goauthentik.io/developer-docs/setup/full-dev-environment/#initial-setup - `Authentik` 官方文档: 初始化链接