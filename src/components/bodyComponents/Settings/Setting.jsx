import { Box, Card, CardContent, Typography } from "@mui/material";
import { Component } from "react";

export default class Setting extends Component {
  render() {
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
              Settings
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Configure operations preferences, staff access, and notifications.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
}
