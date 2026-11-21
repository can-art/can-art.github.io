# can-art.github.io

个人静态站点，部署于 <https://can-art.github.io/>

## 站点结构

| 路径 | 内容 | 访问地址 |
|---|---|---|
| `/` | **《从会聊天到会干活 · Token 与 AI Agent 入门》** 16 页 HTML 演示稿（DeepSeek Harness 现场制作） | <https://can-art.github.io/> |
| `cinnamoroll/` | 大耳狗（Cinnamoroll）应援页（原首页，2026-11 退居子目录） | <https://can-art.github.io/cinnamoroll/> |
| `national-day/` | 国庆主题页面存档（2026-10） | <https://can-art.github.io/national-day/> |

## 根目录：Token 与 AI Agent 入门

| 文件 | 说明 |
|---|---|
| `index.html` | 16 页幻灯片本体，纯静态单页，键盘 ←/→ 翻页 |
| `style.css` | 演示稿版式与配色 |
| `assets/base.css` | 幻灯片基础布局（舞台、页容器、翻页） |
| `assets/fonts.css` | 离线字体栈：无远程请求，优先本机 Inter，回退系统中文字体 |
| `assets/runtime.js` | 翻页、进度、主题切换运行时 |
| `assets/themes/` | 37 套可选主题 |
| `assets/animations/` | 入场动效库（打字机、烟花、轨道环等） |
| `assets/demo-images/` | 示例配图（SVG） |

**无外部 CDN 依赖**，断网也能完整放映。

## cinnamoroll/：大耳狗应援页

| 文件 | 说明 |
|---|---|
| `index.html` | 标题、拍立得、六个理由、时间线、许愿池、引言 |
| `style.css` | 天空渐变、三层漂移云、卡片、时间线、入场动画、响应式 |
| `app.js` | 星点、鼠标视差、滚动渐入、飘心、喜欢计数、许愿云 |
| `assets/cinnamoroll.png` | 主图（800×450），趴在云上的大耳狗 |
| `fonts/zcool-kuaile.woff2` | 标题字体子集（约 29 KB，仅含本页用字） |
| `fonts/quicksand.woff2` | 正文字体子集（约 19 KB，可变字重 400–700） |
| `tools/build-fonts.sh` | 改文案后重新生成字体子集 |

- **喜欢计数**：有 `/api/likes` 后端时走网络计数，纯静态部署时自动降级为 `localStorage` 本地计数
- **字体子集**：页面文字变了要重跑 `cd cinnamoroll && ./tools/build-fonts.sh`，否则新字回退到系统字体

## 部署

GitHub Pages，直接服务仓库根目录。`.nojekyll` 已存在，下划线开头的目录不会被 Jekyll 过滤。

## 素材与授权

- 大耳狗主图：© 2026 SANRIO，同人应援用途
- 字体：[站酷快乐体 ZCOOL KuaiLe](https://github.com/google/fonts/tree/main/ofl/zcoolkuaile)、[Quicksand](https://github.com/google/fonts/tree/main/ofl/quicksand)，SIL OFL 1.1
