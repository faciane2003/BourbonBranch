import NavBarComponent from "./NavBarComponent";
import { Box, Drawer } from "@mui/material";
import SideBarComponent from "./SideBarComponent";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function RootComponent() {
  const [navCollapsed, setNavCollapsed] = useState(true);

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
