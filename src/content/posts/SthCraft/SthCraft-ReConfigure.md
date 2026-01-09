---
title: SthCraft 服务器重新规划
published: 2026-01-09
description: '我在 SthCraft 的服务器规划的点点滴滴,充满了汗水与眼泪😢'
image: ''
tags: [MineCraft, 我的世界, 服务器]
category: 'SthCraft'
draft: false 
lang: 'zh_CN'
---

> [!TIP]
> 此文章可能会在服务器有所变化时更新
>
> 本来想的是规划完后边实现边写的   
> 结果一笔都没动,也不知道实现完后怎么下笔,就不写过程了

## 前情提要

笔者原服务器虚拟机分配的是 `24H50G` 的配置,但由于其遗留问题导致体验不佳:
> - 使用的是 `FnOS (飞牛云)` ,因不明问题导致无法正常进行普通关机操作,只能强制停止
> - 一机 N 服,不易管理,也有可能会造成 **一服卡顿,全服遭殃** 的惨状
> - 等想起来了再写

## 新的服务器规划

我将这个一台虚拟机的配置拆分成了三个虚拟机,如下:
> - 1. `12H25G-Debian13` - Cobblemon 服务器 `Mod1`
> - 2. `12H25G-WindowsServer2025` - 剑与王国 服务器 `Mod2`
> - 3. `4H4G-Debian13` - 端口转发 网页服务 `Proxy`

## 操作环境

宿主机:
> - `Windows Server 2025 Datacenter` - 系统
> - `Hyper-V` - 虚拟机提供者
> - `AMD Ryzen 9 9950X3D` - CPU

## 虚拟机各自负责的服务

> [!TIP]
> 以下服务器都安装了 `MCSManager` 方便控制服务的启停 **YYDS!**

1. Mod1
> - `Pokemon` - `MineCraft` 服务器
> - `Frpc` - `PlasmoVoice` 语音端口转发
2. Mod2
> - `剑与王国` - `MineCraft` 服务器
> - `Frpc` - `PlasmoVoice` 语音端口转发
3. Proxy
> - `HAProxy` - 端口转发,可以按需配置 `Proxy V2` 转发
> - `SamWaf` - 网页反代,目前转发了 `MCSM-Web` x1, `MCSM-Daemon` x3, `BlueMap 网页地图` x1
> - `MCP` - 类似于 `Frp` 的东西,可以按需配置 `Proxy V2` 转发
> - `MariaDB-BlueMap` - 针对于 `BlueMap` 的 `SQL` 存储数据库

### Docker Compose
1. `Proxy` - `SamWaf`
```bash
services:
  samwaf:
    image: 'docker.1ms.run/samwaf/samwaf'
    network_mode: host
    restart: unless-stopped
    volumes:
      - ./conf:/app/conf
      - ./data:/app/data
      - ./logs:/app/conf
      - ./ssl:/app/conf
```
2. `Proxy` - `HAProxy`
```bash
version: '3'
services:
  haproxy:
    image: 'docker.1ms.run/haproxy'
    container_name: haproxy
    volumes:
      - ./haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg 
    network_mode: host
    restart: unless-stopped
```

### HAProxy 配置文件
1. `Proxy`
```bash
listen mod1_minecraft # Mod1 支持 HAProxy
  bind 0.0.0.0:25565
  bind :::25565
  mode tcp
  timeout connect 10s
  timeout client 1m
  timeout server 1m
  option tcp-check
          
  server minecraft-mod1 IP:Port check-send-proxy check send-proxy-v2

listen mod2_minecraft # Mod2 不支持 HAProxy
  bind 0.0.0.0:25566
  bind :::25566
  mode tcp
  timeout connect 10s
  timeout client 1m
  timeout server 1m
  option tcp-check
          
  server minecraft-mod2 IP:Port check-send-proxy check
```