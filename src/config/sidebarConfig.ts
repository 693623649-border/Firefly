import type { SidebarLayoutConfig } from "../types/sidebarConfig";

export const sidebarLayoutConfig: SidebarLayoutConfig = {
	enable: true,
	position: "left",
	tabletSidebar: "left",
	hideSidebarOnPostPage: false,
	noSidebarContentWidth: 0.6,
	leftComponents: [
		{ type: "profile", enable: true, position: "top", showOnPostPage: true },
		{
			type: "categories",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
		},
		{ type: "tags", enable: true, position: "sticky", showOnPostPage: true },
		{
			type: "sidebarToc",
			enable: true,
			position: "sticky",
			showOnPostPage: true,
			hideOnNonPostPage: true,
		},
	],
	rightComponents: [],
	mobileBottomComponents: [
		{ type: "profile", enable: true, showOnPostPage: true },
	],
};
