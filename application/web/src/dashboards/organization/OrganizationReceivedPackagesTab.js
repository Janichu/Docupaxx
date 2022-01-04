import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { SENT_PACKAGE_MODEL } from "../../common/dashboard/dataitem/sentpackage/SentPackageModel";
import { SentPackagesTab } from "../../common/dashboard/dataitem/sentpackage/SentPackagesTab";

/**
 * ORGANIZATION_RECEIVED_PACKAGE_MODEL
 */
const ORGANIZATION_RECEIVED_PACKAGE_MODEL = DataItemModel({
    ...SENT_PACKAGE_MODEL,
    title: "Received Packages",
    dashboardToken: "organizations",
    childLinked: true,
    linked: true,
    download: true,
    downloadText: "Download"

})



/**
 * OrganizationReceivedPackagesTab
 */
export const OrganizationReceivedPackagesTab = () => {
    const { id } = useParams()
    return (
        <SentPackagesTab
            viewerId={id}
            dataModel={ORGANIZATION_RECEIVED_PACKAGE_MODEL}
        />
    )
}