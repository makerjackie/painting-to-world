# 开发与交付说明

## 工程结构

每个案例的 `src/engine.js` 是无外部依赖的 WebGL2 三维渲染器；`world.js` 定义世界坐标中的网格和碰撞区域；`textures.js` 用 Canvas 生成材质图，**并不是用 Canvas 2D 绘制整个假三维世界**；`audio.js` 是 Web Audio 配乐；`app.js` 管理镜头、交互与中英文文案；`style.css` 和 `index.template.html` 是界面。

`node scripts/build.mjs` 从模块构建 `index.html`（中文）和 `index.en.html`（英文）。路径相对脚本解析，可移动到任意目录。两份成品都是完整代码，不是 iframe 或远程网址。包根目录的 `scripts/build-all.mjs` 一次构建两例。

## 新画作要改哪里

先完成 `design/painting-analysis.md` 和 `design/scene-plan.md`。替换场景与画作内容，而不是只改标题：

| 目标 | 主要文件 |
|---|---|
| 主体、路径、建筑、道具、空间边界 | `src/world.js` |
| 天空、笔触、色板、标牌 | `src/textures.js` |
| 镜头视点、导览、目的地与文案 | `src/app.js` |
| 灯光、雾、统一画面处理 | `src/engine.js` 中着色器 |
| 配乐音符与节奏 | `src/audio.js` |
| 布局、触控与响应式 | `src/style.css` |

不要把咖啡馆局部暖光的世界坐标写法带到所有画作中。一次修改一个层级，先检查主构图，再追加重复细节。工程接口在 Skill 的 `references/engine-contract.md` 中。

## 检查

```bash
node scripts/check-package.mjs
node skills/zh-CN/painting-to-world/scripts/audit.mjs examples/the-scream
```

以上仅为静态检查。浏览器测试需要单独准备 Python、Playwright、Pillow 和 Chromium；本包不分发这些程序。通用测试器可以从任何工作目录执行：

```bash
python tests/smoke.py --browser /path/to/chromium --case the-scream --suite desktop
python tests/smoke.py --browser /path/to/chromium --case cafe-terrace --suite mobile
```

`--suite` 还支持 `tour`、`fallback`。无桌面的 Linux 可能需要 `xvfb-run -a`。测试使用 `set_content` 加载本地 HTML 文本并阻止网络请求，不是 `file://` 导航测试，不是手机真机测试，也不代表听审过音乐。请查看案例 `qa/` 中本次生成的 JSON，历史报告只留作溯源。

## 宣传素材编辑

`marketing/{语言}/` 内提供 HTML 源版和 PNG。HTML 使用包里的实机截图和系统字体，修改文字后可用浏览器重新截图。PNG 只是固定尺寸的发布素材。历史 AI 海报中可能存在小字错误或超出实际交付范围的宣传措辞，不应直接当正式商品承诺。

## 发布和视频

这两个世界是静态网站：发布到静态托管即可在线访问，但本包没有执行远程发布，也没有域名、服务器或登录系统。视频可以由你在浏览器中录制；本包没有宣称交付可重复确定性的 MP4 渲染流水线或成片。

## 安全与素材

代码不含访问令牌、后台上传、遥测、麦克风、摄像头或支付逻辑。初始图片作为分析资料保留在你的工作目录。不要让 AI 未经允许把私有图传到第三方图生三维服务。用户交互触发的“原作资料”外链与运行所需依赖应分开对待。

保留作者与来源说明。对外售卖前决定你自己的商品许可与支持范围；不要仅凭源码存在就宣称任意原画图片都可商用。
