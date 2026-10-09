# Firefly 个人博客搭建与维护方案

日期：2026-10-09（Asia/Shanghai）
源码基线：`6d82554bfe1cb3d4b43adb0969dad1d43ac6dee3`
项目版本：`6.16.8`；Astro `7.3.2`；Svelte `5`。

后续筹备记录：已新增 `blog-setup-checklist.md`、`.env.example`、`.nvmrc`，并修改默认草稿、环境文件忽略规则、CI 与部署前检查。下文的“当前”及审计结果描述初次评估的源码基线；实际筹备和验证状态见新清单。

## 结论与适用范围

建议保留 Firefly 的静态博客架构，以 Markdown 文件和 Git 为内容基础，先完成个人配置、本地写作、自动检查与静态部署。若希望从浏览器或手机修改装修、写作，再增加 Git 型 CMS；公共博客仍输出静态文件，管理与认证独立部署。

这样可以同时获得：现成的主题装修能力、可迁移的文章文件、发布历史和回滚能力，以及较少的线上服务维护工作。安全性需要持续维护，不能由“静态站点”或“文章加密”单独保证。

本次对仓库目录、跟踪文本、配置、依赖及工作流进行了全量扫描，深入阅读了装修、文章生成与渲染、内容过滤、搜索、订阅、动态、加密、评论和部署链路。扫描覆盖 408 个文本文件、72,573 行（不含锁文件；包含部分静态资源文本），这不等于逐行完成了所有模块的安全审计。图片、模型和字体二进制只做资源盘点；没有执行浏览器视觉验证、完整构建或线上渗透测试。仓库提及的 `Firefly-Docs` 本地目录未找到。

本次仅新增方案与依赖审计记录，没有修改博客功能、安装 CMS、提交代码或发布网站。

## 当前项目的能力和缺口

| 模块 | 源码入口 | 现状与用途 |
| --- | --- | --- |
| 全局页面 | `src/layouts/Layout.astro`、`MainGridLayout.astro` | HTML、SEO、样式、壁纸、导航、侧栏与交互初始化 |
| 装修 | `src/config/`、`src/types/` | 分模块 TypeScript 配置，覆盖主题色、壁纸、字体、布局、导航、组件、音乐和特效 |
| 文章 | `src/content/posts/`、`src/content.config.ts` | `.md` / `.mdx`，带标题、日期、标签、分类、草稿、系列、封面等字段 |
| 内容呈现 | `src/pages/posts/[...slug].astro`、`src/components/common/`、`src/plugins/` | Markdown 扩展、代码高亮、公式、图表、MDX 组件、目录和沉浸阅读 |
| 内容汇总 | `src/utils/content-utils.ts`、首页/归档/分类/标签/系列页面 | 排序、置顶、分页、筛选、系列与相关文章 |
| 搜索与订阅 | `scripts/run-pagefind.ts`、`src/utils/feed-utils.ts` | Pagefind 静态全文搜索；RSS / Atom；站点地图及 `llms.txt` |
| 其他内容 | `src/content/spec/`、`projects/`、`dynamic/`、`src/config/galleryConfig.ts` | 关于、留言、项目、动态、相册；也有友链、书签及媒体收藏页面 |
| 外部服务 | 评论、统计组件及媒体 API 工具 | 按配置接入，需分别管理供应链、隐私和权限 |
| 构建与部署 | `package.json`、`scripts/`、`.github/workflows/`、`vercel.json`、`wrangler.jsonc` | 现有构建、CI、GitHub Pages 部署，以及 Vercel / Cloudflare 配置 |
| 博主管理后台 | 当前没有 | 前台设置面板不能保存全站配置、上传文章或执行发布 |

目前很多配置仍是模板作者的名字、链接、封面、导航和示例文章。上线前需要集中替换，而不是只改站点标题。

## 方便修改装修

### 第一阶段：用现有配置完成装修

