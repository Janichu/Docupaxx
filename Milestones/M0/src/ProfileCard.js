import React from "react";
import PropTypes from "prop-types";
import { Card, Image } from "semantic-ui-react";

ProfileCard.propTypes = {
  name: PropTypes.string,
  profileImage: PropTypes.string,
  role: PropTypes.string,
  description: PropTypes.string,
};

const divStyle = {
  marginTop: 10,
  height: 480,
};

const imgStyle = {
  width: "100%",
  height: 382,
};

export default function ProfileCard({ name, profileImage, role, description }) {
  return (
    <Card style={divStyle} link>
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={profileImage} alt="Profile" style={imgStyle} />
      </div>
      <Card.Content>
        <Card.Header>{name}</Card.Header>
        <Card.Description>
          <span className="date">{role}</span>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}
