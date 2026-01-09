---
title: 为 Fuwari 添加友情链接
published: 2026-01-10
description: ''
image: ''
tags: [友情链接]
category: '博客'
draft: false 
lang: 'zh_CN'
---

> [!IMPORTANT]
> 基于 [翊羽 - Fuwari 博客添加友链页面详细教程](https://blog.skarie.top/posts/fuwari/fuwari添加友链页面/fuwari添加友链页面/) 的 **AI** 二次修改,非常感谢他的经验分享   
> 具体升级可以去查看 [我的友情链接](/friends/)

## 一.创建友情链接配置文件
在 `src/config/` 目录下创建 `friends.ts` 文件:
```bash
import friendsData from "./friends.json";

export interface FriendLink {
	name: string;
	url: string;
	description: string;
	avatar?: string;
	// avatar 支持三种格式：
	// 1. 外部链接：以 http:// 或 https:// 开头
	// 2. public 目录：以 / 开头，如 /images/avatar.jpg
	// 3. 本地路径：相对于 src 目录，如 assets/images/avatar.jpg
}

export interface FriendCategory {
	title: string;
	links: FriendLink[];
}

// 从 JSON 文件导入友链数据
export const friendCategories: FriendCategory[] = friendsData;

// 保持向后兼容：导出所有友链的扁平数组
export const friendLinks: FriendLink[] = friendCategories.flatMap(
	(category) => category.links,
);
```

## 二.创建友情链接卡片组件
在 `src/components/misc/` 目录下创建 `FriendLinkCard.astro` 文件:
```bash
---
import path from "node:path";
import { Image } from "astro:assets";
import { url } from "../../utils/url-utils";

interface Props {
  name: string;
  url: string;
  description: string;
  avatar?: string;
}

const { name, url: linkUrl, description, avatar } = Astro.props;

// 判断头像路径类型
const isExternal = avatar?.startsWith("http://") || avatar?.startsWith("https://");
const isPublic = avatar?.startsWith("/");
const isLocal = avatar && !isExternal && !isPublic;

// 处理本地图片
let localImage;
if (isLocal && avatar) {
  const files = import.meta.glob<ImageMetadata>("../../**", {
    import: "default",
  });
  const normalizedPath = path
    .normalize(path.join("../../", avatar))
    .replace(/\\/g, "/");

  const file = files[normalizedPath];
  if (file) {
    localImage = await file();
  } else {
    console.error(
      `\n[ERROR] Friend link avatar not found: ${normalizedPath.replace("../../", "src/")}`,
    );
  }
}

// 获取头像 URL
let avatarSrc = "";
if (isExternal) {
  avatarSrc = avatar || "";
} else if (isPublic) {
  avatarSrc = url(avatar || "");
}
---

<a
  href={linkUrl}
  target="_blank"
  rel="noopener noreferrer"
  class="group flex items-center gap-4 p-6 min-h-[110px] rounded-lg bg-[var(--btn-plain-bg-hover)] hover:bg-[var(--btn-card-bg-hover)] active:bg-[var(--btn-card-bg-active)] transition-all duration-200"
>
  <div class="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 relative">
    {avatar && isLocal && localImage ? (
      <Image
        src={localImage}
        alt={name}
        class="w-12 h-12 rounded-full object-cover absolute inset-0"
        loading="lazy"
      />
    ) : avatar && avatarSrc ? (
      <img
        src={avatarSrc}
        alt={name}
        class="w-12 h-12 rounded-full object-cover absolute inset-0"
        loading="lazy"
        onerror="this.style.display='none';"
      />
    ) : null}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class:list={[
        "w-6 h-6 text-[var(--primary)]",
        avatar && ((isLocal && localImage) || (avatarSrc && !isLocal)) ? "hidden" : "",
      ]}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  </div>
  <div class="flex-1 min-w-0">
    <div class="font-bold text-base text-90 group-hover:text-[var(--primary)] transition-colors mb-1 truncate">
      {name}
    </div>
    <div class="text-sm text-neutral-600 dark:text-neutral-400">
      {description}
    </div>
  </div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 h-4 text-neutral-400 group-hover:text-[var(--primary)] transition-colors flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
</a>
```

## 三.创建友情链接 Markdown 内容文件
在 `src/content/spec/` 目录下创建 `friends.md` 文件:
```bash
# 🌟 友链申请



## 申请方式
请在您的网站添加本站链接后，**Fork** 以下仓库对 `/src/friends.json` 进行修改，然后提交 Pull Requests

正常来讲，你应该修改名为 `❤️Murasame's Friends` 的 **title**

::github{repo="LeiSureLyYrsc/Lsrl-Blog-Fuwari"}

## 本站信息

{
    "name": "名字",
    "url": "链接",
    "description": "描述",
    "avatar": "头像"
}
```

## 四.创建友情链接页面
在 `src/pages/` 目录下创建 `links.astro` 文件:
```bash
---
import { getEntry, render } from "astro:content";
import Markdown from "@components/misc/Markdown.astro";
import MainGridLayout from "../layouts/MainGridLayout.astro";
import FriendLinkCard from "@components/misc/FriendLinkCard.astro";
import { friendCategories } from "@/friends";

const friendsPost = await getEntry("spec", "friends");

if (!friendsPost) {
  throw new Error("Links page content not found");
}

const { Content } = await render(friendsPost);
---
<MainGridLayout title="❤️友链" description="友情链接">
    <!-- 友链卡片区域 - 按栏目分组显示 -->
    {friendCategories.map((category) => (
        category.links.length > 0 && (
            <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 mb-6">
                <div class="card-base z-10 px-9 py-6 relative w-full">
                    <div class="flex items-center gap-3 mb-6">
                        <h2 class="text-2xl font-bold text-[var(--primary)]">{category.title}</h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.links.map((link) => (
                            <FriendLinkCard
                                name={link.name}
                                url={link.url}
                                description={link.description}
                                avatar={link.avatar}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    ))}

    <!-- 说明文字区域 - 放在后面 -->
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
        <div class="card-base z-10 px-9 py-6 relative w-full">
            <Markdown class="mt-2">
                <Content />
            </Markdown>
        </div>
    </div>
</MainGridLayout>
```

## 五.添加导航栏链接
编辑 `src/config.ts` 文件，在 `navBarConfig` 中添加友链链接:
```bash
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: "友链",
      url: "/friends/", // 友链页面路径
      external: false,
    },
    {
      name: "GitHub",
      url: "https://github.com/saicaca/fuwari",
      external: true,
    },
  ],
};
```

## 六.添加友情链接数据
创建 src/config/friends.json 文件，添加您的友链:
```bash
[
	{
		"title": "❤️Friends",
		"links": [
        {
            "name": "名字",
            "url": "链接",
            "description": "描述",
            "avatar": "头像"
        }
		]
	},
	{
		"title": "🤝Workmates",
		"links": [
        {
            "name": "名字",
            "url": "链接",
            "description": "描述",
            "avatar": "头像"
        }
		]
	}
]

```