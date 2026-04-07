import React, {useEffect, useState} from "react"
import { CheckboxGroup, Checkbox } from 'rsuite'
// settings
import * as settings from "../../utils/settings"
import { t } from "../../utils/i18n"

export default function SidebarSettings(props) {
    const allOptions = settings.POSSIBLE_SIDEBAR_LINKS
    const [value, setValue] = useState([])

    // load from settings
    useEffect(() => {
        setValue(settings.getSidebarDisplaySettings().map(s => s.key))
    }, [])

    // update settings
    function update_settings(newValue) {
        setValue(newValue)
        settings.setSidebarDisplaySettings(allOptions.filter(o => newValue.includes(o.key)))
    }

    return (
        <div style={{...props.style, lineHeight:"2.5em"}}>
            <CheckboxGroup name="genresCheckboxList" value={value} onChange={update_settings}>
                <p>{t("Select the items to display in the sidebar (NOTE: you need to refresh the site for these changes to take effect)")}</p>
                {
                    allOptions.map(option => (
                        <Checkbox key={option.key} value={option.key}>
                            {t(option.text)}
                        </Checkbox>
                    ))
                }
            </CheckboxGroup>
        </div>
    )
}