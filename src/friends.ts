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
