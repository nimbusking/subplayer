import React from 'react'
import PropTypes from 'prop-types'
// UI
import ThemePicker from '../ThemePicker'
import SidebarSettings from '../SidebarSettings'
import ScrobbleSetting from '../ScrobbleSetting'
import { Button, Row, Col, Divider, ButtonGroup } from 'rsuite'
// Utils
import * as utils from "../../utils/theming"
import { t, getLanguage, setLanguage } from "../../utils/i18n"

export default class SettingsView extends React.Component {

    constructor(props){
        super(props)
        this.themes = utils.getAvailableThemes()
    }

    onLogOut = () => {
        this.props.logout()
    }

    render() {
        const themes = this.themes
        const currentLang = getLanguage()
        return (
            <div style={{display:"flex", flexDirection:"column", padding:"20px", height:"100%", overflow:"auto"}}>
                <Row><h1>{t("Settings")}</h1></Row>
                
                {/* Language Settings */}
                <h4 style={{marginTop:"15px"}}>{t("Language")}</h4>
                <Row style={{marginTop:"10px"}}>
                    <ButtonGroup>
                        <Button 
                            appearance={currentLang === 'zh' ? 'primary' : 'default'}
                            onClick={() => setLanguage('zh')}
                        >
                            {t("Chinese")}
                        </Button>
                        <Button 
                            appearance={currentLang === 'en' ? 'primary' : 'default'}
                            onClick={() => setLanguage('en')}
                        >
                            {t("English")}
                        </Button>
                    </ButtonGroup>
                </Row>

                {/*Scrobble*/}
                <ScrobbleSetting />
                
                {/* Theme picker */}
                <h4 style={{marginTop:"15px"}}>{t("Appearance")} - {t("Theme")}</h4>
                <Row>
                    <ThemePicker themes={themes} />
                </Row>
                
                {/* Items to display in the sidebar */}
                <h4 style={{marginTop:"15px"}}>{t("Sidebar")}</h4>
                <Row>
                    <SidebarSettings />
                </Row>
                
                {/*Log out*/}
                <div style={{flex:1}} />
                <Row>
                    <Col md={24}>
                        <Divider />
                    </Col>
                </Row>
                <Row style={{marginBottom: "20px"}}>
                    <Col xs={24} md={8} mdOffset={8}>
                        <Button id="logoutButton" appearance="primary" onClick={this.onLogOut} block={true} size="lg" >{t("Logout")}</Button>
                    </Col>
                </Row>
            </div>
        )
    }

}

SettingsView.propTypes = {
    logout : PropTypes.func.isRequired
}
