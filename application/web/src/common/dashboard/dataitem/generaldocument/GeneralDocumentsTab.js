import { DataTab } from "../../DataTab";
import { DataItemAbsentContent } from "../DataItemAbsentContent";
import { DataItemButtonContent } from "../DataItemButtonContent";
import { DataItemModel } from "../DataItemModel";

/**
 * GENERAL_DOCUMENT_MODEL
 */
export const GENERAL_DOCUMENT_MODEL = DataItemModel({
    iconName: "file alternate",
    getTitle: (doc) => doc.name,
    getDescription: (doc) => doc.description
})



/**
 * GeneralDocumentsTab
 */
export const GeneralDocumentsTab = ({ dashboardToken, viewerId, dataParentId, dataModel }) => {
    return (
        <DataTab
            dashboardToken={dashboardToken}
            dataModel={dataModel}
            title={dataModel.title}
            iconName={dataModel.iconName}
            addDataItemText={dataModel.addText}
            viewerId={viewerId}
            dataParentId={dataParentId}
            getTitle={dataModel.getTitle}
            getDescription={dataModel.getDescription}
            filterDataItem={dataModel.filterDataItem}
            makeButtonContent={(item, setDataItems) => (
                <GeneralDocumentButtonContent item={item} viewerId={viewerId} dataParentId={dataParentId} dataModel={dataModel} setDataItems={setDataItems} />
            )}
            absentContent={(
                <GeneralDocumentAbsentContent viewerId={viewerId} dataParentId={dataParentId} dataModel={dataModel} />
            )}
        />
    )
}



/**
 * GeneralDocumentButtonContent
 */
const GeneralDocumentButtonContent = ({ item, viewerId, dataParentId, dataModel, setDataItems }) => {
    return (
        <DataItemButtonContent
            item={item}
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
            setDataItems={setDataItems}
        />
    )
}



/**
 * GeneralDocumentAbsentContent
 */
const GeneralDocumentAbsentContent = ({ viewerId, dataParentId, dataModel }) => {
    return (
        <DataItemAbsentContent
            dashboardToken
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
        />
    )
}