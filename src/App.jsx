import Inter from "../public/static/fonts/Inter.ttf";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import RootComponent from "./components/RootComponent";
import RootPage from "./components/RootPage";
// import "../app.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/bodyComponents/Home/Home";
import Menus from "./components/pages/Menus";
import Events from "./components/pages/Events";
import Specials from "./components/pages/Specials";
import Reservations from "./components/pages/Reservations";
import Takeout from "./components/pages/Takeout";
import Contact from "./components/pages/Contact";

function App() {
  const theme = createTheme({
    spacing: 4,
    palette: {
      mode: "dark",
      primary: {
        main: "#e6d199",
      },
      secondary: {
        main: "#c98f5a",
      },
      background: {
        default: "#0f0b0a",
        paper: "#15100e",
      },
    },

    typography: {
      fontFamily: "Inter, 'Times New Roman', serif",
      h2: {
        letterSpacing: "0.2rem",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Inter'), local('Inter-Regular'), url(${Inter}) format('truetype');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
    //here we customize our typographi and in the variant prop we can use out myVar value
  });
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<RootPage />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/menus" element={<Menus />}></Route>
        <Route path="/events" element={<Events />}></Route>
        <Route path="/specials" element={<Specials />}></Route>
        <Route path="/reservations" element={<Reservations />}></Route>
        <Route path="/takeout" element={<Takeout />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
