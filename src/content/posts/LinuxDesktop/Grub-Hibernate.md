---
title: 让 Linux 支持休眠模式
published: 2026-01-10
description: ''
image: ''
tags: [休眠, Grub]
category: 'Linux 桌面'
draft: false 
lang: ''
---

## 概述
笔者在使用 `Linux Mint` 的过程中,将电脑直接盒盖放包里出门玩   
结果掏出来后发现包是**温热**的   
有点不对劲,于是摸了摸电脑   
**果然,电脑是热的,他没有关机啊啊啊！！！！！(此处省略 N 个啊！)**   
研究了以下,盒盖实际上是 `睡眠` 模式,并不是**完全断电**的电源模式   
我应该需要的配置是 `休眠` 模式

> [!TIP]
> `休眠` 模式是什么?   
> 将当前操作系统正在运行的程序和数据保存到硬盘中，然后断电
>
> 那 `睡眠` 是什么?   
> 设备在不使用时将当前的工作状态和数据保存在内存中，以便快速唤醒和恢复工作

### **我始终认为一个电脑是必须拥有休眠功能的,即使它没有用处**

## 准备工作
### 请在终端输入这条指令:
```bash
sudo systemctl hibernate
```
此指令会立即执行休眠模式

若您的电脑在关机后不能正确恢复你**执行指令后的页面**,那证明寄了,这时候你就需要去配置 **Swap**

关于 **Swap** 的配置: [为 Linux 配置 Swap](/posts/linuxserver/swap/)

## 为 Grub 添加休眠参数
### 编辑 Grub 配置文件
```bash
sudo vim /etc/default/grub
```

### 找到 `GRUB_CMDLINE_LINUX_DEFAULT` 行并编辑
#### 若使用 Swap 分区
```bash
GRUB_CMDLINE_LINUX_DEFAULT='quiet splash resume=UUID=你的交换分区 UUID'
```
通过 `sudo lsblk` 查看你的 **Swap** 分区   
然后使用 `sudo blkid /dev/xxx` 查看对应分区的 **UUID** (`/dev/xxx` 为可选参数)

#### 若使用 Swapfile 文件
```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash resume=UUID=你的交换分区 UUID resume_offset=你 Swapfile 的 offset 值"
```
通过 `sudo filefrag -v /swapfile` 找到所需值:   
```bash
Filesystem type is: ef53
File size of /swapfile is 21474836480 (5242880 blocks of 4096 bytes)
 ext:     logical_offset:     physical_offset: length:   expected: flags:
   0:        0..       0:  220852224.. 220852224:      1:
   1:        1..    4095:  220852225.. 220856319:   4095:             unwritten
```
`physical_offset`: 第一行 (ext 0) 的 第一个值: `220852224`

### 更新 Grub 和 initramfs
修改后需更新引导程序配置并重启:
```bash
# 更新 GRUB（适用于 BIOS 系统）
sudo update-grub
 
# 若使用 UEFI，可能需要更新 grub-efi
sudo update-grub-efi
 
# 更新 initramfs (确保内核加载时识别交换空间)
sudo update-initramfs -u -k all  # 更新所有内核的 initramfs
```
如此,你的电脑就具有了 **休眠** 功能,现在可以尝试 [指令休眠](./#准备工作) 了！