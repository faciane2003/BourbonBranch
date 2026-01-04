import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Reservations() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Reservations
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 720 }}>
        Reserve your table at Bourbon & Branch in Northern Liberties.
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
              Book a table
            </Typography>
            <Typography variant="body2">
              Reservations are managed through Toast.
            </Typography>
            <Button
              href="https://tables.toasttab.com/restaurants/ab5db445-fe5d-42d3-a027-6e9c3964cf4d/findTime"
              target="_blank"
              rel="noreferrer"
              sx={{
                alignSelf: "flex-start",
                color: "var(--bb-ink)",
                backgroundColor: "var(--bb-gold)",
                "&:hover": { backgroundColor: "var(--bb-copper)" }
              }}
            >
              Make a Reservation
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
