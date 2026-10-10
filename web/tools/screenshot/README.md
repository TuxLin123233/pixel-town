# UI 截图 + 宣传长图

用**无头 chromium** 截真实界面，再用 Pillow 拼成宣传长图。
（之前以为做不到 —— 其实系统里就有 `/usr/bin/chromium`）

有两条路线，用途不同：

| 路线 | 数据 | 需要网络 | 用途 |
| --- | --- | --- | --- |
| `shoot.sh` + `server.mjs` | 仓库里的**假数据** | 不用 | 平时改版看效果、离线可跑；「我的 / 画头像」这种要登录的页面也靠它才好看 |
| `shoot-live.mjs` | 线上**真实作品** | 要 | 对外发帖用的宣传图，内容是真的 |

## 一、本地 mock 路线

页面全靠 `/api/*` 的数据才能渲染出内容，而这个仓库**没有任何内置作品数据**
（用户作品都在线上的 Cloudflare KV 里）。

所以 `server.mjs` 同时干三件事：
1. 静态托管 `web/public`
2. 对 `/api/*` 返回**假数据**（示例作品、一间摆好的小屋、小镇地图…）
3. `/__boot?to=/xxx` 先写好 localStorage 和 cookie 再跳转 ——
   不这么做的话，画板会被「重要提示」挡住，作者名也是空的

> `lw-user` 这个键存的是**用户名本身**，不是 JSON。写错了页面上会显示成原始 JSON。
> 同意画板提示的状态存在 **cookie `paint_consent`** 里，不在 localStorage。
> `/paint` 还要塞一份 **`paintDraft`**：没有草稿时它会停在「开始创作」弹层上，
> 截出来是一层遮罩而不是编辑器。
> 「装到桌面」横幅会压在底部导航上，`/__boot` 顺手把 `lw-pwa-hint-dismissed` 设上。

```bash
node web/tools/screenshot/server.mjs &        # 起 mock 服务器（端口 8791）
bash web/tools/screenshot/shoot.sh            # 8 个页面 × 两种规格 → ui-shots/
bash web/tools/screenshot/shoot.sh 手机        # 只要手机那套
python3 web/tools/screenshot/make-poster.py   # 拼手机长图 → 宣传图/宣传长图-手机.png
python3 web/tools/screenshot/make-poster.py desktop   # 电脑版（README 没用到，按需）
```

## 二、线上真实作品路线

线上没有 `/__boot` 注入页，所以同意 cookie、画板草稿这些得用 CDP 自己写进 localStorage ——
这就是 `shoot-live.mjs` 不用 chromium 命令行截图、而是走 DevTools 协议的原因。

```bash
node web/tools/screenshot/shoot-live.mjs                    # 默认打主站 art.xgcc.fun
node web/tools/screenshot/shoot-live.mjs https://xxx pages... # 换站点 / 换页面
```

默认只截 6 个「不登录也好看」的公开页面，`ui-shots/` 里另外两张
（`mine` / `avatar`）留给本地 mock 路线 —— 宣传图就是这么混着拼的。

页面里用的 uid 是从线上真实数据里挑的（家具最多的小屋、作品最多的画师），
换人就在脚本顶部的 `DEFAULT_PAGES` 里改。

## 规格

| | 逻辑尺寸 | 缩放 | 输出 |
| --- | --- | --- | --- |
| 手机 | 390×844 | 3x | 1170×2532 |
| 桌面 | 1440×900 | 2x | 2880×1800 |

**注意**：应用的 `max-width` 是 **460px**，所以「桌面版」实际就是**手机界面居中显示**。
电脑版长图排成两栏就是为了不堆成一万像素的长条。

## 截图里哪些是假的

对外发布的那版长图（`宣传图/宣传长图-手机.png`）是两条路线混拼的：

| 内容 | 真假 |
| --- | --- |
| 界面、按钮、布局、配色 | **真的**（就是网站本身） |
| 社区 / 小镇 / 小屋 / 画师主页 / 更新日志 | **真的**（线上真实数据，2026-10 从 art.xgcc.fun 截的） |
| 画板画布上那幅爱心 | **本地草稿**（不塞草稿会截到「开始创作」弹层） |
| 「我的」页的光尘 / 连续天数 / 徽章 | **假的**（本地 mock，线上这页要登录） |
| 「画头像」页的当前头像与光尘价格 | 头像**真的**，光尘数字**假的**（本地 mock） |

八张里只有「我的」「画头像」两张是 mock 渲染的，因为登录态没法伪造。
