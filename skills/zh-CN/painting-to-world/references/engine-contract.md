# 随包引擎接口

加载顺序：`engine.js` → `textures.js` → `world.js` → `audio.js` → `app.js`，放在一个内联脚本中。`style.css` 填入模板的 STYLE 槽。无需 ES module 导入或运行时网络。

`V` 提供 add/sub/mul/dot/cross/norm/mix；`M` 提供 identity/perspective/look/mul。`RNG(seed)` 返回确定性随机；全局还有 rgb/tint/clamp/ease。

`World` 有 solid/alpha/sky/labels 四批次。主要方法：`box(position,size,color,rotationY=0,emission=0)`；`cylinder(a,b,radiusA,radiusB,color,sides=9,emission=0)`；`sphere(position,scale,color,segments=10,rings=6,emission=0,animation=0)`；`tube(points,radius,color,sides=6,emission=0)`；`ellipse(position,radiusX,radiusZ,color,alpha=1,emission=0)`；`collider(xMin,xMax,zMin,zMax)`。`world.active` 控制普通模型写入哪个批次。`world.tables` 仅是咖啡座的家具碰撞数据。

`Batch.tri(a,b,c,color,uv?,emission=0,animation=0,alpha=1,normals?)`；`Batch.quad(a,b,c,d,color,emission=0,animation=0,alpha=1,uv?)`。注意 tri 与 quad 的 UV 参数位置不同。每顶点14个浮点数：位置3/法线3/UV2/颜色3/附加3。upload 后 CPU 数组会释放，统计必须在 init 前做。无背面剔除；透明物不做复杂深度排序，避免大面积互相叠加。

`Renderer(canvas)` 缺少 WebGL2 时抛出 `WEBGL2_UNAVAILABLE`。`init(world,paintCanvas,skyCanvas,labelCanvas)` 上传资源；`render(eye,target,time,fade=0)` 顺序渲染天空、深度测试实体、标牌、透明层和后处理。scale/paint 控制分辨率/颗粒，resize 更新帧缓冲。gl.getError() 检查图形错误。

**新画需改着色器。** 底座有咖啡馆专属 terrace 暖光和蓝色雾；蒙克不应照抄。天空是大 UV 球，不是把全场景截图贴进去。

建议统一检查接口 `window.paintingWorld`：ready、getState、jump、setPose、setLanguage、setTourTime、capture、glError。原咖啡座暴露 `window.cafeWorld`，可以同时提供通用别名。此接口用于检查，不是用户必须操作的入口。
