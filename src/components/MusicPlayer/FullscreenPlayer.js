import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, Icon, Dropdown } from 'rsuite'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import subsonic from "../../api/subsonicApi"
import { seconds_to_mss } from "../../utils/formatting.js"
import "./FullscreenPlayer.less"

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

const FullscreenPlayer = ({
    show,
    song,
    songs,
    playing,
    seek,
    isShuffleOn,
    playbackRate,
    onClose,
    onTogglePlay,
    onPrevious,
    onNext,
    onToggleShuffle,
    onToggleStar,
    onSeek,
    onSeekStopped,
    onChangePlaybackRate,
    onSeekToSong,
    onClearQueue
}) => {
    const starIcon = song.starred ? "star" : "star-o"

    return (
        <div className={`fullscreen-player ${show ? 'show' : ''}`}>
            {/* Top Bar */}
            <div className="fullscreen-header">
                <IconButton
                    icon={<Icon icon="angle-down" />}
                    appearance="link"
                    size="lg"
                    onClick={onClose}
                    className="close-button"
                />
                <span className="header-title">Now Playing</span>
                <IconButton
                    icon={<Icon icon="ellipsis-h" />}
                    appearance="link"
                    size="lg"
                    className="more-button"
                />
            </div>

            {/* Album Art */}
            <div className="fullscreen-album-art">
                <img
                    src={song.coverArt ? subsonic.getCoverArtUrl(song.coverArt) : "/currently_placeholder.png"}
                    alt="cover"
                />
            </div>

            {/* Song Info */}
            <div className="fullscreen-song-info">
                <div className="info-text">
                    <div className="song-title-wrapper">
                        <h2 className="song-title">
                            <span>{song.title}</span>
                        </h2>
                    </div>
                    <p className="song-artist">{song.artist}</p>
                </div>
                <IconButton
                    icon={<Icon icon={starIcon} />}
                    onClick={onToggleStar}
                    appearance="link"
                    size="lg"
                    className="star-button"
                />
            </div>

            {/* Progress Bar */}
            <div className="fullscreen-progress-container">
                <Slider
                    value={seek}
                    onChange={onSeek}
                    onAfterChange={onSeekStopped}
                    max={song.duration || 0}
                    className="fullscreen-slider"
                />
                <div className="time-labels">
                    <span>{seconds_to_mss(seek)}</span>
                    <span>-{seconds_to_mss((song.duration || 0) - seek)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="fullscreen-controls">
                <Dropdown
                    title={`${playbackRate}x`}
                    onSelect={onChangePlaybackRate}
                    placement="topStart"
                    className="playback-dropdown"
                    renderTitle={(children) => <span className="playback-rate">{children}</span>}
                >
                    {playbackRates.map(rate => (
                        <Dropdown.Item key={rate} eventKey={rate} active={rate === playbackRate}>
                            {rate}x
                        </Dropdown.Item>
                    ))}
                </Dropdown>

                <div className="main-controls">
                    <IconButton
                        icon={<Icon icon="step-backward" />}
                        appearance="link"
                        onClick={onPrevious}
                        className="control-btn"
                    />
                    <IconButton
                        icon={<Icon icon={playing ? "pause" : "play"} />}
                        appearance="link"
                        onClick={onTogglePlay}
                        className="play-pause-btn"
                    />
                    <IconButton
                        icon={<Icon icon="step-forward" />}
                        appearance="link"
                        onClick={onNext}
                        className="control-btn"
                    />
                </div>

                <IconButton
                    icon={<Icon icon="random" />}
                    onClick={onToggleShuffle}
                    appearance="link"
                    className={`shuffle-btn ${isShuffleOn ? 'active' : ''}`}
                />
            </div>

            {/* Queue Section */}
            <div className="fullscreen-queue">
                <div className="queue-header">
                    <span className="queue-title">QUEUE</span>
                    <div className="queue-actions">
                        <IconButton icon={<Icon icon="random" />} appearance="link" onClick={onToggleShuffle} className={isShuffleOn ? 'active' : ''} />
                        <span className="clear-text" onClick={onClearQueue}>Clear</span>
                    </div>
                </div>
                <div className="queue-list">
                    {songs.map((s, index) => (
                        <div
                            key={`${s.id}-${index}`}
                            className={`queue-item ${s.id === song.id ? 'active' : ''}`}
                            onClick={() => onSeekToSong(s)}
                        >
                            <img
                                src={s.coverArt ? subsonic.getCoverArtUrl(s.coverArt) : "/currently_placeholder.png"}
                                alt="cover"
                                className="queue-item-art"
                            />
                            <div className="queue-item-info">
                                <p className="queue-item-title">{s.title}</p>
                                <p className="queue-item-artist">{s.artist}</p>
                            </div>
                            <span className="queue-item-duration">{seconds_to_mss(s.duration)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

FullscreenPlayer.propTypes = {
    show: PropTypes.bool,
    song: PropTypes.object,
    songs: PropTypes.array,
    playing: PropTypes.bool,
    seek: PropTypes.number,
    isShuffleOn: PropTypes.bool,
    playbackRate: PropTypes.number,
    onClose: PropTypes.func,
    onTogglePlay: PropTypes.func,
    onPrevious: PropTypes.func,
    onNext: PropTypes.func,
    onToggleShuffle: PropTypes.func,
    onToggleStar: PropTypes.func,
    onSeek: PropTypes.func,
    onSeekStopped: PropTypes.func,
    onChangePlaybackRate: PropTypes.func,
    onSeekToSong: PropTypes.func,
    onClearQueue: PropTypes.func
}

export default FullscreenPlayer
