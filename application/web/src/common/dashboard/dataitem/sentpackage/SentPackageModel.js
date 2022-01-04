import { DataItemModel } from "../DataItemModel";
import { GENERAL_PACKAGE_MODEL } from "../generalpackage/GeneralPackagesTab";

/**
 * SENT_PACKAGE_MODEL
 */
export const SENT_PACKAGE_MODEL = DataItemModel({
    ...GENERAL_PACKAGE_MODEL,
    title: "Sent Packages",
    section: "sentPackages",
    dataToken: "sentPackages",
    childDataToken: "sentDocuments",
    absentMessage: "You do not have any sent packages yet.",
    getDescription: (paxx) => paxx.name
})