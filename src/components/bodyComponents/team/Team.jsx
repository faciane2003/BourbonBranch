import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Team() {
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
            Team
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Manage staff roles, availability, and coverage.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
