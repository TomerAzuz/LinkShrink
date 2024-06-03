import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const DateDisplay = ({ createdAt }) => (
  <Grid item xs={10} sm={5} md={2} display="flex" justifyContent="center" position="relative">
    <Typography variant="body1" align="center" component="span" ml={1}>
      {new Date(createdAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
    </Typography>
  </Grid>
);

export default DateDisplay;
