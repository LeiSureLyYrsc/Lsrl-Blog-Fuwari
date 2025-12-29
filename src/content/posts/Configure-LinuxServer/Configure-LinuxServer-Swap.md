---
title: 为 Linux 服务器配置 Swap
published: 2025-12-29
description: ''
image: ''
tags: [云服务器, Linux, Swap, 交换文件]
category: '服务器'
draft: false 
lang: 'zh_CN'
---

书接上文: [Linux 服务器 SSH 配置免密登录](/posts/configure-linuxserver-sshkey/)

笔者在今天购买了一款阿里云日本地区 2H0.5G 的轻量应用服务器，系统选择的是 Debain12.10。鉴于 0.5G 的运行内存实属不够用，因此准备添加 SWAP。

## 配置 Swap(交换文件)

### Swap 是什么??

**Swap** 是 Linux 系统中的一种内存管理机制，当物理内存不足时，操作系统会将不常使用的数据从内存中移到硬盘上的交换空间（Swap 分区或 Swap 文件），以释放内存资源供当前运行的程序使用

### 一.创建 swapfile 并启用(临时)

以下为指令示例:

```bash
# 在根目录里创建一个 8G 的 swapfile 文件
root@iZ6wef59gncpys39nq63y2Z:~# fallocate -l 8G /swapfile
# 将 swapfile 文件的权限改为 600，只允许 root 用户读写
root@iZ6wef59gncpys39nq63y2Z:~# chmod 600 /swapfile
# 让 Linux 将 swapfile 文件作为 swap 使用
root@iZ6wef59gncpys39nq63y2Z:~# mkswap /swapfile
Setting up swapspace version 1, size = 8 GiB (8589930496 bytes)
no label, UUID=(省略)
# 启用 swapfile 作为 swap 使用
root@iZ6wef59gncpys39nq63y2Z:~# swapon /swapfile
```

### 二.永久启用 Swapfile

在目前为止你的操作都仅**目前开机状态**可用，关机/重启后失效

我们需要修改 `/etc/fstab` 永久启动此 swapfile

在此之前，先进行备份:

```bash
# 复制 fstab 到 /etc/fstab.bak
cp /etc/fstab /etc/fstab.bak
```

随后输入:

```bash
# 打开自动挂载硬盘/文件的配置文件
vim /etc/fstab.bak
```

在文件末尾添加:

```bash
/swapfile none swap sw 0 0
```

配置完后输入 `:wq` 保存并退出

如此，就算你的系统关机/重启，此 swap 仍然会被自动启用

## 主播主播，那如何查看是否成功呢??

在 SSH 终端上输入以下指令:

```bash
free -h
```

看到有 Swap 便成功了

或者:

```bash
swapon -list
```

无需多说(

### 三.配置 swappiness 参数

抄自: [wyf9 - 设置 Swap 使用频率](https://wyf9.top/posts/linux-newinst/#设置-swap-使用频率)

`vm.swappiness` 值在 0 - 100 之间，值越大使用越频繁

> [!TIP]
> 服务器默认的 `vm.swappiness` 为 0(不使用),若服务器内存很小推荐进行修改

修改 `/etc/sysctl.conf`

```bash
# 打开 /etc/sysctl.conf
vim /etc/sysctl.conf
```

```bash
# 修改下述变量值,值越大 Swap 使用越频繁
vm.swappiness=20
```

配置完后输入 `:wq` 保存并退出

然后应用配置:

```bash
sudo sysctl -p
```

自此，我便得到了《高安全性》，《大内存》(迫真)的服务器！然后就可以开心地玩服务器了！