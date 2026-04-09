# 🚀 Subplayer 免登录代理模式部署指南

本指南将指导您如何使用 Docker 容器化方案部署 **Subplayer**，并启用后端代理以实现**免登录**访问。

---

## 🏗️ 架构概览

该方案通过 **Docker Compose** 一键启动两个核心服务：
1.  **subplayer-frontend (Nginx)**: 托管 React 前端静态资源，并处理 `/api` 请求的反向代理。
2.  **subplayer-backend (Node.js)**: 极简代理服务器，持有 Subsonic 凭据，负责注入认证信息并转发 API 请求。

---

## 📋 环境准备

在开始之前，请确保您的服务器已安装：
- [Docker](https://docs.docker.com/get-docker/) (20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (1.29+)

---

## 🛠️ 部署步骤

### 第一步：克隆项目并进入目录
如果您已经在项目目录中，请忽略此步。
```bash
git clone <your-repo-url>
cd subplayer
# 确保您在 proxy 分支
git checkout proxy
```

### 第二步：配置环境变量
复制环境变量模板并根据您的真实环境进行修改。
```bash
cp .env.example .env
```
编辑 `.env` 文件：
```env
# 真实的 Subsonic 服务器地址 (如 Navidrome, Supysonic 等)
SUBSONIC_URL=http://192.168.1.10:4040

# 您希望前端默认使用的 Subsonic 账号（建议创建一个只读权限的 Guest 账号）
SUBSONIC_USER=guest_user
SUBSONIC_PASS=guest_password
```

### 第三步：构建并启动容器
在根目录下运行以下命令：
```bash
docker-compose up --build -d
```
*注：`--build` 确保重新构建镜像，`-d` 表示在后台运行。*

### 第四步：验证部署
1.  检查容器运行状态：
    ```bash
    docker-compose ps
    ```
2.  在浏览器中访问：`http://<您的服务器IP>`
3.  **预期结果**：页面直接加载您的音乐库，无需输入用户名和密码。

---

## 📂 文件说明

- `Dockerfile`: 前端多阶段构建配置。
- `docker-compose.yml`: 服务编排文件。
- `deploy/backend/server.js`: 核心代理逻辑，处理 Token + Salt 认证。
- `deploy/nginx/default.conf`: Nginx 转发规则。

---

## 🔒 安全性建议

1.  **最小权限原则**：在 Subsonic 服务器（如 Navidrome）中，请为代理账号仅分配“流媒体播放”权限，关闭任何管理或文件修改权限。
2.  **HTTPS 部署**：如果在公网环境，强烈建议在 Nginx 前层再挂载一个反向代理（如 NPM, Traefik）或配置 SSL 证书，确保传输加密。
3.  **私有网络**：`subplayer-backend` 容器没有暴露端口到外部网络，仅能被 `subplayer-frontend` 内部访问，这极大地降低了攻击面。

---

## 🛠️ 常见问题排查

- **页面一直加载？**
    检查 `.env` 中的 `SUBSONIC_URL` 是否能被 Docker 容器访问（如果 Subsonic 在宿主机，请尝试使用宿主机内网 IP 而非 `localhost`）。
- **封面不显示？**
    检查后端日志：`docker logs subplayer-backend`，确认 `getCoverArt` 请求是否成功转发。
- **无法播放？**
    确保 Subsonic 服务器的流媒体设置允许从该代理 IP 访问。
