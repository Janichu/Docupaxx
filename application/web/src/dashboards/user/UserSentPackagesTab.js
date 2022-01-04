import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { SendPackageTab } from "../../common/dashboard/dataitem/sentpackage/SendPackageTab";
import { SENT_PACKAGE_MODEL } from "../../common/dashboard/dataitem/sentpackage/SentPackageModel";
import { SentPackagesTab } from "../../common/dashboard/dataitem/sentpackage/SentPackagesTab";

/**
 * USER_SENT_PACKAGE_MODEL
 */
const USER_SENT_PACKAGE_MODEL = DataItemModel({
    ...SENT_PACKAGE_MODEL,
    dashboardToken: "users",
    add: true,
    addText: "Send a Package",
})



/**
 * UserSentPackagesTab
 */
export const UserSentPackagesTab = () => {
    const { id } = useParams()
    return (
        <SentPackagesTab
            viewerId={id}
            dataModel={USER_SENT_PACKAGE_MODEL}
        />
    )
}



/**
 * UserSendPackageTab
 */
export const UserSendPackageTab = () => {
    const { id } = useParams()
    return (
        <SendPackageTab
            viewerId={id}
            dataModel={USER_SENT_PACKAGE_MODEL}
        />
    )
}