import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AddArTab, AR_MODEL, ArsTab, EditArTab } from "../../common/dashboard/dataitem/ar/ArsTab";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { UserAddDocumentTab, UserDocumentsTab, UserEditDocumentTab } from "../user/UserDocumentsTab";


/**
 * ORGANIZATION_AR_MODEL
 */
export const ORGANIZATION_AR_MODEL = DataItemModel({
    ...AR_MODEL,
    dashboardToken: "organizations",
    add: true,
    addText: "Add New Application Requirement",
    edit: true,
    editText: "Edit Application Requirement",
    remove: true,
    removalText: "Remove Application Requirement",
    filtered:true,
    upload: false,
})


/**
 * UserDocumentsTab
 */
export const OrganizationArsTab = () => {
    const [dataModel, setDataModel] = useState(ORGANIZATION_AR_MODEL)
    const [firstLoad, setFirstLoad] = useState(true)
    const { id, arpId } = useParams()
    // useEffect(() => loadPackage(id, packageId, firstLoad, setFirstLoad, setDataModel))
    return (
        <ArsTab
            viewerId={id}
            dataParentId={arpId}
            dataModel={dataModel}
        />
    )
}



/**
 * UserAddDocumentTab
 */
export const OrganizationAddArTab = () => {
    const { id, arpId } = useParams();
    return (
        <AddArTab
            viewerId={id}
            dataParentId={arpId}
            dataModel={ORGANIZATION_AR_MODEL}
        />
    )
}



/**
 * UserEditDocumentTab
 */
export const OrganizationEditArTab = () => {
    const { id, arpId, arId } = useParams()
    return (
        <EditArTab
            viewerId={id}
            dataParentId={arpId}
            documentId={arId}
            dataModel={ORGANIZATION_AR_MODEL}
        />
    )
}