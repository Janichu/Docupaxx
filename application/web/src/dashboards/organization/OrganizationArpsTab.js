import { useParams } from "react-router-dom";
import { AddArpTab, ARP_MODEL, ArpsTab, EditArpTab } from "../../common/dashboard/dataitem/arp/ArpsTab";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";

/**
 * ORGANIZATION_ARP_MODEL
 */
export const ORGANIZATION_ARP_MODEL = DataItemModel({
    ...ARP_MODEL,
    dashboardToken: "organizations",
    add: true,
    addText: "Add New Application Requirement Package",
    edit: true,
    editText: "Edit Package",
    download: false,
    downloadText: "Download Package",
    remove: true,
    removalText: "Remove Package",
    linked: true,
    childLinked: true
})



/**
 * OrganizationArpsTab
 */
export const OrganizationArpsTab = () => {
    const { id } = useParams()
    return (
        <ArpsTab
            viewerId={id}
            dataModel={ORGANIZATION_ARP_MODEL}
        />
    )
}



/**
 * OrganizationAddArpTab
 */
export const OrganizationAddArpTab = () => {
    const { id } = useParams();
    return (
        <AddArpTab
            viewerId={id}
            dataModel={ORGANIZATION_ARP_MODEL}
        />
    )
}



/**
 * OrganizationEditArpTab
 */
export const OrganizationEditArpTab = () => {
    const { id, arpId } = useParams()
    return (
        <EditArpTab
            viewerId={id}
            arpId={arpId}
            dataModel={ORGANIZATION_ARP_MODEL}
        />
    )
}
