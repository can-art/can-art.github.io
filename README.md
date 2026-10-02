# can-art.github.io

国庆主题静态页面，部署于 <https://can-art.github.io/>

## 文件

| 文件 | 说明 |
|---|---|
| `index.html` | 页面本体。纯静态 HTML + 内联 CSS，**无任何 JavaScript、无外部依赖** |
| `bg.webp` | 背景图（2400×958，228 KB），天安门城楼正面全景 |
| `bg.jpg` | 同上 JPEG 版（473 KB），供不支持 WebP 的浏览器回退 |
| `kai.woff2` | 楷体字体子集（46 KB），霞鹜文楷，仅含本页用到的 220 个字符 |
| `OFL.txt` | 上述字体的 SIL OFL 1.1 授权 |

## 实现要点

- **背景**：`position: fixed` 固定，`filter: blur(5px)` 轻微虚化，外层红色薄纱压暗以提升文字对比度
- **毛玻璃**：卡片使用 `backdrop-filter: blur(20px) saturate(155%)`；不支持该属性的浏览器自动回退为半透明深色底
- **字体**：自托管楷体子集置于字体栈首位，保证任何设备（含无楷体的 Android / Linux）都能正确显示楷体；系统楷体（Windows 楷体 / macOS STKaiti / Linux AR PL UKai CN）作为后备
- **响应式**：字号与间距全部使用 `clamp()`，适配手机到桌面

## 改动文案后

页面文字变了，字体子集必须重新生成，否则新字会回退到系统字体：

```bash
/home/yc/dsh-browser/build-font.sh
```

脚本会扫描 `index.html` 中所有可见字符，重新子集化 `kai.woff2`。

## 素材授权

- 背景图：[天安门城楼正面](https://commons.wikimedia.org/wiki/File:Front_view_of_Tiananmen_gate_from_north_end_of_Tiananmen_Square.jpg)，© Daniel Case，[CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- 字体：[霞鹜文楷 LXGW WenKai](https://github.com/lxgw/LxgwWenKai)，SIL OFL 1.1（授权已明确许可子集化用于网页字体分发）
