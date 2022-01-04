import { filter } from "jszip";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Button,
  Dropdown,
  Header,
  Image,
  Modal,
  Search,
} from "semantic-ui-react";
import { requestEncodedUrl } from "../../util/fileUtils";
import { request } from "../../util/request";

/**
 * OrganizationSearchContainer
 */
export const OrganizationSearchContainer = ({
  header,
  showFilter = true,
  size,
}) => {
  // Search query
  const [query, setQuery] = useState("");
  // Results
  const [organizations, setOrganizations] = useState([]);
  // Filter type for organizations (e.g School, Bank, Department)
  const [filterType, setFilterType] = useState("all");
  // Loading for search bar
  const [loading, setLoading] = useState(false);
  // Opening and closing modal when a search result is displayed
  const [openModal, setOpenModal] = useState(false);
  // Organization result after searching
  const [selectedOrganization, setSelectedOrganization] = useState({});
  // History
  const history = useHistory();
  // Searches for organizations after receiving an update in the query
  useEffect(() => {
    searchOrganizations(query, filterType, setOrganizations, setLoading);
  }, [query, filterType]);
  // Sets the query if the search bar has been altered
  const onSearchChange = useCallback((e, data) => {
    setQuery(data.value);
  }, []);
  // Outputs the search fields

  return (
    <>
      {/* <label style={{ position: "relative", bottom: "5px", left: "10px" }}>
        Search for an Organization &nbsp;&nbsp;
      </label> */}
      {header}
      {showFilter && (
        <HomeOrganizationSearchFilter
          filterType={filterType}
          setFilterType={setFilterType}
        />
      )}
      <HomeOrganizationSearchBar
        size={size}
        loading={loading}
        onSearchChange={onSearchChange}
        query={query}
        organizations={organizations}
        setSelectedOrganization={setSelectedOrganization}
        setOpenModal={setOpenModal}
        history={history}
      />
      <HomeOrganizationSearchResultModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedOrganization={selectedOrganization}
      />
    </>
  );
};

/**
 * HomeOrganizationSearchBar
 */
const HomeOrganizationSearchBar = ({
  loading,
  onSearchChange,
  history,
  organizations,
  query,
  setSelectedOrganization,
  size,
  setOpenModal,
}) => {
  /* Search bar for organizations */
  return (
    <Search
      loading={loading}
      size={size}
      placeholder={"Search for Organizations"}
      fluid
      onSearchChange={onSearchChange}
      selectFirstResult
      onResultSelect={(e, { result }) => {
        setSelectedOrganization(result);
        // setOpenModal(true);
        history.push(`/organizations/${result.id}/requirement-packages-page`);
      }}
      results={organizations}
      value={query}
    />
  );
};

/**
 * HomeOrganizationSearchFilter
 */
const HomeOrganizationSearchFilter = ({ filterType, setFilterType }) => {
  // Search options for filtering organizations by type
  const searchOptions = [
    { key: "insurance", text: "Insurance", value: "insurance" },
    { key: "government", text: "Government", value: "government" },
    { key: "bank", text: "Bank", value: "bank" },
    { key: "school", text: "School", value: "school" },
  ];
  /* Filter menu for organizations */
  return (
    <Dropdown
      basic
      placeholder="Filter Organizations"
      options={searchOptions}
      style={{ padding: "10px" }}
      value={filterType}
      onChange={(e, { value }) => setFilterType(value)}
    />
  );
};

/**
 * HomeOrganizationSearchResultModal
 */
const HomeOrganizationSearchResultModal = ({
  openModal,
  setOpenModal,
  selectedOrganization,
}) => {
  /* Modal for search result */
  return (
    <>
      {selectedOrganization && (
        <Modal
          onClose={() => setOpenModal(false)}
          onOpen={() => setOpenModal(true)}
          open={openModal}
        >
          <Modal.Header>Show an organization</Modal.Header>
          <HomeOrganizationSearchResultModalContent
            selectedOrganization={selectedOrganization}
          />
          <Modal.Actions>
            <Button color="black" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};

/**
 * HomeOrganizationSearchResultModalContent
 */
const HomeOrganizationSearchResultModalContent = ({ selectedOrganization }) => {
  return (
    <Modal.Content image>
      <Image size="medium" src={selectedOrganization.image} wrapped />
      <Modal.Description>
        <Header>{selectedOrganization.title}</Header>
        <p>Address: {selectedOrganization.description}</p>
      </Modal.Description>
    </Modal.Content>
  );
};

/**
 * searchOrganizations
 */
const searchOrganizations = (
  query,
  filterType,
  setOrganizations,
  setLoading
) => {
  // Does not search if the query is empty
  if (!query || query.length < 1) {
    setLoading(false);
    return;
  }
  // Builds a query for request urls
  const fetchQuery = buildFetchQuery(query, filterType);
  // Search and display organizations
  setLoading(true);
  request(fetchQuery).then((organizations) => {
    const filteredOrganizations = organizations.slice(0, 10)
      .filter((org) => {
        return org.name?.toLowerCase().match(new RegExp(`.*${query}.*`));
      })
      .map((organization) => {
        return {
          title: organization.name,
          image: organization.thumbnail,
          id: organization.id,
        };
      });

    if (!organizations.map) {
      setOrganizations([]);
      setLoading(false);
      return;
    }

    const encodingPromises = []
    for (let i = 0; i < filteredOrganizations.length; i++) {
      const org = filteredOrganizations[i]
      encodingPromises.push(requestEncodedUrl(org.image))
    }
    Promise.all(encodingPromises)
      .then((encodedPromiseUrls) => {
        //alert(JSON.stringify(encodedPromiseUrls))
        for (let i = 0; i < filteredOrganizations.length; i++) {
          filteredOrganizations[i].image = encodedPromiseUrls[i]
        }
        setOrganizations(
          // This steps are required for search component to show search results beatifully
          filteredOrganizations
        );
      })
    setLoading(false);
  });
};

/**
 * buildFetchQuery
 */
const buildFetchQuery = (query, filterType) => {
  // Builds a partial query for request url
  const partialUrlQuery = query.split(" ").join("+");
  // Search organizations by filtering by organization types
  return `/organizations/search?type=${filterType}`;
};
