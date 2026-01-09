import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Murasame's Blog",
	subtitle:
		"我已经下了决心，要与深爱的少女一起在这片土地生活下去。我对此无比自豪。",
	lang: "zh_CN", // 语言代码，例如 'en', 'zh_CN', 'ja' 等。
	themeColor: {
		hue: 155, // 主题颜色的默认色调，范围从 0 到 360。例如：红色：0，青色：200，蓝绿色：250，粉色：345
		fixed: false, // 为访客隐藏主题颜色选择器
	},
	banner: {
		enable: true,
		src: "assets/images/Murasame-Banner.jpg", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
		position: "center", // 等同于 object-position，仅支持 'top', 'center', 'bottom'。默认为 'center'
		credit: {
			enable: true, // 显示横幅图像的致谢文本
			text: "2025 Murasame", // 要显示的致谢文本
			url: "https://blog.shirayukinoa.top", // （可选）指向原始艺术品或艺术家页面的 URL 链接
		},
	},
	toc: {
		enable: true, // 在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题深度，范围从 1 到 3
	},
	favicon: [
		// 留空此数组以使用默认 favicon
		{
			src: "/favicon/Murasame-logo.jpg", // favicon 的路径，相对于 /public 目录
			theme: "light", // （可选）'light' 或 'dark'，仅在您为亮色和暗色模式设置了不同的 favicon 时使用
			sizes: "32x32", // （可选）favicon 的尺寸，仅在您有不同尺寸的 favicon 时设置
		},
	],
	preloader: {
		enable: false, // 启用页面加载遮罩
		text: "(∠・ω< )⌒★", // 自定义显示文字，留空则使用网站标题
		duration: 2000, // 遮罩显示时长（毫秒）
	},
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.About,
		LinkPreset.Contact,
		LinkPreset.Friends,
		LinkPreset.Donate,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/Murasame.jpg", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Murasame",
	bio: "我已经下了决心，要与深爱的少女一起在这片土地生活下去。我对此无比自豪。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // 访问 https://icones.js.org/ 获取图标代码
			// 如果尚未包含相应的图标集，您需要安装它
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://github.com/LeiSureLyYrsc",
		},
		{
			name: "Email",
			icon: "fa6-solid:envelope",
			url: "mailto:contact@shirayukinoa.top",
		},
		{
			name: "QQ群",
			icon: "fa6-brands:qq",
			url: "https://qm.qq.com/q/EHO5FhUHIW",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（如背景颜色）正在被覆盖，请参阅 astro.config.mjs 文件。
	// 请选择深色主题，因为此博客主题目前仅支持深色背景颜色
	theme: "github-dark",
};
