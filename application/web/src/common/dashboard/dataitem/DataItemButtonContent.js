import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, List, Modal } from "semantic-ui-react";
import { approveDataItem, dataParentIdExists, downloadDataItem, removeDataItem } from "../DataTabInterface";

/**
 * DataItemButtonContent
 */
export const DataItemButtonContent = ({ item, viewerId, dataParentId, dataModel, setDataItems  }) => {
    return (
        <List.Content floated="right">
            {dataModel.edit && (
                <DataItemEditButton 
                    dashboardToken={dataModel.dashboardToken}
                    dataModel={dataModel}
                    viewerId={viewerId}
                    dataParentId={dataParentId}
                    dataToken={dataModel.dataToken}
                    editText={dataModel.editText}
                    item={item}
                />
            )}
            {dataModel.download && (
                <DataItemDownloadButton 
                    viewerId={viewerId}
                    dataParentId={dataParentId}
                    dataModel={dataModel}
                    downloadText={dataModel.downloadText}
                    item={item}
                />
            )}
            {dataModel.approve && (
                <DataItemApproveButton 
                    item={item}
                    dataModel={dataModel}
                    viewerId={viewerId}
                    setDataItems={setDataItems}
                />
            )}
            {dataModel.remove && (
                <DataItemRemoveButton 
                    item={item}
                    dataModel={dataModel}
                    viewerId={viewerId}
                    dataParentId={dataParentId}
                    setDataItems={setDataItems}
                />
            )}
        </List.Content>
    )
}




/**
 * DataItemAddButton
 */
export const DataItemAddButton = ({ dataModel, viewerId, dataParentId }) => {
    let url = `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.section}/new`
    if (dataParentIdExists(dataParentId)) {
       url = `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.section}/${dataParentId}/new` 
    }
    return (
        <Button
            as={Link}
            to={url}
            floated="right"
            color="blue"
        >
            <Icon name="plus" />
            {dataModel.addText}
      </Button>
    )
}





/**
 * DataItemApproveButton
 */
export const DataItemApproveButton = ({ item, viewerId, dataModel, setDataItems }) => {
    const onApprove = () => approveDataItem({ item, dataModel, viewerId, setDataItems })
    return (
        <Button icon labelPosition="left" color="green" onClick={onApprove}>
            <Icon name="check" /> Approve
        </Button>
    )
}



/**
 * DataItemDownloadButton
 */
export const DataItemDownloadButton = ({ viewerId, dataParentId, dataModel, downloadText, item }) => {
    return (
        <Button icon labelPosition="left" color="brown" onClick={() => downloadDataItem({ viewerId, dataParentId, dataModel, item })}>
            <Icon name="download" /> {downloadText}
        </Button>
    )
}




/**
 * DataItemEditButton
 */
export const DataItemEditButton = ({ dataModel, dashboardToken, viewerId, dataParentId, dataToken, editText, item }) => {
    let url = `/${dashboardToken}/${viewerId}/dashboard/${dataModel.section}/${item.id}/edit`
    if (dataParentIdExists(dataParentId)) {
       url = `/${dashboardToken}/${viewerId}/dashboard/${dataModel.section}/${dataParentId}/${item.id}/edit` 
    }
    return (
        <Button
            as={Link}
            to={url}
            icon
            labelPosition="left"
            color="green"
        >
            <Icon name="edit" /> {editText}
        </Button>
    )
}




/**
 * DataItemRemoveButton
 */
export const DataItemRemoveButton = ({ item, viewerId, dataParentId, dataModel, setDataItems  }) => {
    return (
        <DataItemRemoveModal
            itemId={item.id}
            dataModel={dataModel}
            viewerId={viewerId}
            dataParentId={dataParentId}
            setDataItems={setDataItems}
        />
    )
}




/**
 * DataItemRemoveModal
 */
const DataItemRemoveModal = ({ itemId, viewerId, dataParentId, dataModel, setDataItems }) => {
    const [open, setOpen] = useState(false);
    return (
        <Modal
            dimmer="inverted"
            closeIcon
            open={open}
            trigger={
                <Button content="Remove" icon="trash" labelPosition="left" color="red" />
            }
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Header icon="archive" content={`${dataModel.removalText}`} />
            <Modal.Content>
                <p>You are removing a {dataModel.itemToken} with id:{itemId}. Are you sure about this action?</p>
            </Modal.Content>
            <DataItemRemoveModalActions itemId={itemId} viewerId={viewerId} dataParentId={dataParentId} dataModel={dataModel} setDataItems={setDataItems} setOpen={setOpen}/>
        </Modal>
    );
};



/**
 * DataItemRemoveModalActions
 */
const DataItemRemoveModalActions = ({ itemId, viewerId, dataParentId, dataModel, setDataItems, setOpen }) => {
    return (
        <Modal.Actions>
            <Button
                color="green"
                onClick={() => {
                    setOpen(false);
                    removeDataItem({ itemId, viewerId, dataParentId, setDataItems, dataModel });
                }}
            >
                <Icon name="checkmark" /> Yes
            </Button>
            <Button color="red" onClick={() => setOpen(false)}>
                <Icon name="remove" /> No
            </Button>
        </Modal.Actions>
    )
}