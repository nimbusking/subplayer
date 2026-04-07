// Redux
import { connect } from "react-redux"
import { playNextSong, playPreviousSong, toggleShuffle, seekToSongInQueue, clearQueue } from "../../redux/actions/songsActions"
import { setStarOnSongs } from "../../redux/actions/favouritesActions"
import { getSongCurrentlyPlayingSelector, getSongsInQueueSelector } from '../../redux/selectors/musicPlayerSelector'
// UI
import MusicPlayer from './MusicPlayer'

const mapStateToProps = (state) => {
    return {
        "song" : getSongCurrentlyPlayingSelector(state),
        "songs": getSongsInQueueSelector(state),
        "isShuffleOn": state.musicPlayer.isShuffleOn,
    }
}

const mapDispatchToProps = { playNextSong, playPreviousSong, setStarOnSongs, toggleShuffle, seekToSongInQueue, clearQueue }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MusicPlayer)