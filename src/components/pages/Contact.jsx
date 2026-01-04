import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ color: "var(--bb-gold)", mb: 2 }}>
        Contact
      </Typography>
      <Typography sx={{ color: "var(--bb-sand)", mb: 4, maxWidth: 720 }}>
        Bourbon & Branch is located in Northern Liberties, Philadelphia.
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
            <Typography variant="h6" sx={{ color: "var(--bb-gold)" }}>
              Address
            </Typography>
            <Link
              href="https://maps.google.com/maps?q=705+North+2nd+Street,+Philadelphia,+PA"
              target="_blank"
              rel="noreferrer"
              underline="hover"
              color="inherit"
            >
              705 N. 2nd St, Philadelphia, PA (Northern Liberties)
            </Link>
            <Typography variant="h6" sx={{ color: "var(--bb-gold)" }}>
              Phone
            </Typography>
            <Link href="tel:+12152380660" underline="hover" color="inherit">
              (215) 238-0660
            </Link>
            <Typography variant="h6" sx={{ color: "var(--bb-gold)" }}>
              Email
            </Typography>
            <Typography variant="body2">
              Events & private rental:
              <Link
                href="mailto:bourbonbranchevents@gmail.com"
                underline="hover"
                color="inherit"
                sx={{ ml: 1 }}
              >
                bourbonbranchevents@gmail.com
              </Link>
            </Typography>
            <Typography variant="body2">
              General inquiries:
              <Link
                href="mailto:managersbourbon@gmail.com"
                underline="hover"
                color="inherit"
                sx={{ ml: 1 }}
              >
                managersbourbon@gmail.com
              </Link>
            </Typography>
            <Typography variant="h6" sx={{ color: "var(--bb-gold)" }}>
              Social
            </Typography>
            <Stack spacing={1}>
              <Link
                href="https://www.instagram.com/bourbonandbranch/"
                target="_blank"
                rel="noreferrer"
                underline="hover"
                color="inherit"
              >
                Instagram
              </Link>
              <Link
                href="https://www.facebook.com/bourbonandbranchphilly"
                target="_blank"
                rel="noreferrer"
                underline="hover"
                color="inherit"
              >
                Facebook
              </Link>
              <Link
                href="http://www.yelp.com/biz/bourbon-and-branch-philadelphia"
                target="_blank"
                rel="noreferrer"
                underline="hover"
                color="inherit"
              >
                Yelp
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
