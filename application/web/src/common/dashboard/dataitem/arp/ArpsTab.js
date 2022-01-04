import { DataItemIconContent } from "../DataItemIconContent";
import { DataItemModel } from "../DataItemModel";
import { AddModifyGeneralPackageTab, loadExistingPackage, loadNewPackage, saveExistingPackage, saveNewPackage } from "../generalpackage/AddModifyGeneralPackageTab";
import { GENERAL_PACKAGE_MODEL, GeneralPackagesTab } from "../generalpackage/GeneralPackagesTab";

/**
 * ARP_MODEL
 */
export const ARP_MODEL = DataItemModel({
    ...GENERAL_PACKAGE_MODEL,
    title: "Application Requirement Packages",
    section: "arps",
    dataToken: "arps",
    childDataToken: "ars",
    absentMessage: "You didn't add any Application Requirement Packages yet.",
})



/**
 * ArpsTab
 */
export const ArpsTab = ({ viewerId, dataModel }) => {
    return (
        <GeneralPackagesTab
            dashboardToken={dataModel.dashboardToken}
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}



/**
 * AddArpTab
 */
export const AddArpTab = ({ viewerId, dataModel }) => {
    const arpId = -1
    return (
        <AddModifyGeneralPackageTab
            viewerId={viewerId}
            arpId={arpId}
            titleText={dataModel.addText}
            dataModel={dataModel}
            iconContent={<DataItemIconContent dataModel={dataModel} existing={false}/>}
            loadPackage={loadNewPackage}
            savePackage={saveNewPackage}
        />
  )
}



/**
 * EditArpTab
 */
export const EditArpTab = ({ viewerId, arpId, dataModel }) => {
    return (
      <AddModifyGeneralPackageTab
        viewerId={viewerId}
        packageId={arpId}
        titleText={dataModel.editText}
        dataModel={dataModel}
        iconContent={<DataItemIconContent dataModel={dataModel} existing={true}/>}
        loadPackage={loadExistingPackage}
        savePackage={saveExistingPackage}
      />
    )
  }
  