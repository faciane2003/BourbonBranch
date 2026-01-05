import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Notes() {
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
            Notes
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Capture service notes, reminders, and follow-ups.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
