import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { AddDocumentTab, DOCUMENT_MODEL, DocumentsTab, EditDocumentTab } from "../../common/dashboard/dataitem/document/DocumentsTab";
import { request } from "../../util/request";

const loadPackage = (viewerId, packageId, firstLoad, setFirstLoad, setDataModel) => {
    if (!packageId || !firstLoad) {
        return
    }
    request(`/users/${viewerId}/packages/${packageId}`)
        .then((pkg) => {
            setDataModel({
                ...USER_DOCUMENT_MODEL,
                title: pkg.name,
                filterId: packageId
            })
            setFirstLoad(false)
        }).catch((error) =>{
            alert("error");
        })
}


/**
 * USER_DOCUMENT_MODEL
 */
export const USER_DOCUMENT_MODEL = DataItemModel({
    ...DOCUMENT_MODEL,
    dashboardToken: "users",
    add: true,
    addText: "Add New Document",
    edit: true,
    editText: "Edit Document",
    download: true,
    downloadText: "Download Document",
    remove: true,
    removalText: "Remove Document",
    upload: true,
    filtered:true,
})


/**
 * UserDocumentsTab
 */
export const UserDocumentsTab = () => {
    const [dataModel, setDataModel] = useState(USER_DOCUMENT_MODEL)
    const [firstLoad, setFirstLoad] = useState(true)
    const { id, packageId } = useParams()
    // useEffect(() => loadPackage(id, packageId, firstLoad, setFirstLoad, setDataModel))
    return (
        <DocumentsTab
            viewerId={id}
            dataParentId={packageId}
            dataModel={dataModel}
        />
    )
}



/**
 * UserAddDocumentTab
 */
export const UserAddDocumentTab = () => {
    const { id, packageId } = useParams();
    return (
        <AddDocumentTab
            viewerId={id}
            dataParentId={packageId}
            dataModel={USER_DOCUMENT_MODEL}
        />
    )
}



/**
 * UserEditDocumentTab
 */
export const UserEditDocumentTab = () => {
    const { id, packageId, documentId } = useParams()
    return (
        <EditDocumentTab
            viewerId={id}
            dataParentId={packageId}
            documentId={documentId}
            dataModel={USER_DOCUMENT_MODEL}
        />
    )
}