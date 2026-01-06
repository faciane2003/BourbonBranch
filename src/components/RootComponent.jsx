import NavBarComponent from "./NavBarComponent";
import { Box, Drawer } from "@mui/material";
import SideBarComponent from "./SideBarComponent";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHealth } from "../api/api";

export default function RootComponent() {
  const [navCollapsed, setNavCollapsed] = useState(true);

  useEffect(() => {
    const pingHealth = () => {
      fetchHealth().catch((error) => {
        console.warn("Health ping failed:", error);
      });
    };
    pingHealth();
    const intervalId = setInterval(pingHealth, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <NavBarComponent onToggleNav={() => setNavCollapsed((prev) => !prev)} />
      <Box
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "stretch",
          pt: "64px"
        }}
      >
        <Drawer
          anchor="left"
          open={!navCollapsed}
          onClose={() => setNavCollapsed(true)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: "fit-content",
              bgcolor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              mt: "64px"
            }
          }}
        >
          <SideBarComponent />
        </Drawer>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
