import { Container } from "semantic-ui-react";
import { DashboardTab } from "./DashboardTab";

/**
 * SettingsTab
 */
export const SettingsTab = ({ settingSubject, iconName, children }) => {
    return (
        <DashboardTab title={`${settingSubject} Settings`} iconName={iconName}>
            <Container fluid>
                {children}
            </Container>
        </DashboardTab>
    )
}