| 想修改什么 | 修改位置 |
| --- | --- |
| 站名、简介、域名、主题色、页面宽度、列表/网格、功能页面开关 | `src/config/siteConfig.ts` |
| 头像、昵称、个人签名、社交链接 | `src/config/profileConfig.ts` |
| 导航菜单、外链、搜索方式 | `src/config/navBarConfig.ts` |
| 横幅、全屏背景、透明覆盖、主页标语、视频 | `src/config/backgroundWallpaper.ts` |
| 左右侧栏、组件排序、移动端组件 | `src/config/sidebarConfig.ts` |
| 字体和代码高亮 | `src/config/fontConfig.ts`、`expressiveCodeConfig.ts` |
| 音乐、樱花、看板娘 | `src/config/musicConfig.ts`、`effectsConfig.ts`、`pioConfig.ts` |
| 页脚、关于页、公告 | `src/config/FooterConfig.html`、`src/content/spec/about.md`、`announcementConfig.ts` |
| 封面、友链、相册、文章许可说明 | 对应的 `*Config.ts` |

建议第一版以文章阅读为中心：一张自己的横幅、清晰的字体、一侧边栏，导航保留首页、归档、分类/标签、关于。相册、动态、书签等按实际需要逐个启用。移动端先关闭视频和重动画；音乐等功能可以在基本体验验证后增加。

自己的图片使用自己的文件名，避免覆盖模板的 `d1`、`m1` 等示例资源，方便以后合并主题更新。装饰资源放 `src/assets` 或 `public`；文章配图优先与文章一起放置。

`displaySettingsConfig.ts` 可开启前台视图设置面板，或在构建环境设置 `PUBLIC_DISPLAY_SETTINGS=true`。实现通过 `localStorage` 保存主题、壁纸等访客偏好：这适合试效果和访客个性化，不会改写仓库或影响其他访客。修改环境变量也需要重新构建才会进入新的静态产物。

### 第二阶段：需要网页装修时增加配置表单

新增一个结构化配置文件，例如 `src/config/personal.json`，仅承载常用的站名、头像、壁纸、主题色、菜单、侧栏和特效开关；现有 TypeScript 模块读取它并提供默认值。

用 CMS 的文件集合或单例表单编辑该 JSON。流程为：登录 → 修改配置 → 保存到 Git 分支 → 检查 → 预览 → 发布。这样博主不用直接编辑 TypeScript，也能保留版本历史。

这是建议新增的能力，目前未实现。要同步更新类型、校验和组件消费方，避免形成两份冲突配置；不应让后台接受任意 JavaScript 或未经审核的页脚 HTML。JSON 的数值、URL、组件类型需要白名单校验。先覆盖常用字段即可，不需要把全部配置重写成可视化系统。

## 方便编写和发布文章

### 推荐起步：本地 Markdown + 自动部署

文章继续保存在 `src/content/posts`。可以用 VS Code、Typora 或 Obsidian 编辑；不同编辑器的扩展语法和预览可能与博客不同，最终以 Astro 的本地预览为准。

本地环境按 `package.json` 固定：Node.js 至少 `22.23.0`，pnpm `11.22.0`。本次命令环境的 Node.js 是 `22.12.0`，低于项目要求；未安装项目依赖。先准备符合要求的 Node，再执行：

```bash
pnpm install --frozen-lockfile
pnpm dev
```

创建文章：

```bash
pnpm new-post my-first-post
```

注意：当前脚本生成 `draft: false`。正式使用前应改成默认 `true`，并安全序列化 YAML 标题、限制生成路径在文章目录内。现阶段执行后应先手动把草稿字段改为 `true`。

文章示例：

```yaml
---
title: "我的第一篇文章"
published: 2026-10-09
description: "记录博客搭建过程。"
image: ""
tags: [博客, 记录]
category: 生活
draft: true
comment: false
lang: ""
---
```

图片较多的文章建议采用 `my-first-post/index.md` + 同目录图片，并在正文使用 `./cover.webp` 等相对路径。发布前检查实际生成的文章 URL，发布后尽量保持 slug 稳定；重命名时设置重定向。修改文章同时维护 `updated`。

当前生产环境查询会过滤 `draft: true`，开发环境允许预览草稿；但缺省草稿值也是 `false`。`published` 是排序和展示日期，现有过滤没有“未来日期不发布”的逻辑，填写明天的日期不会自动实现定时发布。若需要定时发布，应同时增加时间过滤及定时重建。

日常流程：

```text
新建草稿 → 写作与配图 → 本地预览 → 设置 draft: false
→ 推送发布分支 → CI 检查与完整构建 → 预览确认 → 部署
```

私密草稿建议放私有内容仓库，或保持在本地。`draft: true` 只控制网站输出，不会使公开 Git 仓库中的源文件和历史变私密。

### VS Code 的可视化内容面板

