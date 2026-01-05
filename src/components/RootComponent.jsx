import NavBarComponent from "./NavBarComponent";
import { Box } from "@mui/material";
import SideBarComponent from "./SideBarComponent";
import { Outlet } from "react-router-dom";

export default function RootComponent() {
  return (
    <>
      <NavBarComponent />
      <Box
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "stretch"
        }}
      >
        <Box sx={{ width: 190, flexShrink: 0 }}>
          <SideBarComponent />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
