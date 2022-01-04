import { Container, Header, Icon } from "semantic-ui-react";

/**
 * DashboardTab
 */
export const DashboardTab = ({ title, iconName, children }) => {
    return (
        <Container fluid>
            <Header as="h1">
                <Icon name={iconName} />
                {title}
            </Header>
            {children}
        </Container>
    )
}