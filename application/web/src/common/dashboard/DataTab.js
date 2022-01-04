import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Divider, Form, Grid, Header, List, Search } from "semantic-ui-react";
import { DashboardTab } from "./DashboardTab";
import { DataItemAddButton } from "./dataitem/DataItemButtonContent";
import { loadDataItems } from "./DataTabInterface";

/**
 * DataTab
 */
export const DataTab = ({
  dataModel,
  viewerId,
  dataParentId,
  makeButtonContent,
  absentContent,
}) => {
  console.log("datamodel", dataModel);
  const [dataItems, setDataItems] = useState([]);
  const [query, setQuery] = useState("");
  const history = useHistory();
  const onSearchChange = useCallback((e, data) => setQuery(data.value), []);
  useEffect(() => {
    loadDataItems(setDataItems, dataModel, viewerId, dataParentId);
  }, [dataModel, dataParentId, viewerId]);

  const items = dataItems.filter((item) => {
    return item.name?.toLowerCase().match(new RegExp(`.*${query}.*`));
  });
  console.log(dataItems);

  return (
    <DashboardTab title={dataModel.title} iconName={dataModel.iconName}>
      <DataTabTopGrid
        onSearchChange={onSearchChange}
        dataItems={items}
        viewerId={viewerId}
        dataParentId={dataParentId}
        query={query}
        dataModel={dataModel}
        history={history}
      />
      <Divider />
      <DataTabDataList
        viewerId={viewerId}
        dataParentId={dataParentId}
        dataItems={dataItems}
        setDataItems={setDataItems}
        dataModel={dataModel}
        makeButtonContent={makeButtonContent}
        absentContent={absentContent}
        iconName={dataModel.iconName}
      />
    </DashboardTab>
  );
};

/**
 * DataAddModifyTab
 */
export const DataAddModifyTab = ({
  titleText,
  iconContent,
  onSave,
  children,
}) => {
  return (
    <Form onSubmit={onSave}>
      <Header as="h1">
        {iconContent}
        {titleText}
      </Header>
      {children}
    </Form>
  );
};

/**
 * DataTabTopGrid
 */
const DataTabTopGrid = ({
  onSearchChange,
  dataItems,
  dataModel,
  query,
  viewerId,
  dataParentId,
  history,
}) => {
  return (
    <Grid>
        {!dataModel.noSearch ? (
          <Grid.Row>
            <DataTabSearchColumn
              dataModel={dataModel}
              dataItems={dataItems}
              query={query}
              onSearchChange={onSearchChange}
              history={history}
              viewerId={viewerId}
            />
            {dataModel.add && (
            <DataTabAddContent
              dataModel={dataModel}
              viewerId={viewerId}
              dataParentId={dataParentId}
              placement={6}
            />
            )}
          </Grid.Row>
        ): (
          <Grid.Row>
            {dataModel.add && (
            <DataTabAddContent
              dataModel={dataModel}
              viewerId={viewerId}
              dataParentId={dataParentId}
            />
            )}
          </Grid.Row>
        )}
    </Grid>
  );
};

/**
 * DataTabDataList
 */
const DataTabDataList = ({
  viewerId,
  dataParentId,
  dataModel,
  dataItems,
  setDataItems,
  makeButtonContent,
  absentContent,
  iconName,
}) => {
  const absentItem = [{}];
  return (
    <List size="huge" divided relaxed>
      {dataItems.length > 0
        ? dataItems.map((item) => {
            const title = dataModel.getTitle(item);
            const description = dataModel.getDescription(item);
            const buttonContent = makeButtonContent(item, setDataItems);
            return (
              <List.Item key={item.id}>
                <List.Icon name={iconName} />
                <List.Content>
                  {buttonContent}
                  {dataModel.linked ? (
                    <Link to={getDataLink(viewerId, item.id, dataModel)}>
                      <List.Header>{title}</List.Header>
                    </Link>
                  ) : (
                    <List.Header>{title}</List.Header>
                  )}
                  <List.Description>{description}</List.Description>
                </List.Content>
              </List.Item>
            );
          })
        : absentItem.map(() => absentContent)}
    </List>
  );
};

/**
 * DataTabSearchColumn
 */
const DataTabSearchColumn = ({
  dataModel,
  dataItems,
  query,
  onSearchChange,
  history,
  viewerId,
}) => {
  const results = dataItems.map((item) => {
    if ("thumbnail" in item) {
      return { ...item, image: item.thumbnail, title: item.name };
    }
    return { ...item, title: item.name };
  });

  return (
    <Grid.Column width={10}>
      <Search
        size="big"
        fluid
        onSearchChange={onSearchChange}
        selectFirstResult
        onResultSelect={(e, { result }) => {
          if (dataModel.dataToken === "packages") {
            history.push(
              `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.dataToken}/${result.id}/edit`
            );
          }
          if (dataModel.dataToken === "organizations") {
            history.push(
              `/${dataModel.dataToken}/${result.id}/requirement-packages-page`
            );
          }
        }}
        results={results}
        value={query}
      />
    </Grid.Column>
  );
};

/**
 * DataTabAddContent
 */
const DataTabAddContent = ({ dataModel, viewerId, dataParentId, placement }) => {
  return (
    <Grid.Column width={(placement ? placement: 0)}>
      <DataItemAddButton
        dataModel={dataModel}
        viewerId={viewerId}
        dataParentId={dataParentId}
      />
    </Grid.Column>
  );
};

const getDataLink = (viewerId, itemId, dataModel) => {
  if (dataModel.childLinked) {
    return `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.childDataToken}/${itemId}`;
  }
  return `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.dataToken}/edit`;
};
