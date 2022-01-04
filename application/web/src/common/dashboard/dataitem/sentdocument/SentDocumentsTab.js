import { DataItemModel } from "../DataItemModel";
import { GENERAL_DOCUMENT_MODEL, GeneralDocumentsTab } from "../generaldocument/GeneralDocumentsTab";

/**
 * SENT_DOCUMENT_MODEL
 */
export const SENT_DOCUMENT_MODEL = DataItemModel({
    ...GENERAL_DOCUMENT_MODEL,
    title: "Sent Documents",
    section: "sentDocuments",
    dataToken: "sentDocuments",
    absentMessage: "You didn't receive any documents yet."
})



/**
 * SentDocumentsTab
 */
export const SentDocumentTab = ({ viewerId, dataParentId, dataModel }) => {
    return (
        <GeneralDocumentsTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
        />
    )
}


  