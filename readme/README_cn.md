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
- **优化多平台页面适配（优化）**：已对手机端尽量适配

---

## 3. 核心模块分析

### 3.1 数据交互层 (src/api/)
*   **subsonicApi.js**: 封装了所有与 Subsonic 兼容服务器的通信逻辑。包括身份验证、元数据获取、播放列表管理、媒体资源获取及收藏评分等。

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

## 9. 免登录代理模式 (Proxy Mode)

为了在不暴露 Subsonic 账号凭据的情况下实现“免登录”访问，该分支已将 API 请求逻辑改造为**代理模式**。

### 9.1 工作原理
1.  **前端**: 不再直接拼接 `u` (用户名), `p` (密码) 等敏感参数。所有请求统一发送至 `/api` 前缀。
2.  **后端 (需单独实现)**: 搭建一个中转服务器（Proxy），持有真实的 Subsonic 凭据。它接收来自前端的请求，自动补全认证参数并转发给 Subsonic 服务器，最后将结果回传。

### 9.2 API 变更汇总
在代理模式下，前端发出的请求格式如下：

| 功能 | 原始 Subsonic API (示例) | 改造后的代理 API (前端发出) |
| :--- | :--- | :--- |
| **Ping 测试** | `/rest/ping.view?u=..&p=..` | `/api/ping` |
| **获取艺术家** | `/rest/getArtists.view?u=..` | `/api/getArtists` |
| **获取专辑** | `/rest/getAlbum.view?id=123` | `/api/getAlbum?id=123` |
| **流媒体播放** | `/rest/stream.view?id=456` | `/api/stream?id=456` |
| **封面图片** | `/rest/getCoverArt.view?id=789` | `/api/getCoverArt?id=789` |
| **搜索** | `/rest/search3.view?query=abc` | `/api/search3?query=abc` |

**优势：**
*   **安全性**: 敏感凭据（密码/Token）仅存在于后端，不会通过浏览器泄露。
*   **简洁性**: 前端代码不再需要处理登录逻辑、密码加密或 Token 盐值。
*   **可控性**: 后端代理可以轻松实现流量限制、IP 白名单或只读控制。

---

## 10. 鸣谢与许可

- Favicon 由 www.flaticon.com 的 Freepik 制作。
- 使用 [rsuite/rsuite](https://github.com/rsuite/rsuite) UI 组件。
- 许可协议: [GNU General Public License v3.0](https://github.com/peguerosdc/rsuite-sonicplayer/blob/master/LICENSE)。
