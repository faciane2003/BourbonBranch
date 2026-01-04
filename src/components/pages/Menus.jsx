import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";

const menus = [
  {
    title: "Dinner",
    hours: ["Sun-Thu 11am-10pm", "Fri+Sat 11am-12am"],
    href: "https://bourbonandbranchphilly.com/dinner/"
  },
  {
    title: "Drinks",
    hours: ["Sun-Thu 11am-12am", "Fri+Sat 11am-2am"],
    href: "https://bourbonandbranchphilly.com/drinks/"
  },
  {
    title: "Brunch",
    hours: ["Sat+Sun 11am-3pm"],
    href: "https://bourbonandbranchphilly.com/brunch/"
  },
  {
    title: "Happy Hour",
    hours: ["Mon-Fri 4:30pm-6:30pm"],
    href: "https://bourbonandbranchphilly.com/happyhour/"
  },
  {
    title: "Specials",
    hours: ["Daily"],
    href: "https://bourbonandbranchphilly.com/specials/"
  }
];

export default function Menus() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Menus
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 680 }}>
        Explore dinner, drinks, brunch, happy hour, and daily specials at Bourbon
        & Branch in Northern Liberties.
      </Typography>
      <Grid container spacing={3}>
        {menus.map((menu) => (
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
                <Typography variant="h5" sx={{ color: "var(--bb-gold)" }}>
                  {menu.title}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {menu.hours.map((line) => (
                    <Typography key={line} variant="body2" sx={{ mb: 0.5 }}>
                      {line}
                    </Typography>
                  ))}
                </Box>
                <Button
                  href={menu.href}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    mt: 3,
                    color: "var(--bb-ink)",
                    backgroundColor: "var(--bb-gold)",
                    "&:hover": { backgroundColor: "var(--bb-copper)" }
                  }}
                >
                  View {menu.title} Menu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
