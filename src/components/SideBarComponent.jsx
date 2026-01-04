import "../../public/styles/links.css";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Box,
} from "@mui/material";
import {
  HomeOutlined,
  RestaurantMenuOutlined,
  EventOutlined,
  LocalOfferOutlined,
  CalendarMonthOutlined,
  DeliveryDiningOutlined,
  CallOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideBarComponent() {
  const navigate = useNavigate();
  const navigateTo = (to) => {
    navigate(to);
  };
  const location = useLocation();
  const currentPage = location.pathname;
  // const styles = theme => ({
  //     listItemText:{
  //         fontSize:'0.7em',//Insert your required size
  //     }
  //     });
  const sideBarComponent = [
    {
      title: "Home",
      component: <HomeOutlined fontSize="medium" color="primary" />,
      path: "/",
    },
    {
      title: "Menus",
      component: <RestaurantMenuOutlined fontSize="medium" color="primary" />,
      path: "/menus",
    },
    {
      title: "Events",
      component: <EventOutlined fontSize="medium" color="primary" />,
      path: "/events",
    },
    {
      title: "Specials",
      component: <LocalOfferOutlined fontSize="medium" color="primary" />,
      path: "/specials",
    },
    {
      title: "Reservations",
      component: <CalendarMonthOutlined fontSize="medium" color="primary" />,
      path:
        "https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime",
      external: true,
    },
    {
      title: "Takeout",
      component: <DeliveryDiningOutlined fontSize="medium" color="primary" />,
      path: "https://www.toasttab.com/bourbon-branch-705-n-2nd-st",
      external: true,
    },
    {
      title: "Contact",
      component: <CallOutlined fontSize="medium" color="primary" />,
      path: "/contact",
    },
  ];
  const activeIndex = sideBarComponent.findIndex(
    (item) => !item.external && item.path === currentPage
  );
  return (
    <>
      <List>
        {sideBarComponent.map((comp, index) => (
          <ListItem disablePadding dense={true} key={comp.title}>
            <Box width="100%">
              <ListItemButton
                onClick={() => {
                  if (comp.external) {
                    window.open(comp.path, "_blank", "noreferrer");
                    return;
                  }
                  navigateTo(comp.path);
                }}
                // selected={}
                selected={
                  index === activeIndex && currentPage === comp.path
                }
                sx={{
                  mb: 3,
                  borderLeft: 0,
                  borderColor: "primary.main",
                  ml: 1,
                }}
              >
                <ListItemIcon>
                  <IconButton>{comp.component}</IconButton>
                </ListItemIcon>
                {/* <Link
                  to={"" + comp.title.toLocaleLowerCase()}
                  className="router-link"
                > */}
                <ListItemText
                  primary={comp.title}
                  primaryTypographyProps={{
                    fontSize: "medium",
                    fontWeight: activeIndex === index ? "bold" : "",
                    color: activeIndex === index ? "primary.main" : "inherit",
                  }}
                />
                {/* </Link> */}
              </ListItemButton>
            </Box>
          </ListItem>
        ))}
      </List>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
    </>
  );
  //   const [open, setOpen] = React.useState(false);

  //   const handleClick = () => {
  //     setOpen(true);
  //   };

  //   const handleClose = (event, reason) => {
  //     if (reason === 'clickaway') {
  //       return;
  //     }

  //     setOpen(false);
  //   };
}
