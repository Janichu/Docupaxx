import { Message } from "semantic-ui-react";
import { DataItemAddButton } from "./DataItemButtonContent";

/**
 * DataItemAbsentContent
 */
export const DataItemAbsentContent = ({ dataModel, viewerId, dataParentId }) => {
    return (
        <Message>
            {dataModel.absentMessage}
            {dataModel.add && false && (
                <DataItemAddButton dataModel={dataModel} viewerId={viewerId} dataParentId={dataParentId} />
            )}
        </Message>
    )
}