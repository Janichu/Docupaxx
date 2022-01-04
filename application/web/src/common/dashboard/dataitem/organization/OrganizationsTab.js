import { DataTab } from "../../DataTab";
import { DataItemAbsentContent } from "../DataItemAbsentContent";
import { DataItemButtonContent } from "../DataItemButtonContent";
import { DataItemModel } from "../DataItemModel";

/**
 * ORGANIZATION_MODEL
 */
export const ORGANIZATION_MODEL = DataItemModel({
    title: "Organizations",
    section: "organizations",
    dataToken: "organizations",
    iconName: "building outline",
    absentMessage: "No organizations exist yet",
    getTitle: (organization) => organization.name,
    getDescription: (organization) => organization.name
})



/**
 * OrganizationsTab
 */
export const OrganizationsTab = ({ dashboardToken, viewerId, dataModel }) => {
    return (
        <DataTab
            dashboardToken={dashboardToken}
            dataModel={dataModel}
            title={dataModel.title}
            iconName={dataModel.iconName}
            addDataItemText={dataModel.addText}
            viewerId={viewerId}
            getTitle={dataModel.getTitle}
            getDescription={dataModel.getDescription}
            filterDataItem={dataModel.filterDataItem}
            makeButtonContent={(item, setDataItems) => (
                <OrganizationButtonContent item={item} viewerId={viewerId} dataModel={dataModel} setDataItems={setDataItems} />
            )}
            absentContent={(
                <OrganizationAbsentContent viewerId={viewerId} dataModel={dataModel} />
            )}
        />
    )
}



/**
 * OrganizationButtonContent
 */
const OrganizationButtonContent = ({ item, viewerId, dataModel, setDataItems }) => {
    return (
        <DataItemButtonContent
            item={item}
            viewerId={viewerId}
            dataModel={dataModel}
            setDataItems={setDataItems}
        />
    )
}



/**
 * OrganizationAbsentContent
 */
const OrganizationAbsentContent = ({ viewerId, dataModel }) => {
    return (
        <DataItemAbsentContent
            dashboardToken
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}