const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// --- 安全加固：允许通过代理执行的 Action 白名单 ---
// 仅包含 Subplayer 正常运行所需的只读和基础操作接口
const ALLOWED_ACTIONS = [
    'ping',             // 连通性测试
    'getArtists',       // 获取艺术家列表
    'getArtist',        // 获取单个艺术家详情
    'getAlbum',         // 获取专辑详情
    'getAlbumList2',    // 获取专辑列表（分页）
    'getPlaylists',     // 获取播放列表
    'getPlaylist',      // 获取单个播放列表
    'getCoverArt',      // 获取封面（流式）
    'stream',           // 音乐流播放（流式）
    'download',         // 音乐下载
    'search3',          // 综合搜索
    'getStarred2',      // 获取收藏内容
    'star',             // 收藏
    'unstar',           // 取消收藏
    'getSongsByGenre',  // 按流派获取歌曲
    'getGenres',        // 获取流派列表
    'scrobble',         // 播放记录同步
    'updatePlaylist',   // 更新播放列表（增删歌曲/重命名）
    'createPlaylist',   // 创建播放列表
    'deletePlaylist'    // 删除播放列表
];

// 生成 Subsonic 认证参数 (Token + Salt 模式)
function getAuthParams() {
    const user = process.env.SUBSONIC_USER;
    const pass = process.env.SUBSONIC_PASS;
    const salt = Math.random().toString(36).substring(2, 8);
    const token = crypto.createHash('md5').update(pass + salt).digest('hex');
    
    return {
        u: user,
        t: token,
        s: salt,
        v: '1.16.1',
        c: 'subplayer-proxy',
        f: 'json'
    };
}

// 代理所有 API 请求
app.get('/:action', async (req, res) => {
    const { action } = req.params;
    const subsonicUrl = process.env.SUBSONIC_URL;
    
    // 1. 验证 Action 是否在白名单内
    if (!ALLOWED_ACTIONS.includes(action)) {
        console.warn(`[Security Alert] Blocked unauthorized action: ${action} from ${req.ip}`);
        return res.status(403).json({ error: 'Action not allowed' });
    }

    if (!subsonicUrl) {
        return res.status(500).json({ error: 'SUBSONIC_URL not configured' });
    }

    // 2. 组合请求参数
    const authParams = getAuthParams();
    const queryParams = { ...authParams, ...req.query };
    
    // 3. 构建目标 URL
    const targetUrl = `${subsonicUrl}/rest/${action}.view`;

    // 特殊处理二进制流 (stream, getCoverArt, download)
    const isStream = ['stream', 'getCoverArt', 'download'].includes(action);

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            params: queryParams,
            responseType: isStream ? 'stream' : 'json',
            timeout: isStream ? 0 : 15000 // 元数据请求 15s 超时
        });

        // 转发响应头
        if (isStream) {
            res.setHeader('Content-Type', response.headers['content-type']);
            if (response.headers['content-length']) {
                res.setHeader('Content-Length', response.headers['content-length']);
            }
            // 管道传输流数据，不占用后端内存
            response.data.pipe(res);
        } else {
            res.json(response.data);
        }
    } catch (error) {
        console.error(`Proxy error for ${action}:`, error.message);
        const status = error.response ? error.response.status : 500;
        res.status(status).send(error.response ? error.response.data : 'Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`[Security Enhanced] Subplayer proxy listening at http://localhost:${port}`);
    console.log(`Allowed Actions: ${ALLOWED_ACTIONS.length} interfaces enabled.`);
});
