---
title: 为 KDE 桌面添加休眠按钮
published: 2026-01-10
description: ''
image: ''
tags: [Linux 桌面, KDE, 休眠]
category: 'Linux 桌面'
draft: false 
lang: 'zh_CN'
---

## 概述
部分 `Ubuntu` 发行版安装后 (如 `Kubuntu`, `Linux Mint`) 可能够并不能够在你的 KDE 桌面上正常显示 `休眠` 按钮,但可以使用指令进行正常休眠操作,因此需要一个神秘小文件去让他显示出来

> [!TIP]
> `休眠` 模式是什么?   
> 将当前操作系统正在运行的程序和数据保存到硬盘中，然后断电
>
> 那 `睡眠` 是什么?   
> 设备在不使用时将当前的工作状态和数据保存在内存中，以便快速唤醒和恢复工作

### **我始终认为一个电脑是必须拥有休眠功能的,即使它没有用处**


## 前情提要
### 请在终端输入这条指令:
```bash
sudo systemctl hibernate
```
此指令会立即执行休眠模式

若您的电脑在关机后不能正确恢复你**执行指令后的页面**,那证明寄了,这时候你就需要去配置 **Swap** 和 **Grub**

关于 **Swap** 的配置: [为 Linux 配置 Swap](/posts/linuxserver/swap/)

关于 **Grub** 的配置: [让 Linux 支持休眠模式](/posts/linuxdesktop/grub-hibernate/)

## 添加休眠按钮
### 创建文件夹
```bash
sudo mkdir -p /etc/polkit-1/localauthority/50-local.d
```
### 创建并编辑文件
```bash
sudo vim /etc/polkit-1/localauthority/50-local.d/com.ubuntu.enable-hibernate.pkla
```
### 粘贴以下内容:
```bash
[Re-enable hibernate by default in upower]

Identity=unix-user:*

Action=org.freedesktop.upower.hibernate

ResultActive=yes

[Re-enable hibernate by default in logind]

Identity=unix-user:*

Action=org.freedesktop.login1.hibernate;org.freedesktop.login1.handle-hibernate-key;org.freedesktop.login1;org.freedesktop.login1.hibernate-multiple-sessions;org.freedesktop.login1.hibernate-ignore-inhibit

ResultActive=yes
```
保存后,重启你的电脑,你就会在 `开始` 上看到你的 `休眠` 按钮

<img src="/LinuxDesktop/Hello-Hibernate.jpg" alt="阿里云服务器修改密码" width="460" height="460" />