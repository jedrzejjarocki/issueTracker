import React, {useState} from "react";
import NavDrawer from "./NavDrawer";
import MainContainer from "./MainContainer";
import TopBar from "./TopBar";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div style={{ display: "flex" }}>
      <TopBar handleDrawerToggle={handleDrawerToggle} />
      <NavDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <MainContainer />
    </div>
  );
};

export default Dashboard;
