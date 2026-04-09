


import crypto from "crypto"

const MODE = process.env.REACT_APP_MODE || "STANDALONE"

// Default configuration
var defaults = {
    host : MODE === "PROXY" ? "/api" : "", // PROXY 模式默认走代理，STANDALONE 模式根据用户设置
    version : "1.16.1",
    user : "",
    pass : "",
    client : "subplayer-web",
    format : "json"
}

// Define utils and helpers
function buildUrl(config, action, params = {}) {
    var base = `${config.host}/rest/${action}.view`
    
    // 如果是 PROXY 模式，API 结构不同且由后端处理鉴权
    if( MODE === "PROXY" ) {
        base = `${config.host}/${action}`
    }

    const queryParams = { ...params }

    // 如果是 STANDALONE 模式，添加鉴权参数
    if( MODE === "STANDALONE" ) {
        const salt = Math.random().toString(36).substring(2, 8)
        const token = crypto.createHash('md5').update(config.pass + salt).digest('hex')
        
        queryParams["u"] = config.user
        queryParams["t"] = token
        queryParams["s"] = salt
        queryParams["v"] = config.version
        queryParams["c"] = config.client
        queryParams["f"] = config.format
    }
    
    const keys = Object.keys(queryParams)
    if (keys.length > 0) {
        base += "?"
        for (var i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = queryParams[key]
            if (i > 0) base += "&"
            
            if( Array.isArray(value) ) {
                base += value.map(val => `${key}=${encodeURIComponent(val)}`).join("&")
            }
            else {
                base += `${key}=${encodeURIComponent(value)}`
            }
        }
    }
    return base
}

function perform_api_call(url) {
    return fetch(url)
        .then(response => {
            var contentType = response.headers.get('content-type')
            if(contentType && contentType.includes('application/json')) {
                return response.json()
            }
            return Promise.reject(new Error(`${response.status}, ${response.body}`) )
        })
        .then(data => {
            // Get subsonic response
            const response = data["subsonic-response"]
            if (!response) return data; // 兼容直接返回数据的情况
            return response["status"] === "ok" ?
                response :
                Promise.reject(new Error(`${response.error.message}`))
        })
}

// Define main function
class Subsonic {

    constructor(config) {
        this.config = config
    }

// 设置配置信息
    setConfig(host, user, pass) {
        // 清理 host 末尾的斜杠和冗余的 /rest
        if (host) {
            host = host.replace(/\/$/, "").replace(/\/rest$/, "")
        }
        this.config = Object.assign(this.config, {
            host : host || (MODE === "PROXY" ? "/api" : ""),
            user : user || "",
            pass : pass || ""
        })
    }

    // 登录/验证逻辑
    login(host, user, pass) {
        if (host && user && pass) {
            this.setConfig(host, user, pass)
        }

        return perform_api_call( buildUrl(this.config, "ping") )
            .then(result => {
                // 如果是 STANDALONE 模式且验证成功，说明登录有效
                return true
            })
            .catch(err => {
                // PROXY 模式下即使 ping 失败也允许进入（可能是后端暂时不可达），由后续请求决定
                if (MODE === "PROXY") return true
                throw err
            })
    }

    // 获取加密后的密码（用于存储，如果是 MD5 Token 模式则直接返回原值）
    getEncodedPassword(password) {
        return password
    }
    
    getArtists() {
        return perform_api_call( buildUrl(this.config, "getArtists") )
            .then(result => {
                return result["artists"]["index"]
            })
    }

    getArtist(id) {
        return perform_api_call( buildUrl(this.config, "getArtist", {id:id}) )
            .then(result => {
                return result["artist"]
            })
    }

    getAlbum(id) {
        return perform_api_call( buildUrl(this.config, "getAlbum", {id:id}) )
            .then(result => {
                return result["album"]
            })
    }

    getAlbumList2(type, extras, offset=0, size=24) {
        return perform_api_call( buildUrl(this.config, "getAlbumList2", {type, size, offset, ...extras}) )
            .then(result => {
                return result["albumList2"]["album"] || []
            })
    }

    getPlaylists() {
        return perform_api_call( buildUrl(this.config, "getPlaylists") )
            .then(result => {
                return result["playlists"]["playlist"] || []
            })
    }

    getPlaylistById(id) {
        return perform_api_call( buildUrl(this.config, "getPlaylist", {id:id}) )
            .then(result => {
                return result["playlist"]
            })
    }

    getCoverArtUrl(id) {
        return buildUrl(this.config, "getCoverArt", {id:id})
    }

    getStreamUrl(id) {
        return buildUrl(this.config, "stream", {id:id})
    }

    getDownloadUrl(id) {
        return buildUrl(this.config, "download", {id:id})
    }

    addSongsToPlaylist(playlistId, songIds) {
        return perform_api_call( buildUrl(this.config, "updatePlaylist", {playlistId:playlistId, songIdToAdd : songIds}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    removeSongsFromPlaylist(playlistId, songIndexes) {
        return perform_api_call( buildUrl(this.config, "updatePlaylist", {playlistId:playlistId, songIndexToRemove : songIndexes}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    deletePlaylist(playlistId){
        return perform_api_call( buildUrl(this.config, "deletePlaylist", {id:playlistId}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    createPlaylist(name){
        return perform_api_call( buildUrl(this.config, "createPlaylist", {name:name}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    updatePlaylist(id, name, comment, isPublic){
        return perform_api_call( buildUrl(this.config, "updatePlaylist", {playlistId:id, name:name, comment:comment, public:isPublic }) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    search(query) {
        return perform_api_call( buildUrl(this.config, "search3", {query:query, albumCount:24 }) )
            .then(result => {
                return result["searchResult3"]
            })
    }

    getStarred() {
        return perform_api_call( buildUrl(this.config, "getStarred2") )
            .then(result => {
                return result["starred2"]
            })
    }

    unstar(ids) {
        return perform_api_call( buildUrl(this.config, "unstar", {id:ids}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    star(ids) {
        return perform_api_call( buildUrl(this.config, "star", {id:ids}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    starAlbums(ids) {
        return perform_api_call( buildUrl(this.config, "star", {albumId:ids}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    unstarAlbums(ids) {
        return perform_api_call( buildUrl(this.config, "unstar", {albumId:ids}) )
            .then(result => {
                return result["status"] === "ok"
            })
    }

    getSongsByGenre(genre, offset=0, count=500) {
        return perform_api_call( buildUrl(this.config, "getSongsByGenre", {genre, count, offset}) )
            .then(result => {
                return result["songsByGenre"]["song"]
            }) 
    }

    getSongs(offset = 0, count = 50, query = "*") {
        return perform_api_call( buildUrl(this.config, "search3", {
            query: query,
            songCount: count,
            songOffset: offset,
            artistCount: 0,
            albumCount: 0
        }) )
        .then(result => {
            return result["searchResult3"]["song"] || []
        })
    }

    getGenres() {
        return perform_api_call( buildUrl(this.config, "getGenres") )
            .then(result => {
                return result["genres"]["genre"]
            }) 
    }

    scrobble(id, time, submission=false) {
        return perform_api_call( buildUrl(this.config, "scrobble", {id, time, submission}) )
            .then(result => {
                return result["status"] === "ok"
            }) 
    }

}

// Export instance
export default new Subsonic(defaults)