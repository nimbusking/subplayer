
/* Scrobble Settings */
const DEFAULT_IS_SCROBBLING = true

export function getIsScrobbling() {
	const value = localStorage.getItem('is_scrobbling')
	return value !== null ? value === "true" : DEFAULT_IS_SCROBBLING
}

export function setIsScrobbling(value) {
	localStorage.setItem('is_scrobbling', value)
}

/* Volume Settings */
const DEFAULT_VOLUME = 1.0

export function getVolume() {
	const value = localStorage.getItem('volume')
	return value !== null ? parseFloat(value) : DEFAULT_VOLUME
}

export function setVolume(value) {
	localStorage.setItem('volume', value)
}

/* Playback Rate Settings */
const DEFAULT_PLAYBACK_RATE = 1.0

export function getPlaybackRate() {
	const value = localStorage.getItem('playback_rate')
	return value !== null ? parseFloat(value) : DEFAULT_PLAYBACK_RATE
}

export function setPlaybackRate(value) {
	localStorage.setItem('playback_rate', value)
}

/* Shuffle Settings */
const DEFAULT_IS_SHUFFLING = true

export function getIsShuffleOn() {
	const value = localStorage.getItem('is_shuffling')
	return value !== null ? value === "true" : DEFAULT_IS_SHUFFLING
}

export function setShuffle(value) {
	localStorage.setItem('is_shuffling', value)
}

/* Language Settings */
const DEFAULT_LANGUAGE = 'zh'

export function getLanguage() {
	const value = localStorage.getItem('language')
	return value !== null ? value : DEFAULT_LANGUAGE
}

export function setLanguage(value) {
	localStorage.setItem('language', value)
}

/* Sidebar settings */
export const POSSIBLE_SIDEBAR_LINKS = [
    {key:"/latest" , icon: "clock-o", text:"Recently Added"},
    {key:"/artists" , icon: "group", text:"Artists"},
    {key:"/album" , icon: "th2", text:"Albums"},
    {key:"/genres" , icon: "venus-mars", text:"Genres"},
    {key:"/favourites" , icon: "star", text:"Favourites"},
]

export function getSidebarDisplaySettings(mobile=false) {
    // Return all the possible items if the client is a mobile as we assume
    // they don't take too much space
    let items = POSSIBLE_SIDEBAR_LINKS
    if( !mobile ) {
        // if the client is not mobile, return the filtered items
        let savedItems = localStorage.getItem('sidebar_settings')
        if( savedItems !== null) {
            savedItems = JSON.parse(savedItems)
            items = POSSIBLE_SIDEBAR_LINKS.filter(item => savedItems.includes(item.key))
        }
    }
    return items
}

export function setSidebarDisplaySettings(value) {
    localStorage.setItem('sidebar_settings', JSON.stringify(value.map(v => v.key)) )
}