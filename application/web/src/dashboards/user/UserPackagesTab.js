import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { AddPackageTab, EditPackageTab, PACKAGE_MODEL, PackagesTab } from "../../common/dashboard/dataitem/package/PackagesTab";

/**
 * USER_PACKAGE_MODEL
 */
export const USER_PACKAGE_MODEL = DataItemModel({
    ...PACKAGE_MODEL,
    dashboardToken: "users",
    add: true,
    addText: "Add New Package",
    edit: true,
    editText: "Edit Package",
    download: true,
    downloadText: "Download Package",
    remove: true,
    removalText: "Remove Package",
    linked: true,
    childLinked: true
})



/**
 * UserPackagesTab
 */
export const UserPackagesTab = () => {
    const { id } = useParams()
    return (
        <PackagesTab
            viewerId={id}
            dataModel={USER_PACKAGE_MODEL}
        />
    )
}



/**
 * UserAddPackageTab
 */
export const UserAddPackageTab = () => {
    const { id } = useParams();
    return (
        <AddPackageTab
            viewerId={id}
            dataModel={USER_PACKAGE_MODEL}
        />
    )
}



/**
 * UserEditPackageTab
 */
export const UserEditPackageTab = () => {
    const { id, packageId } = useParams()
    return (
        <EditPackageTab
            viewerId={id}
            packageId={packageId}
            dataModel={USER_PACKAGE_MODEL}
        />
    )
}