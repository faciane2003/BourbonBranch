import { Box, Card, CardContent, Typography } from "@mui/material";
import { Component } from "react";

export default class Report extends Component {
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
              Reports
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Report templates will appear here once data collection is enabled.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
}
