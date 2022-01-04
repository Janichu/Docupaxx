import { DataTab } from "../../DataTab";
import { DataItemAbsentContent } from "../DataItemAbsentContent";
import { DataItemButtonContent } from "../DataItemButtonContent";
import { DataItemModel } from "../DataItemModel";

/**
 * GENERAL_PACKAGE_MODEL
 */
export const GENERAL_PACKAGE_MODEL = DataItemModel({
  iconName: "folder",
  getTitle: (paxx) => paxx.name,
  getDescription: (paxx) => paxx.description,
});

/**
 * GeneralPackagesTab
 */
export const GeneralPackagesTab = ({ dashboardToken, viewerId, dataModel }) => {
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
        <GeneralPackageButtonContent
          item={item}
          viewerId={viewerId}
          dataModel={dataModel}
          setDataItems={setDataItems}
        />
      )}
      absentContent={
        <GeneralPackageAbsentContent
          viewerId={viewerId}
          dataModel={dataModel}
        />
      }
    />
  );
};

/**
 * GeneralPackageButtonContent
 */
const GeneralPackageButtonContent = ({
  item,
  viewerId,
  dataModel,
  setDataItems,
}) => {
  return (
    <DataItemButtonContent
      item={item}
      viewerId={viewerId}
      dataModel={dataModel}
      setDataItems={setDataItems}
    />
  );
};

/**
 * GeneralPackageAbsentContent
 */
const GeneralPackageAbsentContent = ({ viewerId, dataModel }) => {
  return (
    <DataItemAbsentContent
      dashboardToken
      viewerId={viewerId}
      dataModel={dataModel}
    />
  );
};
