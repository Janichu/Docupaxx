import { DataItemIconContent } from "../DataItemIconContent";
import { DataItemModel } from "../DataItemModel";
import { AddModifyGeneralDocumentTab, loadExistingDocument, loadNewDocument, saveExistingDocument, saveNewDocument } from "../generaldocument/AddModifyGeneralDocumentTab";
import { GENERAL_DOCUMENT_MODEL, GeneralDocumentsTab } from "../generaldocument/GeneralDocumentsTab";

/**
 * DOCUMENT_MODEL
 */
export const DOCUMENT_MODEL = DataItemModel({
    ...GENERAL_DOCUMENT_MODEL,
    title: "Documents",
    section: "documents",
    dataToken: "documents",
    absentMessage: "You didn't add any documents yet. Do you want to add a document?"
})



/**
 * DocumentsTab
 */
export const DocumentsTab = ({ viewerId, dataParentId, dataModel }) => {
    return (
        <GeneralDocumentsTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
        />
    )
}



/**
 * AddDocumentTab
 */
export const AddDocumentTab = ({ viewerId, dataParentId, dataModel }) => {
    const documentId = -1
    return (
        <AddModifyGeneralDocumentTab
            viewerId={viewerId}
            dataParentId={dataParentId}
            documentId={documentId}
            titleText={dataModel.addText}
            dataModel={dataModel}
            iconContent={<DataItemIconContent dataModel={dataModel} existing={false}/>}
            loadDocument={loadNewDocument}
            saveDocument={saveNewDocument}
        />
  )
}



/**
 * EditDocumentTab
 */
export const EditDocumentTab = ({ viewerId, dataParentId, documentId, dataModel }) => {
    return (
      <AddModifyGeneralDocumentTab
        viewerId={viewerId}
        dataParentId={dataParentId}
        documentId={documentId}
        titleText={dataModel.editText}
        dataModel={dataModel}
        iconContent={<DataItemIconContent dataModel={dataModel} existing={true}/>}
        loadDocument={loadExistingDocument}
        saveDocument={saveExistingDocument}
      />
    )
  }
  