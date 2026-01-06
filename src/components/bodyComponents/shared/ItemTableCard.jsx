import { Box, Grid, Stack, Typography } from "@mui/material";
import Products from "../inventory/Products";

export default function ItemTableCard({ title, scope, fields }) {
  return (
    <Box>
      <Grid container sx={{ mx: 1.5, p: 1.5 }}>
        <Grid item md={12}>
          <Box
            sx={{
              margin: 1.5,
              bgcolor: "background.paper",
              borderRadius: 2,
              padding: 1.5,
              height: "100%",
              color: "var(--bb-sand)"
            }}
          >
            <Typography variant="h5" sx={{ m: 3, fontWeight: "bold" }}>
              {title}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{ px: 1.5, pb: 2, flexWrap: "wrap" }}
            />
            <Products scope={scope} fields={fields} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
