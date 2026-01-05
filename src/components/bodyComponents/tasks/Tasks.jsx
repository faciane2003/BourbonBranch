import { Box, Card, CardContent, Typography } from "@mui/material";

export default function Tasks() {
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
            Tasks
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Track daily checklists and staff tasks.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
