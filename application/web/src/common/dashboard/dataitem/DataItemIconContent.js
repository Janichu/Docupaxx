import { Icon } from "semantic-ui-react";

/**
 * DataItemIconContent
 */
export const DataItemIconContent = ({ dataModel, existing }) => {
    return (
        <Icon.Group size="large">
            <Icon name={dataModel.iconName}/>
            <Icon color={(existing ? "green": "blue")} corner="top right" name={(existing ? "edit": "add")} />
        </Icon.Group>
    )
}