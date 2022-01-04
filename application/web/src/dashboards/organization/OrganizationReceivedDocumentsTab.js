import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import {
  SENT_DOCUMENT_MODEL,
  SentDocumentTab,
} from "../../common/dashboard/dataitem/sentdocument/SentDocumentsTab";

/**
 * ORGANIZATION_RECEIVED_DOCUMENT_MODEL
 */
const ORGANIZATION_RECEIVED_DOCUMENT_MODEL = DataItemModel({
  ...SENT_DOCUMENT_MODEL,
  title: "Received Documents",
  dashboardToken: "organizations",
  download: true,
  downloadText: "Download",
});

/**
 * OrganizationReceivedDocumentsTab
 */
export const OrganizationReceivedDocumentsTab = () => {
  const { id, sentPackageId } = useParams();
  return (
    <SentDocumentTab
      viewerId={id}
      dataModel={ORGANIZATION_RECEIVED_DOCUMENT_MODEL}
      dataParentId={sentPackageId}
    />
  );
};
