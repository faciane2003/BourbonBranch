import { Box, Grid, Stack, Typography } from "@mui/material";
import Products from "../inventory/Products";

export default function ItemTableCard({
  title,
  scope,
  fields,
  searchTerm,
  searchControl
}) {
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                m: 3
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
              {searchControl && (
                <Box sx={{ minWidth: 180 }}>
                  {searchControl}
                </Box>
              )}
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{ px: 1.5, pb: 2, flexWrap: "wrap" }}
            />
            <Products scope={scope} fields={fields} searchTerm={searchTerm} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
