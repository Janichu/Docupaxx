import { DataItemIconContent } from "../DataItemIconContent";
import { DataItemModel } from "../DataItemModel";
import { AddModifyGeneralDocumentTab, loadExistingDocument, loadNewDocument, saveExistingDocument, saveNewDocument } from "../generaldocument/AddModifyGeneralDocumentTab";
import { GENERAL_DOCUMENT_MODEL, GeneralDocumentsTab } from "../generaldocument/GeneralDocumentsTab";

/**
 * AR_MODEL
 */
export const AR_MODEL = DataItemModel({
    ...GENERAL_DOCUMENT_MODEL,
    title: "Application Requirements",
    section: "ars",
    dataToken: "ars",
    absentMessage: "You didn't add any application requirements yet. Do you want to add a requirement?"
})


export const ArsTab = ({ viewerId, dataParentId, dataModel }) => {
    return (
        <GeneralDocumentsTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
        />
    )
}



export const AddArTab = ({ viewerId, dataParentId, dataModel }) => {
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


export const EditArTab = ({ viewerId, dataParentId, documentId, dataModel }) => {
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
  