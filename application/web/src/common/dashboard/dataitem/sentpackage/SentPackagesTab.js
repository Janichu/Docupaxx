import { GeneralPackagesTab } from "../generalpackage/GeneralPackagesTab";

/**
 * SentPackagesTab
 */
export const SentPackagesTab = ({ viewerId, dataModel }) => {
    return (
        <GeneralPackagesTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}


