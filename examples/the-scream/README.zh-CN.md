# 呐喊 · 完整案例源码

本轮重新制作的三维案例。之前只有截图，没有找回旧源码；因此本目录不冒充旧版。

打开 `index.html` 为中文，`index.en.html` 为英文。两份都有界面语言切换。

## 构建

```bash
node scripts/build.mjs
```

不需要 npm install。三维、纹理、配乐内联到独立 HTML。需要支持 WebGL2 的浏览器。

## 体验

32 秒导览，可以随时接手。拖动看四周；WASD 移动；F 切换步行/飞行；Q 下降、E 上升；H 隐藏/恢复；P 保存实际画面的 PNG。手机提供摇杆和飞行升降按钮。

每个案例的六处目的地都由真实三维网格组成。空间有限，步行有简化碰撞，飞行不模拟身体碰撞。配乐默认关闭，点击声音按钮才播放。

## 源文件

`src/engine.js` 渲染器；`world.js` 场景；`textures.js` 材质；`audio.js` 音乐；`app.js` 镜头与双语交互；`style.css` 样式；`index.template.html` 模板。

本轮检查与截图见 `qa/`。整个包的测试边界见 `../../docs/zh-CN/QA.md`，版本来源见 `../../docs/zh-CN/PROVENANCE.md`。源代码用于创作艺术化空间，不是原画扫描或历史测绘。
