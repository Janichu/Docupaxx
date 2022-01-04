import JSZip from "jszip";
import { requestEncodedUrl, requestFileBase64 } from "../../util/fileUtils";
import { request } from "../../util/request";

/**
 * loadDataItems
 */
export const loadDataItems = (
  setDataItems,
  dataModel,
  viewerId,
  dataParentId
) => {
  const filterDataItemContent = dataModel.filterDataItemContent
    ? dataModel.filterDataItemContent
    : defaultFilterDataItemContent;
  const filterDataItems = dataModel.filterDataItems
    ? dataModel.filterDataItems
    : defaultFilterDataItems;
  const arrangeDataItems = dataModel.arrangeDataItems
    ? dataModel.arrangeDataItems
    : defaultArrangeDataItems;
  let fetchUrl = `/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}`;
  if (dataParentId) {
    fetchUrl = fetchUrl + "/" + dataParentId;
  }
  request(fetchUrl).then((dataItems) => {
    //alert(JSON.stringify(dataItems))
    console.log(dataItems, "dataitems");
    const contentFilteredDataItems = dataItems?.map((item) =>
      filterDataItemContent(item, viewerId)
    );
    const filteredDataItems = filterDataItems(
      contentFilteredDataItems,
      viewerId
    );
    const arrangedDataItems = arrangeDataItems(filteredDataItems, viewerId);
    setDataItems(arrangedDataItems);
  });
};

/**
 * approveDataItem
 */
export const approveDataItem = ({
  item,
  dataModel,
  viewerId,
  setDataItems,
}) => {
  console.log(JSON.stringify);
  request(
    `/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${item.id}`,
    {
      mock: false,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        is_approved: 1,
      }),
    }
  ).then(() => loadDataItems(setDataItems, dataModel, viewerId));
};

export const downloadDataItem = ({
  viewerId,
  dataParentId,
  dataModel,
  item,
}) => {
  if (dataModel.childDataToken) {
    downloadParentDataItem({ viewerId, dataParentId, dataModel, item });
    return;
  }
  downloadChildDataItem({ dataModel, item });
};

/**
 * removeDataItem
 */
export const removeDataItem = ({
  itemId,
  dataModel,
  viewerId,
  dataParentId,
  setDataItems,
}) => {
  let url = `/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${itemId}`;
  if (dataParentIdExists(dataParentId)) {
    url = `/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${dataParentId}/${itemId}`;
  }
  request(url, {
    method: "DELETE",
  }).then(() => loadDataItems(setDataItems, dataModel, viewerId, dataParentId));
};

export const dataParentIdExists = (dataParentId) => {
  return dataParentId && dataParentId != "new" && dataParentId != "edit";
};

const downloadParentDataItem = ({
  viewerId,
  dataParentId,
  dataModel,
  item,
}) => {
  // Will be optimized to later to be blob
  request(
    `/${dataModel.dashboardToken}/${viewerId}/${dataModel.childDataToken}/${item.id}`
  ).then((childrenDataItems) => {
    //alert("1L: " + childrenDataItems.length)
    const zip = new JSZip();
    const encodedPromises = [];
    for (let i = 0; i < childrenDataItems.length; i++) {
      const childDataItem = childrenDataItems[i];
      encodedPromises.push(requestFileBase64(childDataItem.url));
    }
    Promise.all(encodedPromises).then((fileDataList) => {
      //alert("2L: " + fileDataList.length)
      for (let i = 0; i < fileDataList.length; i++) {
        if (
          fileDataList[i].length == 0 ||
          fileDataList[i].includes("Encoding Failed")
        ) {
          continue;
        }
        zip.file(childrenDataItems[i].name + ".pdf", fileDataList[i], {
          base64: true,
        });
      }
      //alert("2E")
      zip
        .generateAsync({
          type: "base64",
          compression: "DEFLATE",
          compressionOptions: { level: 9 },
        })
        .then((content) => {
          //alert("3")
          const link = document.createElement("a");
          link.href = "data:application/zip;base64," + content;
          link.download = item.name;
          link.click();
        });
    });
  });
};

const downloadChildDataItem = ({ dataModel, item }) => {
  // Will be optimized later to be blob
  requestEncodedUrl(item.url).then((encodedUrl) => {
    const link = document.createElement("a");
    link.href = encodedUrl;
    link.download = item.name;
    //alert(item.name)
    link.click();
  });
};

/**
 * defaultFilterDataItemContent
 */
const defaultFilterDataItemContent = (item) => ({
  ...item,
});

/**
 * defaultFilterDataItems
 */
const defaultFilterDataItems = (items) => items;

/**
 * defaultArrangeDataItems
 */
const defaultArrangeDataItems = (items) => items;
