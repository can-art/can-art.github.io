# can-art.github.io

大耳狗（Cinnamoroll）应援页，部署于 <https://can-art.github.io/>

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 页面本体：标题、拍立得、六个理由、时间线、许愿池、引言 |
| `style.css` | 全部样式：天空渐变、三层漂移云、卡片、时间线、入场动画、响应式 |
| `app.js` | 交互：星点、鼠标视差、滚动渐入、飘心、喜欢计数、许愿云 |
| `assets/cinnamoroll.png` | 主图（800×450），趴在云上的大耳狗 |
| `fonts/zcool-kuaile.woff2` | 标题字体子集（约 29 KB，仅含本页用字） |
| `fonts/quicksand.woff2` | 正文字体子集（约 19 KB，可变字重 400–700） |
| `tools/build-fonts.sh` | 改文案后重新生成字体子集 |
| `national-day/` | **旧版国庆主题页面存档**，访问 <https://can-art.github.io/national-day/> |

## 实现要点

- **纯静态**：无构建步骤、无外部 CDN 依赖，字体自托管，离线打开也能完整显示
- **云层**：三层 `radial-gradient` 椭圆 + `blur` + 无限 `translateX` 漂移，层间速度/方向不同形成纵深
- **视差**：`pointermove` 记录指针位置，rAF 缓动写入 `translate`，与 CSS `transform` 动画互不冲突
- **入场**：滚动时按 `getBoundingClientRect()` 判定，比 IntersectionObserver 更耐标签页节流；`<html class="js">` 兜底，脚本失效时内容照常可见
- **无障碍**：支持 `prefers-reduced-motion`，系统开启减弱动效即关闭漂移与悬浮
- **喜欢计数**：有 `/api/likes` 后端时走网络计数，纯静态部署（GitHub Pages）自动降级为 `localStorage` 本地计数

## 重新生成字体子集

页面文字变了要重跑，否则新字会回退到系统字体：

```bash
./tools/build-fonts.sh
```

脚本会扫描 `index.html` 与 `app.js` 中的全部字符，重新子集化两个 woff2。

## 素材与授权

- 主图：© 2026 SANRIO，同人应援用途
- 字体：[站酷快乐体 ZCOOL KuaiLe](https://github.com/google/fonts/tree/main/ofl/zcoolkuaile)、[Quicksand](https://github.com/google/fonts/tree/main/ofl/quicksand)，均为 SIL OFL 1.1
