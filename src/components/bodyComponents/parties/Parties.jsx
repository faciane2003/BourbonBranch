import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Parties() {
  return (
    <Box sx={{ p: 4 }}>
      <Card
        sx={{
          bgcolor: "background.paper",
          color: "var(--bb-sand)",
          border: "1px solid rgba(230, 209, 153, 0.2)"
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ color: "var(--bb-gold)" }}>
            Parties
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Track party bookings, prep notes, and special requests.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
