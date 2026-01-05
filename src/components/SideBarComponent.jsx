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
  StarOutlined,
  AccessTimeOutlined,
  CalendarMonthOutlined,
  CallOutlined,
  DeliveryDiningOutlined,
  DescriptionOutlined,
  EventOutlined,
  ExpandLess,
  ExpandMore,
  GroupsOutlined,
  HomeOutlined,
  LocalBarOutlined,
  LanguageOutlined,
  LocalOfferOutlined,
  MonetizationOnOutlined,
  CelebrationOutlined,
  PeopleAltOutlined,
  RestaurantMenuOutlined,
  SettingsOutlined,
  EditOutlined,
  TrendingUpOutlined
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function SideBarComponent({ onSelect }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const navItems = useMemo(
    () => [
      {
        title: "Items",
        component: <LocalBarOutlined fontSize="medium" color="primary" />,
        path: "/inventory"
      },
      {
        title: "Schedule",
        component: <AccessTimeOutlined fontSize="medium" color="primary" />,
        path: "/schedule"
      },
      {
        title: "Parties",
        component: <CelebrationOutlined fontSize="medium" color="primary" />,
        path: "/parties"
      },
      {
        title: "Notes",
        component: <EditOutlined fontSize="medium" color="primary" />,
        path: "/notes"
      },
      {
        title: "Team",
        component: <GroupsOutlined fontSize="medium" color="primary" />,
        path: "/team"
      },
      {
        title: "Settings",
        component: <SettingsOutlined fontSize="medium" color="primary" />,
        path: "/settings"
      }
    ],
    []
  );

  const adminItems = useMemo(
    () => [
      {
        title: "Orders",
        component: <PeopleAltOutlined fontSize="medium" color="primary" />,
        path: "/orders"
      },
      {
        title: "Revenue",
        component: <MonetizationOnOutlined fontSize="medium" color="primary" />,
        path: "/revenue"
      },
      {
        title: "Growth",
        component: <TrendingUpOutlined fontSize="medium" color="primary" />,
        path: "/growth"
      },
      {
        title: "Reports",
        component: <DescriptionOutlined fontSize="medium" color="primary" />,
        path: "/reports"
      }
    ],
    []
  );

  const websiteItems = useMemo(
    () => [
      {
        title: "Home",
        component: <HomeOutlined fontSize="small" color="primary" />,
        path: "/home"
      },
      {
        title: "Menus",
        component: <RestaurantMenuOutlined fontSize="small" color="primary" />,
        path: "/menus"
      },
      {
        title: "Events",
        component: <EventOutlined fontSize="small" color="primary" />,
        path: "/events"
      },
      {
        title: "Specials",
        component: <LocalOfferOutlined fontSize="small" color="primary" />,
        path: "/specials"
      },
      {
        title: "Reservations",
        component: <CalendarMonthOutlined fontSize="small" color="primary" />,
        path:
          "https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime",
        external: true
      },
      {
        title: "Takeout",
        component: <DeliveryDiningOutlined fontSize="small" color="primary" />,
        path: "https://www.toasttab.com/bourbon-branch-705-n-2nd-st",
        external: true
      },
      {
        title: "Contact",
        component: <CallOutlined fontSize="small" color="primary" />,
        path: "/contact"
      }
    ],
    []
  );

  const activeIndex = navItems.findIndex((item) => item.path === currentPage);
  const adminActive = adminItems.some(
    (item) => item.path === currentPage
  );
  const websiteActive = websiteItems.some(
    (item) => !item.external && item.path === currentPage
  );
  const [adminOpen, setAdminOpen] = useState(adminActive);
  const [websiteOpen, setWebsiteOpen] = useState(websiteActive);

  return (
    <>
      <Box
        sx={{
          bgcolor: "rgba(15, 11, 10, 0.75)",
          border: "1px solid rgba(230, 209, 153, 0.25)",
          borderRadius: "240px / 64px",
          mx: 0,
          my: 2,
          p: 0,
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
                    onSelect?.();
                  }}
                  selected={index === activeIndex && currentPage === comp.path}
                  sx={{
                    mb: 3,
                    borderLeft: 0,
                    borderColor: "primary.main",
                    ml: 0,
                    borderRadius: 4,
                    pl: 0,
                    py: 0,
                    minHeight: 24,
                    height: 24,
                    justifyContent: "flex-start"
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 16, mr: 0 }}>
                    <IconButton sx={{ p: 0, ml: 0 }}>
                      {comp.component}
                    </IconButton>
                  </ListItemIcon>
                  <ListItemText
                    primary={comp.title}
                    primaryTypographyProps={{
                      fontSize: "medium",
                      fontWeight: activeIndex === index ? "bold" : "",
                      color: activeIndex === index ? "primary.main" : "inherit",
                      textAlign: "left"
                    }}
                    sx={{ textAlign: "left" }}
                  />
                </ListItemButton>
              </Box>
            </ListItem>
          ))}
          <ListItem disablePadding dense={true}>
            <Box width="100%">
              <ListItemButton
                onClick={() => setAdminOpen((prev) => !prev)}
                selected={adminActive}
                sx={{
                  mb: 3,
                  borderLeft: 0,
                  borderColor: "primary.main",
                  ml: 0,
                  borderRadius: 4,
                    pl: 0,
                  py: 0,
                  minHeight: 24,
                  height: 24,
                  justifyContent: "flex-start"
                }}
              >
                <ListItemIcon sx={{ minWidth: 16, mr: 0 }}>
                  <IconButton sx={{ p: 0, ml: 0 }}>
                    <StarOutlined fontSize="medium" color="primary" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary="Admin"
                  primaryTypographyProps={{
                    fontSize: "medium",
                    fontWeight: adminActive ? "bold" : "",
                    color: adminActive ? "primary.main" : "inherit",
                    textAlign: "left"
                  }}
                  sx={{ textAlign: "left" }}
                />
                {adminOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </Box>
          </ListItem>
          <Collapse in={adminOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {adminItems.map((comp) => (
                <ListItem disablePadding dense={true} key={comp.title}>
                  <Box width="100%">
                    <ListItemButton
                      onClick={() => {
                        navigate(comp.path);
                        onSelect?.();
                      }}
                      selected={currentPage === comp.path}
                      sx={{
                        mb: 1,
                        borderLeft: 0,
                        borderColor: "primary.main",
                        ml: 0,
                        borderRadius: 4,
                        pl: 0,
                        py: 0,
                        minHeight: 22,
                        height: 22,
                        justifyContent: "flex-start"
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 16, mr: 0 }}>
                        <IconButton sx={{ p: 0, ml: 0 }}>
                          {comp.component}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={comp.title}
                        primaryTypographyProps={{
                          fontSize: "small",
                          fontWeight: currentPage === comp.path ? "bold" : "",
                          color:
                            currentPage === comp.path
                              ? "primary.main"
                              : "inherit",
                          textAlign: "left"
                        }}
                        sx={{ textAlign: "left" }}
                      />
                    </ListItemButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Collapse>
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
                  pl: 0,
                  py: 0,
                  minHeight: 24,
                  height: 24,
                  justifyContent: "flex-start"
                }}
              >
                <ListItemIcon sx={{ minWidth: 16, mr: 0 }}>
                  <IconButton sx={{ p: 0, ml: 0 }}>
                    <LanguageOutlined fontSize="medium" color="primary" />
                  </IconButton>
                </ListItemIcon>
                <ListItemText
                  primary="Website"
                  primaryTypographyProps={{
                    fontSize: "medium",
                    fontWeight: websiteActive ? "bold" : "",
                    color: websiteActive ? "primary.main" : "inherit",
                    textAlign: "left"
                  }}
                  sx={{ textAlign: "left" }}
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
                          onSelect?.();
                          return;
                        }
                        navigate(comp.path);
                        onSelect?.();
                      }}
                      selected={currentPage === comp.path}
                      sx={{
                        mb: 1,
                        borderLeft: 0,
                        borderColor: "primary.main",
                        ml: 0,
                        borderRadius: 4,
                        pl: 0,
                        py: 0,
                        minHeight: 22,
                        height: 22,
                        justifyContent: "flex-start"
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 16, mr: 0 }}>
                        <IconButton sx={{ p: 0, ml: 0 }}>
                          {comp.component}
                        </IconButton>
                      </ListItemIcon>
                      <ListItemText
                        primary={comp.title}
                        primaryTypographyProps={{
                          fontSize: "small",
                          fontWeight: currentPage === comp.path ? "bold" : "",
                          color:
                            currentPage === comp.path
                              ? "primary.main"
                              : "inherit",
                          textAlign: "left"
                        }}
                        sx={{ textAlign: "left" }}
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
