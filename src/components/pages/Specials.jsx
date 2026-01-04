import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Specials() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Specials
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 720 }}>
        Daily specials are served at Bourbon & Branch. Check the latest menu for
        rotating features and seasonal plates.
      </Typography>
      <Card
        sx={{
          backgroundColor: "rgba(21, 16, 14, 0.9)",
          border: "1px solid rgba(230, 209, 153, 0.2)",
          color: "var(--bb-sand)"
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ color: "var(--bb-gold)" }}>
              Daily Specials
            </Typography>
            <Typography variant="body2">Available every day.</Typography>
            <Button
              href="https://bourbonandbranchphilly.com/specials/"
              target="_blank"
              rel="noreferrer"
              sx={{
                alignSelf: "flex-start",
                color: "var(--bb-ink)",
                backgroundColor: "var(--bb-gold)",
                "&:hover": { backgroundColor: "var(--bb-copper)" }
              }}
            >
              View Specials
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
