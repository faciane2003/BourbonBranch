import "../../public/styles/links.css";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  AccessTimeOutlined,
  CalendarMonthOutlined,
  CallOutlined,
  DeliveryDiningOutlined,
  EventOutlined,
  ExpandLess,
  ExpandMore,
  GroupsOutlined,
  HomeOutlined,
  LocalBarOutlined,
  LanguageOutlined,
  LocalOfferOutlined,
  CelebrationOutlined,
  RestaurantMenuOutlined,
  EditOutlined,
  FitnessCenterOutlined
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function SideBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const navItems = useMemo(
    () => [
      {
        title: "Items",
        component: <LocalBarOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/inventory"
      },
      {
        title: "Schedule",
        component: <AccessTimeOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/schedule"
      },
      {
        title: "Parties",
        component: <CelebrationOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/parties"
      },
      {
        title: "Notes",
        component: <EditOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/notes"
      },
      {
        title: "Tasks",
        component: <FitnessCenterOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/tasks"
      },
      {
        title: "Team",
        component: <GroupsOutlined sx={{ fontSize: 16 }} color="primary" />,
        path: "/team"
      }
    ],
    []
  );

  const websiteItems = useMemo(
    () => [
      {
        title: "Home",
        component: <HomeOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "/home"
      },
      {
        title: "Menus",
        component: <RestaurantMenuOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "/menus"
      },
      {
        title: "Events",
        component: <EventOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "/events"
      },
      {
        title: "Specials",
        component: <LocalOfferOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "/specials"
      },
      {
        title: "Reservations",
        component: <CalendarMonthOutlined sx={{ fontSize: 14 }} color="primary" />,
        path:
          "https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime",
        external: true
      },
      {
        title: "Takeout",
        component: <DeliveryDiningOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "https://www.toasttab.com/bourbon-branch-705-n-2nd-st",
        external: true
      },
      {
        title: "Contact",
        component: <CallOutlined sx={{ fontSize: 14 }} color="primary" />,
        path: "/contact"
      }
    ],
    []
  );

  const activeIndex = navItems.findIndex((item) => item.path === currentPage);
  const websiteActive = websiteItems.some(
    (item) => !item.external && item.path === currentPage
  );
  const [websiteOpen, setWebsiteOpen] = useState(websiteActive);

  return (
    <>
      <Box
        sx={{
          bgcolor: "rgb(15, 11, 10)",
          border: "1px solid rgba(230, 209, 153, 0.25)",
          borderRadius: "240px / 64px",
          mx: 0,
          my: 2,
          p: "25px 0",
          pl: 1,
          boxShadow: "inset 0 0 24px rgba(0, 0, 0, 0.4)"
        }}
      >
        <List sx={{ p: 0, m: 0 }}>
          {navItems.map((comp, index) => (
            <ListItem disablePadding dense={true} key={comp.title}>
              <Box width="100%">
                <ListItemButton
                  onClick={() => {
                    navigate(comp.path);
                  }}
                  selected={index === activeIndex && currentPage === comp.path}
                  sx={{
                    mb: 3,
                    borderLeft: 0,
                    borderColor: "primary.main",
                    ml: 0,
                    borderRadius: 4,
                    pl: 1,
                    py: 0,
                    minHeight: 24,
                    height: 24,
                    justifyContent: "center",
                    gap: 1
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                    <IconButton sx={{ p: 0, ml: 0 }}>
                      {comp.component}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={comp.title}
                    primaryTypographyProps={{
                      fontSize: "0.7rem",
                      fontWeight: activeIndex === index ? "bold" : "",
                      color: activeIndex === index ? "primary.main" : "inherit",
                      textAlign: "center"
                    }}
                    sx={{ textAlign: "center" }}
                  />
                </ListItemButton>
              </Box>
            </ListItem>
          ))}
        </List>
        <List sx={{ p: 0, m: 0, mt: 0 }}>
          <ListItem disablePadding dense={true}>
            <Box width="100%">
              <ListItemButton
                onClick={() => setWebsiteOpen((prev) => !prev)}
                selected={websiteActive}
                sx={{
                  mb: 2,
                  borderLeft: 0,
                  borderColor: "primary.main",
                  ml: 0,
                  borderRadius: 4,
                  pl: 1,
                  py: 0,
                  minHeight: 24,
                  height: 24,
                  justifyContent: "center",
                  gap: 1
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                  <IconButton sx={{ p: 0, ml: 0 }}>
                    <LanguageOutlined sx={{ fontSize: 16 }} color="primary" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary="Website"
                  primaryTypographyProps={{
                    fontSize: "0.7rem",
                    fontWeight: websiteActive ? "bold" : "",
                    color: websiteActive ? "primary.main" : "inherit",
                    textAlign: "center"
                  }}
                  sx={{ textAlign: "center" }}
                />
                {websiteOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Box>
          </ListItem>
          <Collapse in={websiteOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {websiteItems.map((comp) => (
                <ListItem disablePadding dense={true} key={comp.title}>
                  <Box width="100%">
                    <ListItemButton
                      onClick={() => {
                        if (comp.external) {
                          window.open(comp.path, "_blank", "noreferrer");
                          return;
                        }
                        navigate(comp.path);
                      }}
                      selected={currentPage === comp.path}
                      sx={{
                        mb: 1,
                        borderLeft: 0,
                        borderColor: "primary.main",
                        ml: 0,
                        borderRadius: 4,
                        pl: 1,
                        py: 0,
                        minHeight: 22,
                        height: 22,
                        justifyContent: "center",
                        gap: 1
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
                        <IconButton sx={{ p: 0, ml: 0 }}>
                          {comp.component}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={comp.title}
                        primaryTypographyProps={{
                          fontSize: "0.6rem",
                          fontWeight: currentPage === comp.path ? "bold" : "",
                          color:
                            currentPage === comp.path
                              ? "primary.main"
                              : "inherit",
                          textAlign: "center"
                        }}
                        sx={{ textAlign: "center" }}
                      />
                    </ListItemButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </>
  );
}
