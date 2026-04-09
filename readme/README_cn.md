[English](../README.md) | 简体中文

# Subplayer

[![codecov](https://codecov.io/gh/peguerosdc/subplayer/branch/master/graph/badge.svg)](https://codecov.io/gh/peguerosdc/subplayer)
[![Build Status](https://travis-ci.com/peguerosdc/subplayer.svg?branch=master)](https://travis-ci.com/peguerosdc/subplayer)
![Docker Pulls](https://img.shields.io/docker/pulls/peguerosdc/subplayer)

这是一个前端应用程序，旨在成为一个简单、实用且美观的 Web 播放器，可与 Subsonic 后端配合使用（已在 [spl0k/supysonic](https://github.com/spl0k/supysonic) 和 [deluan/navidrome](https://github.com/deluan/navidrome) 上进行过测试）。

![Overview](../docs/overview.png)

在线演示：[Netlify 上的 Subplayer](https://subplayer.netlify.app/)

> **由于原仓库若干年未更新，有理由可能已经不再维护，目前暂不提交PR，新增和跟新内容如下：**

---

## 1. 项目分析报告 (整合内容)

Subplayer 是一个基于 React 开发的开源 Subsonic 协议 Web UI 前端项目。

### 1.1 技术栈概览

*   **前端框架**: React (v16.8.6)
*   **状态管理**: Redux (配合 redux-thunk 处理异步逻辑, reselect 进行状态选择)
*   **路由管理**: @reach/router
*   **UI 组件库**: rsuite (v4.7.2)
*   **音频引擎**: howler (v2.1.2)
*   **样式处理**: LESS (通过 react-app-rewired 自定义 Webpack 配置)
*   **API 交互**: Fetch API (封装在 src/api/subsonicApi.js)

### 1.2 核心目录结构

```text
src/
├── api/             # API 请求封装，主要包含 subsonicApi.js
├── components/      # UI 组件，按功能模块划分子目录
├── redux/           # Redux 状态管理 (actions, reducers, selectors, store)
├── utils/           # 工具类函数 (格式化、主题切换、设置管理等)
├── App.js           # 应用主布局组件
├── Main.js          # 应用入口路由与 Redux Provider 配置
└── index.js         # 项目启动入口，初始化主题并渲染 Main
```

---

## 2. 功能特性

- **音频播放与进度调节**
- **查看/创建/编辑播放列表**
- **从收藏中添加/移除歌曲**
- **搜索艺术家/专辑/歌曲**
- **按艺术家、专辑和流派浏览音乐**
- **收藏/取消收藏专辑**
- **播放记录同步 (Scrobble)**
- **添加/移除播放队列**
- **多主题切换**
- **播放倍速调整 (新增)**: 支持 0.5x 到 2.0x 调节，自动持久化。
- **所有歌曲分页查询 (新增)**: 支持全量歌曲检索，服务端分页，极大提升性能。
- **完善的国际化 (新增)**: 完整的全界面中英文适配。
- **优化多平台页面适配（优化）**：已对手机端尽量适配。
- **歌曲标题滚动显示 (新增)**: 正在播放的歌曲标题支持左右滚动（跑马灯效果），方便查看长标题。
- **简洁列表视图 (优化)**: 默认隐藏了歌曲时长列和总时长统计，使界面更加清爽。

---

## 3. 核心模块分析

### 3.1 数据交互层 (src/api/)
*   **subsonicApi.js**: 封装了所有与 Subsonic 兼容服务器的通信逻辑。支持双模式（STANDALONE / PROXY）切换，自动处理鉴权参数或代理转发。

### 3.2 状态管理层 (src/redux/)
*   管理用户登录状态、音乐播放器状态（播放列表、索引、状态、倍速）、音乐元数据缓存、用户播放列表数据及全局异步任务跟踪。

### 3.3 UI 组件层 (src/components/)
*   **布局组件**: 核心布局骨架 (`App.js`)、响应式导航栏、侧边栏及底部播放器。
*   **视图组件**: 专辑/艺术家列表、详情页、播放列表视图、搜索结果及播放队列管理。

---

## 4. 特色功能实现逻辑

### 4.1 播放倍速调整
*   在 Redux 中新增 `playbackRate` 字段并持久化。
*   利用 `howler.js` 的 `rate()` API 实现实时倍速应用。

### 4.2 所有歌曲分页查询
*   **API 实现**: 封装 `search3` 接口并传入通配符 `query="*"`，支持 `songCount` 和 `songOffset` 参数。
*   **交互设计**: 动态加载分页，支持切换每页条数 (5, 10, 15, 20, 30)，复用增强型歌曲列表组件。
*   **布局优化**: 统一底部控制栏，针对移动端精简显示，确保不换行。

---

## 5. 自定义主题

默认情况下，可用的主题只有蓝色、橙色、绿色和灰色（均有浅色和深色模式）。如果您想创建自定义主题，可以编辑 `/themes.config.js`。每个主题的名称必须以 "light" 或 "dark" 开头，以便编译器知道加载哪些设置。

有关自定义变量的列表，请访问 [RSuite 文档](https://rsuitejs.com/en/guide/themes/)。

**注意：** Rsuite 提供的创建自定义主题的工具并非设计用于 `create-react-app`，因此这里的实现被认为是一个“黑科技 (hack)”，存在两个缺点：
1) 您不能创建太多主题，否则编译器内存会溢出（这也是为什么默认只定义了 4 种颜色）。
2) 第一次运行时，您会看到一个白页。重新加载后，应用程序将正常工作。

---

## 6. 安装与运行

### 运行源代码

克隆仓库并在根目录下运行：

```bash
$ yarn install
$ yarn start
```

### Docker 安装

自行构建镜像：

```bash
$ docker build . -t peguerosdc/subplayer
```

或使用 `buildx` 构建多平台镜像：

```bash
$ docker buildx build --platform linux/arm64,linux/amd64 --push -t peguerosdc/subplayer .
```

运行镜像：

```bash
$ docker run --name mysubplayer \
    -p 8000:80 \
    --restart unless-stopped \
    -d peguerosdc/subplayer
```

---

## 7. 二次开发建议

1.  **添加功能**: 在 `src/api/subsonicApi.js` 添加 API 方法，在 `src/redux/` 处理状态。
2.  **修改样式**: 项目基于 `rsuite` 和 `less`，主题定制在 `themes.config.js` 中。
3.  **调试**: 使用 `npm test` 运行单元测试，利用 Redux DevTools 监控状态。

---

## 9. 运行模式与代理 (Modes & Proxy)

本项目现在支持两种运行模式，通过环境变量 `REACT_APP_MODE` 进行切换。

### 9.1 运行模式对比

| 模式 | 配置值 | 说明 | 鉴权逻辑 |
| :--- | :--- | :--- | :--- |
| **标准模式** | `STANDALONE` | 传统的账号密码登录模式。 | 前端通过 MD5 Token/Salt 鉴权。 |
| **代理模式** | `PROXY` | 预配置模式，跳过登录界面。 | 前端不持有凭据，由后端代理服务器处理。 |

### 9.2 代理模式 (Proxy Mode) 工作原理
1.  **前端**: 请求统一发送至 `/api` 前缀，不带敏感参数。
2.  **后端**: 配合项目中的 `deploy/backend` 服务，持有真实的 Subsonic 凭据并完成转发。

### 9.3 环境变量配置 (`.env`)

```bash
# 模式选择 (STANDALONE 或 PROXY)
REACT_APP_MODE=PROXY

# --- 仅 PROXY 模式后端需要 ---
SUBSONIC_URL=http://your-server:4040
SUBSONIC_USER=admin
SUBSONIC_PASS=password
```

---

## 10. 部署与优化

### 10.1 Docker Compose 部署
推荐使用 `docker-compose.yml` 进行一键部署，支持前端 Nginx 和后端 Proxy 的联动。

### 10.2 外部资源映射
可以通过卷映射（Volumes）自定义网站图标等资源：
```yaml
volumes:
  - ./public/favicon.ico:/usr/share/nginx/html/favicon.ico
```

### 10.3 流媒体优化 (Nginx)
内置的 Nginx 配置已针对长音频流进行优化：
*   **超长超时**: `proxy_read_timeout` 已延长至 3 小时，防止大文件播放中断。
*   **字符集**: 显式设置 `charset utf-8`，解决 Linux/群晖环境下的中文乱码问题。
*   **分块传输**: 启用 `chunked_transfer_encoding` 保证流式播放稳定性。

---

## 11. 鸣谢与许可

- Favicon 由 www.flaticon.com 的 Freepik 制作。
- 使用 [rsuite/rsuite](https://github.com/rsuite/rsuite) UI 组件。
- 许可协议: [GNU General Public License v3.0](https://github.com/peguerosdc/rsuite-sonicplayer/blob/master/LICENSE)。
