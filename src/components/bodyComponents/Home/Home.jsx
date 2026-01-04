import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const menuHighlights = [
  {
    title: "Dinner",
    hours: ["Sun-Thu 11am-10pm", "Fri+Sat 11am-12am"]
  },
  {
    title: "Drinks",
    hours: ["Sun-Thu 11am-12am", "Fri+Sat 11am-2am"]
  },
  {
    title: "Brunch",
    hours: ["Sat+Sun 11am-3pm"]
  },
  {
    title: "Happy Hour",
    hours: ["Mon-Fri 4:30pm-6:30pm"]
  },
  {
    title: "Specials",
    hours: ["Daily"]
  }
];

const instagramImages = [
  "/bourbon-and-branch_files/608528340_18552578050004566_8590809360539907329_nfull.jpg",
  "/bourbon-and-branch_files/607744259_18552226672004566_5222690323678711772_nfull.jpg",
  "/bourbon-and-branch_files/607168750_18552039787004566_2264259794847985216_nfull.jpg",
  "/bourbon-and-branch_files/605622557_18551425633004566_4103640121055602581_nfull.jpg"
];

export default function Home() {
  return (
    <Box sx={{ p: { xs: 0, md: 2 } }}>
      <Box
        sx={{
          minHeight: { xs: 380, md: 520 },
          borderRadius: { xs: 0, md: 4 },
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(120deg, rgba(15,11,10,0.85), rgba(34,26,23,0.4)), url('/bourbon-and-branch_files/608528340_18552578050004566_8590809360539907329_nfull.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 6 }
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 620 }}>
          <Typography
            variant="h2"
            sx={{ color: "var(--bb-gold)", letterSpacing: 2 }}
          >
            Bourbon & Branch
          </Typography>
          <Typography variant="h6" sx={{ color: "var(--bb-sand)" }}>
            Northern Liberties restaurant and bar featuring dinner, drinks,
            brunch, and late-night favorites.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
            <Button
              component={RouterLink}
              to="/menus"
              sx={{
                color: "var(--bb-ink)",
                backgroundColor: "var(--bb-gold)",
                "&:hover": { backgroundColor: "var(--bb-copper)" }
              }}
            >
              View Menus
            </Button>
            <Button
              href="https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime"
              target="_blank"
              rel="noreferrer"
              variant="outlined"
              sx={{
                color: "var(--bb-gold)",
                borderColor: "var(--bb-gold)",
                "&:hover": {
                  borderColor: "var(--bb-copper)",
                  color: "var(--bb-copper)"
                }
              }}
            >
              Reservations
            </Button>
          </Stack>
          <Typography variant="body2" sx={{ color: "var(--bb-sand)" }}>
            705 N. 2nd St, Philadelphia, PA • (215) 238-0660
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <Typography variant="h4" sx={{ color: "var(--bb-gold)", mb: 3 }}>
          Menus & Hours
        </Typography>
        <Grid container spacing={3}>
          {menuHighlights.map((menu) => (
            <Grid item xs={12} md={6} lg={4} key={menu.title}>
              <Card
                sx={{
                  backgroundColor: "rgba(21, 16, 14, 0.9)",
                  border: "1px solid rgba(230, 209, 153, 0.2)",
                  color: "var(--bb-sand)",
                  height: "100%"
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: "var(--bb-gold)" }}>
                    {menu.title}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {menu.hours.map((line) => (
                      <Typography key={line} variant="body2">
                        {line}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
          component={RouterLink}
          to="/menus"
          sx={{
            mt: 3,
            color: "var(--bb-ink)",
            backgroundColor: "var(--bb-gold)",
            "&:hover": { backgroundColor: "var(--bb-copper)" }
          }}
        >
          Explore All Menus
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ px: { xs: 3, md: 5 }, pb: 5 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "rgba(21, 16, 14, 0.9)",
              border: "1px solid rgba(230, 209, 153, 0.2)",
              color: "var(--bb-sand)",
              height: "100%"
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ color: "var(--bb-gold)", mb: 1 }}>
                Events
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Live music, specials, and community gatherings hosted all month
                long.
              </Typography>
              <Button
                component={RouterLink}
                to="/events"
                sx={{
                  color: "var(--bb-ink)",
                  backgroundColor: "var(--bb-gold)",
                  "&:hover": { backgroundColor: "var(--bb-copper)" }
                }}
              >
                View Events
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: "rgba(21, 16, 14, 0.9)",
              border: "1px solid rgba(230, 209, 153, 0.2)",
              color: "var(--bb-sand)",
              height: "100%"
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ color: "var(--bb-gold)", mb: 1 }}>
                Specials
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Daily specials and seasonal features are available every week.
              </Typography>
              <Button
                component={RouterLink}
                to="/specials"
                sx={{
                  color: "var(--bb-ink)",
                  backgroundColor: "var(--bb-gold)",
                  "&:hover": { backgroundColor: "var(--bb-copper)" }
                }}
              >
                View Specials
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ px: { xs: 3, md: 5 }, pb: 5 }}>
        <Typography variant="h4" sx={{ color: "var(--bb-gold)", mb: 3 }}>
          From Instagram
        </Typography>
        <ImageList cols={2} gap={12} sx={{ maxWidth: 900 }}>
          {instagramImages.map((src) => (
            <ImageListItem key={src}>
              <Box
                component="img"
                src={src}
                alt="Bourbon & Branch"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  border: "1px solid rgba(230, 209, 153, 0.2)"
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
        <Button
          href="https://www.instagram.com/bourbonandbranch/"
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          sx={{
            mt: 3,
            color: "var(--bb-gold)",
            borderColor: "var(--bb-gold)",
            "&:hover": {
              borderColor: "var(--bb-copper)",
              color: "var(--bb-copper)"
            }
          }}
        >
          Follow on Instagram
        </Button>
      </Box>
    </Box>
  );
}
