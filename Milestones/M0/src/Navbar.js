import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const Navbar = ({ activeItem }) => {
  return (
    <Menu stackable style={{ marginBottom: "2rem" }}>
      <Menu.Item>
        <p>Team 7</p>
      </Menu.Item>

      <Menu.Item name="team" active={activeItem === "team"}>
        <Link to="/team">Team</Link>
      </Menu.Item>
    </Menu>
  );
};
