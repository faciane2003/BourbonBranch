import { AppBar, Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

export default function NavBarComponent() {
  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar
            sx={{ padding: 2, backgroundColor: "rgba(15, 11, 10, 0.95)" }}
            position="static"
          >
            <Container maxWidth="xxl">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    component="img"
                    src="/bourbon-and-branch_files/bourbon_and_branch_logo.png"
                    alt="Bourbon & Branch"
                    sx={{ height: 40, display: { xs: "none", md: "block" } }}
                  />
                  <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: ".2rem",
                      color: "var(--bb-gold)",
                      textDecoration: "none",
                    }}
                  >
                    Bourbon & Branch
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                    gap: 2
                  }}
                >
                  <Button
                    href="https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime"
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      color: "var(--bb-ink)",
                      backgroundColor: "var(--bb-gold)",
                      "&:hover": { backgroundColor: "var(--bb-copper)" }
                    }}
                  >
                    Reservations
                  </Button>
                  <Button
                    href="https://www.toasttab.com/bourbon-branch-705-n-2nd-st"
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
                    Takeout & Delivery
                  </Button>
                </Box>
              </Box>
            </Container>
          </AppBar>
        </Paper>
      </Grid>
    </Grid>
  );
}

{
  /* <Grid item md={7}>
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      width: "50%",
                      mx: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search "
                      inputProps={{ "aria-label": "search" }}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <Search />
                    </IconButton>
                  </Paper>
                </Grid> */
}
