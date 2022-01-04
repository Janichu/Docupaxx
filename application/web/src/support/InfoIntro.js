import { Divider, Header } from "semantic-ui-react";

/**
 * InfoIntro
 */
export const InfoIntro = ({ title, description }) => {
  return (
    <div style={{ paddingLeft: "50px", paddingTop: "35px" }}>
      <Header as="h1" style={{ fontSize: "2em" }}>
        {title}
      </Header>
      <p>{description}</p>
      <Divider />
    </div>
  );
};
