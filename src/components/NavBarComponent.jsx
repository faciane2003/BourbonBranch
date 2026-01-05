import { AppBar, Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

export default function NavBarComponent({ onToggleNav }) {
  return (
    <Grid container>
      <Grid item md={12}>
        <Paper elevation={4}>
          <AppBar
            sx={{
              padding: 2,
              backgroundColor: "rgba(15, 11, 10, 0.95)",
              top: 0,
              left: 0,
              right: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
            position="fixed"
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
                  <Button
                    onClick={onToggleNav}
                    sx={{
                      fontWeight: 700,
                      letterSpacing: ".2rem",
                      color: "var(--bb-gold)",
                      textDecoration: "none",
                      minWidth: "auto",
                      px: 2,
                      py: 0.5,
                      borderRadius: 999,
                      border: "1px solid rgba(230, 209, 153, 0.35)",
                      bgcolor: "rgba(21, 16, 14, 0.7)",
                      "&:hover": {
                        bgcolor: "rgba(21, 16, 14, 0.9)"
                      }
                    }}
                  >
                    B&B
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center"
                  }}
                />
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
