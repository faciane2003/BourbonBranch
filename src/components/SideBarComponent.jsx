import "../../public/styles/links.css";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@mui/material";
import {
  CalendarMonthOutlined,
  CallOutlined,
  CardTravelOutlined,
  DeliveryDiningOutlined,
  DescriptionOutlined,
  EventOutlined,
  ExpandLess,
  ExpandMore,
  HomeOutlined,
  Inventory2Outlined,
  LocalOfferOutlined,
  MonetizationOnOutlined,
  PeopleAltOutlined,
  RestaurantMenuOutlined,
  SettingsOutlined,
  TrendingUpOutlined
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function SideBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname;

  const operationsItems = useMemo(
    () => [
      {
        title: "Dashboard",
        component: <HomeOutlined fontSize="medium" color="primary" />,
        path: "/"
      },
      {
        title: "Inventory",
        component: <Inventory2Outlined fontSize="medium" color="primary" />,
        path: "/inventory"
      },
      {
        title: "Orders",
        component: <CardTravelOutlined fontSize="medium" color="primary" />,
        path: "/orders"
      },
      {
        title: "Customers",
        component: <PeopleAltOutlined fontSize="medium" color="primary" />,
        path: "/customers"
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
      },
      {
        title: "Settings",
        component: <SettingsOutlined fontSize="medium" color="primary" />,
        path: "/settings"
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

  const activeIndex = operationsItems.findIndex(
    (item) => item.path === currentPage
  );
  const websiteActive = websiteItems.some(
    (item) => !item.external && item.path === currentPage
  );
  const [websiteOpen, setWebsiteOpen] = useState(websiteActive);

  return (
    <>
      <List
        subheader={
          <ListSubheader
            component="div"
            sx={{
              bgcolor: "transparent",
              color: "var(--bb-gold)",
              letterSpacing: 1,
              textTransform: "uppercase"
            }}
          >
            Operations
          </ListSubheader>
        }
      >
        {operationsItems.map((comp, index) => (
          <ListItem disablePadding dense={true} key={comp.title}>
            <Box width="100%">
              <ListItemButton
                onClick={() => navigate(comp.path)}
                selected={index === activeIndex && currentPage === comp.path}
                sx={{
                  mb: 3,
                  borderLeft: 0,
                  borderColor: "primary.main",
                  ml: 1
                }}
              >
                <ListItemIcon>
                  <IconButton>{comp.component}</IconButton>
                </ListItemIcon>
                <ListItemText
                  primary={comp.title}
                  primaryTypographyProps={{
                    fontSize: "medium",
                    fontWeight: activeIndex === index ? "bold" : "",
                    color: activeIndex === index ? "primary.main" : "inherit"
                  }}
                />
              </ListItemButton>
            </Box>
          </ListItem>
        ))}
      </List>
      <List
        subheader={
          <ListSubheader
            component="div"
            sx={{
              bgcolor: "transparent",
              color: "var(--bb-gold)",
              letterSpacing: 1,
              textTransform: "uppercase"
            }}
          >
            Website
          </ListSubheader>
        }
      >
        <ListItem disablePadding dense={true}>
          <Box width="100%">
            <ListItemButton
              onClick={() => setWebsiteOpen((prev) => !prev)}
              selected={websiteActive}
              sx={{
                mb: 2,
                borderLeft: 0,
                borderColor: "primary.main",
                ml: 1
              }}
            >
              <ListItemIcon>
                <IconButton>
                  <HomeOutlined fontSize="medium" color="primary" />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary="Website"
                primaryTypographyProps={{
                  fontSize: "medium",
                  fontWeight: websiteActive ? "bold" : "",
                  color: websiteActive ? "primary.main" : "inherit"
                }}
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
                      ml: 4
                    }}
                  >
                    <ListItemIcon>
                      <IconButton>{comp.component}</IconButton>
                    </ListItemIcon>
                    <ListItemText
                      primary={comp.title}
                      primaryTypographyProps={{
                        fontSize: "small",
                        fontWeight: currentPage === comp.path ? "bold" : "",
                        color:
                          currentPage === comp.path
                            ? "primary.main"
                            : "inherit"
                      }}
                    />
                  </ListItemButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </>
  );
}
