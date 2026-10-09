# 无聊人士的博客：GitHub Pages 上线记录

## 已采用的配置

- 昵称：无聊人士。
- 简介：天体...天体即为空洞。
- 博客名称：暂用“无聊人士的博客”；填写表格中名称仍待确定，可在 `src/config/siteConfig.ts` 修改 `title` 和 `navbar.title`。
- 仓库：`https://github.com/693623649-border/Firefly`，从当前 Git `origin` 确认；GitHub API 确认默认分支是 `master`，仓库公开。
- 部署平台：GitHub Pages。
- 配置的预期地址：`https://693623649-border.github.io/Firefly/`；这是配置的发布地址；实际上线状态以 Actions 部署结果和在线验证为准。
- `site_url` 使用源站 `https://693623649-border.github.io`，`base` 使用 `/Firefly/`。以后更换独立域名时同时修改这两项，独立域名的 base 通常为 `/`。

## 已完成

替换作者资料、主页标语和关于页；清理模板作者的联系方式和导航外链。保留首页、归档、分类、标签、关于；搜索和订阅继续可用。使用一侧边栏，关闭音乐入口与背景视频，使用系统字体，头像和壁纸暂沿用模板素材。

原有 36 个文章/项目/动态及关联资源文件原样移到 `docs/theme-examples/`，已核对与 Git HEAD 的文件内容完全一致。它们不再进入内容集合。新增一篇短欢迎文章；未开启外部评论、统计或 Memos。

适配了子路径下的个人链接、RSS/Atom、分享图、robots、站点地图过滤、Wiki 链接及重复 base 前缀。关闭的动态 API 输出空数组，关闭页面跳到实际生成的 `404.html`。

## 本次验证

- Node.js `22.23.0`，pnpm `11.22.0`。
- `pnpm check`：259 文件，0 错误、0 警告、0 提示；空项目和动态集合会出现内容加载提示。
- `pnpm type-check`：通过。
- `pnpm build`：完整流程通过；Pagefind 索引 2 个内容页面。
- 检查构建 HTML 中所有内部 href/src：包含 `/Firefly/`，对应目标文件存在。
- RSS、Atom、站点地图 XML 可解析，本站绝对链接使用正确子路径。
- 浏览器验证：首页、搜索结果、欢迎文章、390px 移动端文章布局。搜索“无聊人士”找到欢迎文章及关于页，结果链接正确。
- 截图：`docs/previews/home.png`、`docs/previews/mobile-post.png`。

## GitHub 账号中的下一步

初次读取 GitHub API 时 `has_pages=false`。你完成设置后，已再次确认 Pages 的 `build_type` 为 `workflow`，发布地址与上述配置一致。

1. 打开 [仓库 Pages 设置](https://github.com/693623649-border/Firefly/settings/pages)。
2. 在 Build and deployment 的 Source 中选择 **GitHub Actions**。
3. 将本次修改提交并推送到 `master`；`.github/workflows/deploy.yml` 将执行冻结安装、诊断、类型检查、完整构建，再发布 `dist`。
4. 在 [Actions](https://github.com/693623649-border/Firefly/actions) 等待 **Deploy to GitHub Pages** 的 build 和 deploy 均成功。
5. 访问预期地址，验证文章、搜索、图片、订阅；以 GitHub Pages 设置显示的实际地址为准。

个人化批次未执行部署；本次已确认 Pages 设置并准备提交、推送此版本。你的本地预览可通过 `pnpm preview` 访问 `/Firefly/`；完整 URL 为 `http://localhost:4321/Firefly/`。

官方流程参见 [Astro GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)。GitHub Pages 的静态托管不执行 `vercel.json` 中的安全响应头配置；后续如需要统一自定义响应头，可考虑自己的域名及代理托管方案。

## 安全维护仍待完成

初次审计记录中的依赖告警仍待升级和复查。密码加密 IV 复用与外部动态 HTML 净化也没有在本批个人化改动中修复；密码示例已退出公开文章集合，外部动态保持关闭。当前验证确认内容、路径和构建可用，不表示已完成全部安全审计。

## 发布准备检查

已通过与 CI 一致的 Biome 检查（300 个文件），修正 RSS/Atom 的 import 排序，并将 CI 的 Biome 固定为项目版本 `2.5.12`。此前 Astro、TypeScript、完整构建、浏览器搜索和移动端验证结果见上文。
