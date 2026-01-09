---

title: 为 Linux 配置免密登录
published: 2025-12-29
description: ''
image: ''
tags: [云服务器, SSH, 服务器安全, 秘钥, ssh-key, Linux]
category: '服务器'
draft: false 
lang: 'zh_CN'

---

笔者在今天购买了一款阿里云日本地区 2H0.5G 的轻量应用服务器，系统选择的是 Debain12.10。鉴于 0.5G 的运行内存实属不够用，因此准备添加 SWAP。

## 服务器安全性配置

在配置 Swap 之前，对服务器登录的安全性进行升级。[Swap 配置文章传送门](/posts/linuxserver/swap/)

## 一.重置密码

首先，刚购买的服务器需要在阿里云控制台进行 重置密码 的操作，若使用的是阿里云预置镜像，则可以直接进行在线修改

<img src="/Configure-LinuxServer/aliyun-changepwd.png" alt="阿里云服务器修改密码" width="460" height="460" />

点击确定重置后，等待任务完成，完成后即可使用 SSH 客户端登录。

## 二.配置 SSH 秘钥登录

### 首先，在任意终端上输入以下指令:

```bash
ssh-keygen -t ed25519 -f my_ssh_key -C "contact@example.com"
```

此命令会帮助你生成一个基于 `ed25519` 算法，名为 `my_ssh_key`，主机名为 `contact@example.com` 的 SSH 公钥和私钥:

```bash
<C:\Users\Administrator>ssh-keygen -t ed25519 -f my_ssh_key -C "contact@example.com"
# 为秘钥配置密码,可以为空
Generating public/private ed25519 key pair.Enter passphrase (empty for no passphrase):
# 密码二次确认
Enter same passphrase again:
Your identification has been saved in my_ssh_key
# 文件被存储到 C:\Users\Administrator(你的用户名)\my_ssh_key.pub
Your public key has been saved in my_ssh_key.pub
The key fingerprint is:SHA256:
(以下省略N个字符......) contact@example.com
(以下省略N个字符......)
```

### 回到日本服务器的 SSH 客户端，输入以下内容:

> [!WARNING]
> 在进入编辑器必须先输入一个 `a` 字符进入 `Insert(编辑)` 模式，这样才能正确粘贴内容，粘贴完后键入 `Esc` 键才能进行保存退出 (`!wq`) 的操作！

```bash
# 编辑 SSH 公钥认证的配置文件
vim ~/.ssh/authorized_keys
```

将生成出来的 `my_ssh_key.pub` 复制粘贴进去，输入 `:wq` 保存并退出

如此，你就完成了秘钥配置过程，现在你可以在 SSH 客户端上通过秘钥登录服务器了！

## 三.禁用密码登录

### 首先，在 SSH 终端上输入以下指令:

```bash
# 编辑 SSH 服务器的配置文件
vim /etc/ssh/sshd_config
```

### 配置以下内容:

```bash
# 禁用密码登录
PasswordAuthentication no
```

配置完后输入 `:wq` 保存并退出

### 最后输入指令:

```bash
# 重启 ssh 服务器
service ssh restart
```

如此，你便完成了仅秘钥登录的配置，现在 SSH 服务器的安全性更高了！
