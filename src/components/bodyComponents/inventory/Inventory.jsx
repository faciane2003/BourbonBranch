import { Grid, Box, Button, Stack, Typography } from "@mui/material";
import { Component } from "react";
import Products from "./Products";
import { Link } from "react-router-dom";
export default class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Box>
        <Grid container sx={{ mx: 3, p: 3 }}>
          <Grid item md={12}>
            <Box
              sx={{
                margin: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                padding: 3,
                height: "100%",
                color: "var(--bb-sand)",
              }}
            >
              <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
                Items
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{ px: 3, pb: 2, flexWrap: "wrap" }}
              >
              </Stack>
              <Products />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