仓库有 `_frontmatter.json`，说明已留有 Front Matter CMS 配置参考，但不能据此认为插件已经装好或配置已生效。官方初始化使用 `frontmatter.json`；需要按当前插件实际识别情况接入。配置里还存在 `language` 与项目 schema 的 `lang` 不一致、预览路径 `'blog'` 与实际 `/posts/` 不一致的问题。

修正后可以在编辑器中表单化编辑标题、日期、标签、分类和封面，适合主要在自己的电脑上写作的人。[Front Matter 初始化文档](https://frontmatter.codes/docs/getting-started/)

### 从浏览器或手机写作：优先试接 Decap CMS

Decap 可以通过 GitHub backend 管理仓库文件，适合保持现有 Markdown 格式。建议先接入普通 `.md` 文章，再做高级语法编辑兼容；不要默认假设富文本模式能无损保存 MDX、指令、公式和 Wiki 链接。

它需要认证服务或托管认证，不能只添加一个静态 `/admin` 页面就获得安全的发布后台。普通 GitHub backend 的编辑者需要内容仓库 push 权限。OAuth client secret 应保存在认证服务端；浏览器通过正常认证流程取得编辑权限，不能在页面中硬编码仓库 PAT。[Decap GitHub backend](https://decapcms.org/docs/github-backend/)

建议新增：管理页、CMS 字段配置、认证服务、上传目录限制，以及分支/预览发布工作流。标题、日期、分类、草稿和图片字段与 `src/content.config.ts` 保持一致；管理后台的“发布”状态与网站的 `draft` 字段也要明确对应。媒体上传限制大小、类型和目标目录，第一版允许 JPEG/PNG/WebP/AVIF，禁止可执行 HTML 和未经净化的 SVG。

Keystatic 是备选：支持 Astro、本地和 GitHub 内容管理，但官方线上集成需要服务端代码和适配器，不能假设直接兼容当前纯静态部署。官方入门示例采用 `.mdoc`，本项目只加载 `.md/.mdx`；需要选择并验证合适格式及扩展语法的编辑往返。先用隔离分支验证 Astro 7、现有 Svelte/Swup 及部署平台兼容性。[Keystatic Astro 集成](https://keystatic.com/docs/installation-astro)、[GitHub 模式](https://keystatic.com/docs/github-mode)

## 部署方式与发布可靠性

建议第一版选一个平台，避免 GitHub Pages 工作流与其他平台同时自动发布同一主站。

| 方案 | 项目适配情况 | 取舍 |
| --- | --- | --- |
| Vercel 静态部署 | 已有 `vercel.json`，输出 `dist` | 现有配置改动较少，可先验证完整构建及访问体验 |
| Cloudflare 静态部署 | 已有 `wrangler.jsonc`；默认无需启用服务端适配器 | 可以保留纯静态架构；Workers 与 Pages 的配置需分别确认 |
| GitHub Pages | 已有部署工作流 | 当前 `base: "/"`；子路径站点需检查全部路径兼容性，独立域名更省事 |

Cloudflare 官方说明 Astro 默认可预渲染页面后上传静态资源。这里新增博客优先用静态路径，暂不设置 `CF_WORKERS`；当前源码只在该变量为真时启用 Cloudflare adapter，并非 README 所述对所有平台自动选择适配器。[Cloudflare Astro 部署文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)

无适配器的标准设置：安装命令 `pnpm install --frozen-lockfile`，构建命令 `pnpm build`，输出目录 `dist`。一旦开启适配器，以实际构建产物和对应版本文档为准，不能只根据 `scripts/site-root.ts` 中历史 `dist/client` 注释配置部署。

发布检查应包括：

```bash
pnpm check
pnpm type-check
pnpm build
pnpm preview
```

现在 `.github/workflows/build.yml` 的构建任务只执行 `pnpm astro build`，未跑仓库卡片、LQIP、资源裁剪、字体处理、内联脚本压缩和 Pagefind 全流程，也没有单独执行 TypeScript 检查。应改成实际发布所需的完整链路。

GitHub Pages 部署使用 `--no-frozen-lockfile`，应改成冻结锁文件安装。统一本地和 CI 的 Node/pnpm 版本；检查和部署工作流使用同一已验证产物，或明确在部署前重新通过同样的检查。生产部署必须等待检查通过，不能因为 push 事件同时触发就认为已形成发布门禁。

绑定域名后修改 `site_url`，同时检查 canonical、RSS/Atom、站点地图和分享图指向自己的域名。以自己的访问网络测试首页、文章、搜索、字体、评论和图片；平台选择不应只看模板提供的按钮。

## 已确认的安全问题与处理顺序

### 1. 密码内容：加密实现及公开输出需要修正

`src/utils/crypto-utils.ts` 使用 AES-256-GCM，但是 salt 和 IV 都由密码及 slug 确定。相同文章、相同密码更新正文时，密钥和 IV 被复用。本次以合成密码和两段不同示例文字直接调用现有函数，结果：

```json
{"sameSalt":true,"sameIv":true,"differentCiphertext":true}
```

同一密钥下 AES-GCM 的 IV 必须在每次加密时保持唯一。[Web Crypto AES-GCM 参数说明](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams)

建议每次构建加密使用安全随机 salt 和 12 字节 IV，继续随密文存储；客户端本就读取这些字节，密码缓存不要求密文每次相同。旧发布版本的密文可能仍被保存，修复不会追回旧数据。

还需要检查加密内容之外的公开通道：

- `PostCard.astro` 的描述回退为首段 excerpt，没有根据密码字段禁止回退。密码文章未填写 description 时，正文首段可能出现在首页卡片。
- 标题、描述、封面和日期会进入页面、文章元数据 API、订阅摘要、`llms.txt` 或分享图，不能当作加密内容。
- RSS / Atom 已对密码正文做跳过处理，这是现有保护，但仍输出公开元数据。
- `public/gallery` 图片直接作为静态文件提供。相册页面加密不会给原图加访问控制。
- 浏览器缓存密码在 `sessionStorage`，同源脚本可以读取；第三方脚本的可信度也影响该功能。
- 公开仓库会公开 Markdown 正文及 frontmatter 中的密码，页面加密无法保护仓库源文件。

第一版建议不发布敏感密码文章。确有受限阅读需求时，使用身份认证保护完整页面及原始资产，限制绕过认证的默认域名、源站或对象存储访问，并移除公开搜索/订阅中的敏感元数据。私有源码仓库也不等于网站输出自动私有。

### 2. 外部动态内容存在 HTML 注入风险

`src/utils/memos-adapter.ts` 把 Memos Markdown 交给 Marked 转成 HTML；`DynamicFeed.svelte` 将 `entry.html` 直接赋给 `innerHTML`。这条链路未见 HTML 净化，外部 JSON 数据也使用同样的插入路径。Marked 官方明确不负责净化输出。[Marked 安全说明](https://marked.js.org/)

该功能默认关闭 Memos；普通自写 Markdown 与外部 API 内容的信任边界不同。启用外部动态前，应在最终插入 HTML 的边界进行允许列表净化，阻止事件属性与危险 URL 协议；链接自定义 renderer 还需正确转义属性。为 Memos 增加显式公开状态过滤，但客户端过滤不能代替 Memos 服务端访问控制。

`siteConfig.pages.dynamic=false` 只关闭动态页面，没有同步给 `/api/dynamic.json` 加内容开关；当前动态 collection 也没有 draft 字段。应确认关闭功能时是否应停止输出其 API 和资产，避免把“菜单隐藏”当作数据保护。

### 3. 依赖审计需要处理

本次 `pnpm audit --prod --json` 返回退出码 1，报告 57 个条目：高危 27、中危 22、低危 8、严重 0。原始结果保存于 `docs/audits/2026-10-09-pnpm-audit.json`。

审计按锁文件依赖关系匹配公告，不是对已部署网站的可利用性测试。很多工具放在 `dependencies` 中，因此 `--prod` 仍包括诊断、开发服务和构建链依赖；需要按浏览器运行、构建时处理输入、开发工具三个实际使用场景分级。

例如锁文件中的 sharp `0.35.4` 与部分间接依赖 `0.35.2` 命中新公告，修复版本为 `0.35.5`；公告涉及特定 glibc Linux 条件，不能推断本地 macOS 同样可被利用，但 Linux CI 图像处理链需要关注。[sharp 安全公告](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)

先升级直接依赖和提供修复的上游包，检查锁文件是否仍有旧副本；没有上游修复时再评估兼容 override 或替代组件。完成后运行全部检查与构建再审计，不直接对全部条目强制跨主版本升级。现有 Dependabot 是基础，但还需覆盖 GitHub Actions 更新及重大版本维护。

### 4. 安全响应头应与实际平台一致

当前 `vercel.json` 有 `nosniff`、`SAMEORIGIN` 和 Referrer-Policy，未见 CSP。它不会自动配置 Cloudflare 响应头；Cloudflare 静态资产可以通过 `public/_headers` 配置，Worker 代码生成的响应需要在代码中设置。[Cloudflare 响应头文档](https://developers.cloudflare.com/workers/static-assets/headers/)

建议保留基础头，再规划 Permissions-Policy 和 CSP。先用 Content-Security-Policy-Report-Only 观察现有内联脚本、动态导入、公式/图表、评论、字体和媒体依赖，再以固定脚本 hash、打包本地依赖及有限域名允许列表推进正式策略。静态站点的 hash 可在完整构建和脚本压缩之后生成；不要直接照抄 `script-src 'self'` 造成页面失效。动态评论使用站内 iframe，frame-ancestors / X-Frame-Options 还要保留所需的同源嵌入能力。

### 5. 管理权限、资源和备份

GitHub、域名及托管账号开启多因素认证，部署集成只授权自己的目标仓库。管理界面隐藏、robots 禁止索引或公开环境变量都不能代替授权。给后台、OAuth 回调、保存 API 和上传 API 分别检查身份与权限；后台与公开博客可放不同来源，减少脚本共享权限。

`.gitignore` 目前只明确忽略 `.env` 和 `.env.production`，建议扩展为 `.env*` 并保留不含秘密的 `.env.example`。密钥放平台 Secret；配置中的 API 地址、Client ID 和仓库 ID 不应一概认定为秘密，但 API token、PAT、OAuth secret 必须留在服务端。

第三方评论目前关闭，统计 ID 为空，Memos 和看板娘也关闭；上线不必全部启用。需要评论时，技术读者可采用 Giscus：使用独立公开讨论仓库，源码内容仓库可以保持私有。访客评论需要 GitHub 授权，管理在 GitHub Discussions 中进行；它仍依赖第三方服务与网络。[Giscus 配置说明](https://giscus.app/)

部分评论组件通过未固定版本的 CDN 动态导入，使用时应固定版本或打包已审计依赖。PlantUML 默认使用公共服务，编码 URL 不等于加密，不应发送敏感图表。装饰和文章图片尽量本地托管；大文件使用受控存储并单独备份，清理图片 EXIF 中不必要的位置等信息。

Git 记录保存历史，但对媒体、评论和域名配置还要独立备份。建立恢复演练：回滚上一个提交或部署 → 验证文章 URL、图片、搜索及订阅。主题更新保留上游 remote，先在分支合并和预览，减少直接修改核心组件的范围。保留开源许可和作者版权说明，自己的文章许可独立配置。

## 建议的实施批次与验收

| 批次 | 工作 | 验收 |
| --- | --- | --- |
| A：上线基础 | 统一环境；替换个人资料与资源；配置域名；精简页面；修复默认草稿和依赖 | 本地与 CI 三项检查通过；首页、文章、移动端、搜索、订阅正常；无模板个人信息遗留 |
| B：安全与发布 | 修复加密/摘要泄漏；外部动态净化或保持关闭；平台响应头；冻结安装；部署门禁 | 草稿正文不在公开产物；外部 HTML 攻击样例不能执行；错误构建不能上线；可恢复上个版本 |
| C：网页管理 | Decap 或经验证的 Keystatic；后台认证；文章/媒体表单；预览流程 | 未授权账号不能写入；保存不破坏 Markdown；发布状态一致；手机可完成文章发布 |
| D：网页装修 | 常用配置 JSON 与表单；统一校验及默认值 | 装修可预览、发布和回滚；访客偏好与博主全站默认值分开 |

当前应先做 A、B。若主要在电脑上写作，本地编辑器方案已足够；若明确需要手机发布和全站装修表单，再做 C、D。

本次实际验证：目录与文本扫描、源码链路分析、合成数据的 IV 复用复现、联网依赖审计及官方文档核对。未执行 `pnpm check`、`pnpm type-check`、`pnpm build`：本次只新增文档，项目依赖未安装，当前 Node 也低于声明要求。因此本文是实施方案和已发现问题的记录，不是“构建已通过”或“安全已保证”的结论。
