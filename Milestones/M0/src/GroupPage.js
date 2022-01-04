import React from "react";
import { GroupGrid } from "./GroupGrid";
import { Navbar } from "./Navbar";

export const GroupPage = () => {
  return (
    <div>
      <Navbar activeItem="team" />
      <GroupGrid />
    </div>
  );
};
