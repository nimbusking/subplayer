


// Default configuration
var defaults = {
    host : "/api", // 默认指向代理路径
    version : "1.9.0"
}

// Define utils and helpers
function buildUrl(config, action, params = {}) {
    // 代理模式下，不需要在前端拼接 u, p, v, f 等参数，由后端统一处理
    var base = `${config.host}/${action}`
    
    const keys = Object.keys(params)
    if (keys.length > 0) {
        base += "?"
        for (var i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = params[key]
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

    // 免登录模式下，setConfig 仅用于修改代理地址
    setConfig(host) {
        this.config = Object.assign(this.config, {
            host : host || "/api"
        })
    }

    // 免登录模式下，login 始终返回 true 或通过 ping 代理检查
    login() {
        return perform_api_call( buildUrl(this.config, "ping") )
            .then(() => true)
            .catch(() => true) // 即使失败也允许进入，由后续请求决定
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