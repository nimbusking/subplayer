import React, { useEffect, useState } from "react"
import { Grid, Row, Col, Loader, Button, ButtonGroup, SelectPicker } from 'rsuite'
import subsonicApi from "../../api/subsonicApi"
import { t } from "../../utils/i18n"
import SongsTableEnhanced from '../SongsTableEnhanced'
import SongsTable from '../SongsTable/SongsTable'

const SONG_COLUMNS_TO_SHOW = [
    SongsTable.columns.selectable, 
    SongsTable.columns.title, 
    SongsTable.columns.artist, 
    SongsTable.columns.album, 
    SongsTable.columns.duration, 
    SongsTable.columns.download
]

const PAGE_SIZE_OPTIONS = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '15', value: 15 },
    { label: '20', value: 20 },
    { label: '30', value: 30 }
]

const NavigationButtons = (props) => {
    const { page, onPrevious, onNext, disableNext, ...rest } = props
    return (
        <ButtonGroup {...rest}>
            <Button onClick={onPrevious} disabled={page === 0} size="sm">
                {t("Previous Page")}
            </Button>
            <Button onClick={onNext} disabled={disableNext} size="sm">
                {t("Next Page")}
            </Button>
        </ButtonGroup>
    )
}

const AllSongsView = () => {
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [count, setCount] = useState(10)
    const [disableNext, setDisableNext] = useState(false)

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true)
            try {
                const offset = page * count
                const result = await subsonicApi.getSongs(offset, count)
                setSongs(result)
                setDisableNext(result.length < count)
            } catch (error) {
                console.error("Failed to fetch songs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSongs()
    }, [page, count])

    const onNext = () => setPage(page + 1)
    const onPrevious = () => setPage(Math.max(0, page - 1))
    const onCountChange = (value) => {
        setCount(value)
        setPage(0)
    }

    return (
        <Grid fluid style={{ padding: "20px", height: "100%", overflow: "auto" }}>
            <Row style={{ marginBottom: "20px" }}>
                <Col md={24}>
                    <h1 style={{ fontWeight: "bold", display: "inline-block" }}>{t("All Songs")}</h1>
                </Col>
            </Row>

            {loading ? (
                <Loader size="lg" center={true} />
            ) : (
                <React.Fragment>
                    <Row>
                        <Col md={24}>
                            {songs.length > 0 ? (
                                <SongsTableEnhanced 
                                    style={{ marginBottom: "20px" }} 
                                    songs={songs} 
                                    columns={SONG_COLUMNS_TO_SHOW} 
                                    sortable={true} 
                                />
                            ) : (
                                <div style={{ textAlign: "center", padding: "10%" }}>
                                    <h1>{t("No results found")}</h1>
                                </div>
                            )}
                        </Col>
                    </Row>

                    { /* Optimized Pagination Row */ }
                    <Row style={{ 
                        marginTop: "20px", 
                        paddingBottom: "40px",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "space-between",
                        flexWrap: "nowrap" // Prevent wrapping on most mobile screens
                    }}>
                        <Col xs={12} md={12} style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}>
                                <span className="rs-hidden-xs" style={{ marginRight: "8px", fontSize: "12px" }}>{t("Songs per page")}:</span>
                                <SelectPicker 
                                    data={PAGE_SIZE_OPTIONS} 
                                    searchable={false} 
                                    cleanable={false} 
                                    value={count} 
                                    onChange={onCountChange}
                                    size="sm"
                                    placement="topStart"
                                    style={{ width: 65 }}
                                />
                                <span style={{ marginLeft: "12px", color: "#888", fontSize: "12px", whiteSpace: "nowrap" }}>{t("Page: ")}{page + 1}</span>
                            </div>
                        </Col>
                        <Col xs={12} md={12} style={{ textAlign: "right" }}>
                            <NavigationButtons 
                                page={page} 
                                onNext={onNext} 
                                onPrevious={onPrevious} 
                                disableNext={disableNext} 
                            />
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </Grid>
    )
}

export default AllSongsView
