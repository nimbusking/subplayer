import React from "react"
import PropTypes from 'prop-types'
// UI
import SongsTableEnhanced from '../SongsTableEnhanced'
import { Button } from 'rsuite'
import SongsTable from '../SongsTable/SongsTable'

const COLUMNS_TO_SHOW = [SongsTable.columns.selectable, SongsTable.columns.title, SongsTable.columns.artist, SongsTable.columns.album, SongsTable.columns.download, SongsTable.columns.starred]

export default class FavouritesView extends React.Component {

    constructor(props) {
        super(props)
        this.state = { selectedSongs : [] }
    }

    componentDidMount() {
        this.props.loadFavouriteSongs()
    }

    componentDidUpdate(prevProps) {
        if( prevProps.songs.length !== this.props.songs.length ) {
            this.setState({selectedSongs: []})
        }
    }

    /* Listeners */

    onSongsSelected = (selectedSongs) => {
        this.setState({selectedSongs: selectedSongs})
    }

    removeSelectedSongs = () => {
        if( this.state.selectedSongs.length > 0 ) {
            this.props.setStarOnSongs(this.state.selectedSongs, false)
        }
    }

    render() {
        const songs = this.props.songs
        const disableButton = this.state.selectedSongs && this.state.selectedSongs.length === 0
        return (
            <div style={{display:"flex", flexFlow:"column", padding:"20px", height:"100%", width:"100%" }}>
                <div style={{ display:"flex", flexFlow: "row", marginBottom:"15px"}}>
                    <div style={{flexGrow:1}}>
                        <h1 style={{fontWeight: "bold"}}>Favourites</h1>
                        <span id="description">{ songs.length } songs</span>
                    </div>
                    <div style={{ display:"flex", flexFlow: "column"}}>
                        <Button id="removeFromFavourites" onClick={this.removeSelectedSongs} disabled={disableButton}>Remove from favourites</Button>
                    </div>
                </div>
                <SongsTableEnhanced style={{flexGrow:1}} songs={songs} onSongsSelected={this.onSongsSelected} columns={COLUMNS_TO_SHOW} fixedHeightToFill={true} withPlaylistDropdown={false} sortable={true} />
            </div>
        )
    }
}

FavouritesView.propTypes = {
    loadFavouriteSongs : PropTypes.func.isRequired,
    setStarOnSongs : PropTypes.func,
    songs : PropTypes.array,

}

FavouritesView.defaultProps = {
    songs : []
}
