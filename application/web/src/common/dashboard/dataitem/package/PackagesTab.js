import { DataItemIconContent } from "../DataItemIconContent";
import { DataItemModel } from "../DataItemModel";
import { AddModifyGeneralPackageTab, loadExistingPackage, loadNewPackage, saveExistingPackage, saveNewPackage } from "../generalpackage/AddModifyGeneralPackageTab";
import { GENERAL_PACKAGE_MODEL, GeneralPackagesTab } from "../generalpackage/GeneralPackagesTab";

/**
 * PACKAGE_MODEL
 */
export const PACKAGE_MODEL = DataItemModel({
    ...GENERAL_PACKAGE_MODEL,
    title: "Packages",
    section: "packages",
    dataToken: "packages",
    childDataToken: "documents",
    absentMessage: "You didn't add any packages yet. Do you want to add a package?",
})



/**
 * PackagesTab
 */
export const PackagesTab = ({ viewerId, dataModel }) => {
    return (
        <GeneralPackagesTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}



/**
 * AddPackageTab
 */
export const AddPackageTab = ({ viewerId, dataModel }) => {
    const packageId = -1
    return (
        <AddModifyGeneralPackageTab
            viewerId={viewerId}
            packageId={packageId}
            titleText={dataModel.addText}
            dataModel={dataModel}
            iconContent={<DataItemIconContent dataModel={dataModel} existing={false}/>}
            loadPackage={loadNewPackage}
            savePackage={saveNewPackage}
        />
  )
}



/**
 * EditPackageTab
 */
export const EditPackageTab = ({ viewerId, packageId, dataModel }) => {
    return (
      <AddModifyGeneralPackageTab
        viewerId={viewerId}
        packageId={packageId}
        titleText={dataModel.editText}
        dataModel={dataModel}
        iconContent={<DataItemIconContent dataModel={dataModel} existing={true}/>}
        loadPackage={loadExistingPackage}
        savePackage={saveExistingPackage}
      />
    )
  }
  