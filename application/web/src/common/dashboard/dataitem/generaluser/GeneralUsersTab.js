import { DataTab } from "../../DataTab";
import { DataItemAbsentContent } from "../DataItemAbsentContent";
import { DataItemButtonContent } from "../DataItemButtonContent";
import { DataItemModel } from "../DataItemModel";

/**
 * GENERAL_USER_MODEL
 */
export const GENERAL_USER_MODEL = DataItemModel({
    iconName: "user",
    getTitle: (user) => user.name,
    getDescription: (user) => user.email
})



/**
 * GeneralUsersTab
 */
export const GeneralUsersTab = ({ dashboardToken, viewerId, dataModel }) => {
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
                <GeneralUserButtonContent item={item} viewerId={viewerId} dataModel={dataModel} setDataItems={setDataItems} />
            )}
            absentContent={(
                <GeneralUserAbsentContent viewerId={viewerId} dataModel={dataModel} />
            )}
        />
    )
}



/**
 * GeneralUserButtonContent
 */
const GeneralUserButtonContent = ({ item, viewerId, dataModel, setDataItems }) => {
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
 * GeneralUserAbsentContent
 */
const GeneralUserAbsentContent = ({ viewerId, dataModel }) => {
    return (
        <DataItemAbsentContent
            dashboardToken
            viewerId={viewerId}
            dataModel={dataModel}
        />
    )
}