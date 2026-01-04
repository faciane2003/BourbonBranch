import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Events() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Events
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 720 }}>
        From weekly specials to live music, Bourbon & Branch hosts events in
        Northern Liberties throughout the month.
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
              View the full calendar
            </Typography>
            <Typography variant="body2">
              Stay up to date on upcoming events and special programming.
            </Typography>
            <Box>
              <Button
                href="https://bourbonandbranchphilly.com/events/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  mr: 2,
                  color: "var(--bb-ink)",
                  backgroundColor: "var(--bb-gold)",
                  "&:hover": { backgroundColor: "var(--bb-copper)" }
                }}
              >
                View Events
              </Button>
              <Button
                href="https://bourbonandbranchphilly.com/book-your-event/"
                target="_blank"
                rel="noreferrer"
                variant="outlined"
                sx={{
                  color: "var(--bb-gold)",
                  borderColor: "var(--bb-gold)",
                  "&:hover": {
                    borderColor: "var(--bb-copper)",
                    color: "var(--bb-copper)"
                  }
                }}
              >
                Book Your Event
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
