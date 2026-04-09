const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

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
    
    if (!subsonicUrl) {
        return res.status(500).json({ error: 'SUBSONIC_URL not configured' });
    }

    // 组合请求参数
    const authParams = getAuthParams();
    const queryParams = { ...authParams, ...req.query };
    
    // 构建目标 URL
    const targetUrl = `${subsonicUrl}/rest/${action}.view`;

    // 特殊处理二进制流 (stream, getCoverArt, download)
    const isStream = ['stream', 'getCoverArt', 'download'].includes(action);

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            params: queryParams,
            responseType: isStream ? 'stream' : 'json',
            timeout: isStream ? 0 : 10000 // 媒体流不设置超时
        });

        // 转发响应头 (Content-Type, Content-Length)
        if (isStream) {
            res.setHeader('Content-Type', response.headers['content-type']);
            if (response.headers['content-length']) {
                res.setHeader('Content-Length', response.headers['content-length']);
            }
            response.data.pipe(res);
        } else {
            res.json(response.data);
        }
    } catch (error) {
        console.error(`Proxy error for ${action}:`, error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : 'Internal Server Error';
        res.status(status).send(message);
    }
});

app.listen(port, () => {
    console.log(`Subplayer proxy listening at http://localhost:${port}`);
});
