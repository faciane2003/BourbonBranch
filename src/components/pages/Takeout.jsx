import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

export default function Takeout() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Takeout & Delivery
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 720 }}>
        Order Bourbon & Branch for pickup or delivery through Toast.
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
              Order online
            </Typography>
            <Typography variant="body2">
              Menu and availability are updated in Toast.
            </Typography>
            <Button
              href="https://www.toasttab.com/bourbon-branch-705-n-2nd-st"
              target="_blank"
              rel="noreferrer"
              sx={{
                alignSelf: "flex-start",
                color: "var(--bb-ink)",
                backgroundColor: "var(--bb-gold)",
                "&:hover": { backgroundColor: "var(--bb-copper)" }
              }}
            >
              Order Now
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
