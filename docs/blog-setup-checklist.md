# 我的博客：需要填写的信息与上线准备

这份清单对应搭建方案中的 A 阶段。只需要决定自己的信息、素材和托管账号设置；项目的构建命令和检查流程已经准备。未填写的信息不会自动覆盖当前主题。

已按你填写的信息完成个人化和 GitHub Pages 子路径配置，实际采用值、验证结果与上线步骤见 [GitHub Pages 上线记录](github-pages-launch.md)。下方填写表保持原文；仓库地址已从当前 origin 确认为 `693623649-border/Firefly`。

## 先填写这张表

| 项目 | 我的填写值 | 必填时机 |
| --- | --- | --- |
| 博客名称 | 待填写 | 个人化前 |
| 显示昵称 | 无聊人士 | 个人化前，可与博客名称不同 |
| 一句简介 | 天体...天体积为空洞 | 个人化前 |
| 托管平台 | GitHub Pages | 部署前 |
| 自己的 GitHub 仓库 | 待填写：(https://github.com/693623649-border) | 自动部署前 |
| 网站地址 | 待填写；可以先用平台分配的 HTTPS 地址 | 正式发布前 |
| 页面 | 建议：首页、归档、分类/标签、关于 | 个人化前 |
| 头像和壁纸 | 可以稍后提供，暂用模板素材 | 正式对外发布前确认素材使用权 |
| GitHub / 邮箱等公开链接 | 可留空 | 可选，填写后访客可见 |
| 喜欢的风格 | 可留空：横幅/全屏/纯色、主题色、列表/网格 | 可选，默认沿用主题 |

你可以在这里填写，也可以直接在聊天里回复这些内容。账号密码、PAT、OAuth secret、部署 Token 不填在这张表，也不需要发给我。

## 本地项目里在哪里配置

以下表格列出实际生效的位置。名称、简介、域名目前都直接来自 TypeScript 配置，不能靠随意新增 `PUBLIC_SITE_TITLE` 等环境变量修改。

| 配置 | 位置和字段 | 填写说明 |
| --- | --- | --- |
| 博客名称 | `src/config/siteConfig.ts` → `title`、`navbar.title` | 两处分别影响站名和导航标题 |
| 副标题与网站简介 | 同文件 → `subtitle`、`description`、`keywords` | 用自己的内容替换 Demo 描述和关键词 |
| 正式网站地址 | 同文件 → `site_url` | 完整 HTTPS 根地址，如 `https://blog.example.com`，不要包含文章路径 |
| 网站开始日期 | 同文件 → `siteStartDate` | 自己决定的启用日期，如 `2026-10-09` |
| 名字和签名 | `src/config/profileConfig.ts` → `name`、`bio` | 用你的昵称和简介 |
| 头像 | 同文件 → `avatar` | 建议图片放 `src/assets/images/personal/avatar.webp`，配置写 `assets/images/personal/avatar.webp` |
| 公开联系方式 | 同文件 → `links` | 换成自己的地址；不想公开的条目直接删去 |
| 横幅图片 | `src/config/backgroundWallpaper.ts` → `src.desktop`、`src.mobile` | 自己的图片可放 `src/assets/images/personal/`；移动端可以单独裁切 |
| 横幅文案及链接 | 同文件 → `common.homeText` | 这里也有模板作者链接，需要一并替换 |
| 导航 | `src/config/navBarConfig.ts` → `getDynamicNavBarConfig()` | 精简菜单，并清理模板的 GitHub/Gitee/文档外链 |
| 可选页面 | `src/config/siteConfig.ts` → `pages` | 动态、相册、项目等按你的选择启用 |
| 侧栏 | `src/config/sidebarConfig.ts` | 第一版可以只保留资料、分类、标签与目录 |
| 关于我 | `src/content/spec/about.md` | 改成你自己的介绍 |
| 公告 | `src/config/announcementConfig.ts` | 替换示例公告，或关闭侧栏公告组件 |
| 网站图标 | `public/favicon/` + `siteConfig.ts` → `favicon` | 若启用分享图，请保留 PNG 图标 |
| 文章版权 | `src/config/licenseConfig.ts` | 选择你希望用于自己文章的许可；主题代码的原有许可另行保留 |

图片路径规则：`/` 开头指向 `public`；`assets/...` 指向 `src/assets`；文章中的 `./cover.webp` 相对于文章目录。放好文件后再填写路径，避免构建时找不到图片。头像、壁纸尚未提供时无需先写入不存在的路径。

可以在后续个人化时创建素材目录，并使用你自己的文件名，避免覆盖主题示例。

## 本地环境和环境变量

已添加 `.nvmrc`，要求 Node.js `22.23.0`；pnpm 版本由 `package.json` 固定为 `11.22.0`。

如果你已经安装 nvm，在项目根目录执行：

```bash
nvm install
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

如果没有 nvm，用现有 Node 版本管理器安装兼容版本即可，不需要另外再装一个管理器。`.nvmrc` 本身不会自动升级当前终端的 Node。

已准备 `.env.example`。需要本地覆盖配置时复制为 `.env.local`，再重启开发服务：

```bash
cp .env.example .env.local
```

默认中文、前台设置面板关闭。注释中的页面开关可以按需要取消注释。部署平台不会读取你电脑上被忽略的 `.env.local`；上线时把相同变量单独填到平台 Environment Variables 中，并重新部署。

基本静态博客不需要密钥。不要设置 `CF_WORKERS`，除非已经决定使用 Cloudflare 服务端适配器并验证输出配置。评论、统计、Memos 和网页后台第一版都可先不接入。

## 托管账号里需要你操作什么

### 自己的仓库

在自己的 GitHub 账号创建或确认博客仓库，把这个项目推送到该仓库。公开仓库中的文章源文件、草稿及 Git 历史也公开；如果不希望公开草稿，使用私有仓库并确认所选平台支持连接。

自动检查当前针对 `master` 分支；如果你选择 `main`，同时修改 `.github/workflows/build.yml`、`biome.yml`、`deploy.yml` 的分支和平台生产分支。平台 Git 集成只授权自己的博客仓库。

### Vercel：现有项目配置最直接的选项

在自己的 Vercel 账号导入博客 GitHub 仓库，在导入页或 Project Settings 配置：

| 设置 | 值 |
| --- | --- |
| Framework Preset | Astro |
| Root Directory | 项目根目录（通常留空） |
| Node.js Version | 兼容项目要求的 22.x 或更高版本；本地和平台需验证一致性 |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm check && pnpm type-check && pnpm build` |
| Output Directory | `dist` |
| Production Branch | `master`，或你实际选定的主分支 |

以上命令已写入 `vercel.json`，避免仅构建页面而跳过检查。Environment Variables 可以先不填；如需中文和精简页面覆盖，则按 `.env.example` 填写非秘密变量。

第一次部署得到平台域名后，把地址回填到 `site_url` 并重新部署，确认 RSS、canonical 和站点地图使用新地址。若需要独立域名，在项目 Domains 中添加，之后到域名服务商 DNS 面板填写平台显示的记录。DNS 目标由平台实时提供，不预先写死。[Vercel Astro 文档](https://vercel.com/docs/frameworks/frontend/astro)、[添加域名](https://vercel.com/docs/domains/working-with-domains/add-a-domain)

### Cloudflare：保持纯静态部署

在自己的 Workers & Pages 面板创建并连接 Git 仓库。静态构建使用相同安装/检查/构建命令，静态资产目录为 `dist`。当前 `wrangler.jsonc` 里的项目名 `firefly` 可以换成你自己的服务名；如果选择 Workers，需要配置部署命令（例如 `pnpm exec wrangler deploy`）并按平台向导完成。

若选 Pages，使用静态 Pages 的项目配置，不把 Workers 的发布命令直接套过去。选择服务端渲染时需重新验证适配器和产物目录，不能继续默认 `dist` 是全部输出。[Cloudflare Astro 文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)

### 只启用一个主站发布通道

仓库已有自动 GitHub Pages 工作流。若采用 Vercel / Cloudflare，建议将 `.github/workflows/deploy.yml` 改成仅手动触发，或在自己的 GitHub Actions 中禁用该工作流，避免同时维护两个主站。因为平台尚未确定，本次保留其触发方式。

GitHub Pages 工作流已准备冻结安装、Node 版本文件和检查步骤。使用 Pages 时还需要在 GitHub 仓库 Settings → Pages 选择 GitHub Actions；子路径发布需另行验证 `base` 和所有资源路径。

## 文章编写与发布已经准备的部分

`pnpm new-post` 现在默认生成 `draft: true`，标题和 slug 使用安全的 YAML 兼容字符串序列化。它不会自动发布，写完后手动改成 `draft: false`。

```bash
pnpm new-post my-first-post
pnpm dev
```

生产发布前执行：

```bash
pnpm check
pnpm type-check
pnpm build
pnpm preview
```

CI 现在按同样顺序执行三项检查；GitHub Pages 部署也会在检查失败时停止。Vercel 的构建命令同样包含检查。GitHub PR 合并门禁仍需要在仓库 Settings 的分支保护或 Rulesets 中选择相应的检查；本地编辑工作流文件不会自动配置 GitHub 账号设置。

## 你提供信息后，我可以继续完成

- 替换站名、作者信息、网站地址、横幅文字和个人链接。
- 根据你选择的页面精简导航及侧栏；把示例内容整理到不发布的位置。
- 放置并接入你的头像、壁纸和图标。
- 按所选平台准备唯一的发布通道及对应安全响应头。
- 在个人化完成后重新验证构建和页面，再交给你连接仓库及域名。

依赖审计告警、加密 IV 复用和外部动态净化仍见 `personal-blog-plan.md`。本次准备配置和发布基础，并未宣称这些安全问题已经修复。修复依赖需要单独更新锁文件并验证全部链路，不能只填一个平台选项完成。

## 本次准备的验证结果（2026-10-09）

- 冻结锁文件安装完成，未修改 `pnpm-lock.yaml`。
- 使用经过官方校验和验证的临时 Node.js `22.23.0` 运行项目检查；未替换你的系统默认 Node。日常使用前仍需按上面的方式切换 Node。
- `pnpm check`：259 个文件，0 错误、0 警告、0 提示。
- `pnpm type-check`：退出码 0。
- `pnpm build`：完整流程退出码 0，生成 40 个页面，Pagefind 索引 18 个页面。
- 当前网络无法获取 Fontsource 的字体元数据，构建没有复制对应自定义字体，页面会使用字体回退；正式上线后仍需验证字体加载，或改用本地/系统字体。
- 新文章脚本在临时目录验证了默认草稿、含引号和冒号的标题、重复文件保护；Biome 检查通过。
- 验证 `.env.local`、`.env.development`、`.env.production.local` 已被 Git 忽略；`.env.example` 可以跟踪。
- 工作流配置尚未在你的 GitHub 账号运行，个人化页面尚未进行浏览器视觉验证，网站尚未上线。
