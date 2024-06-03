import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const LinkDetails = ({ url, title }) => (
  <Grid item xs={10} sm={5} md={3} display="flex" flexDirection="column" maxWidth="200px">
    <Typography 
      variant="body1" 
      component={RouterLink} 
      to={url} 
      color="inherit" 
      underline="always" 
      ml={2}
      sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {title}
    </Typography>
    <Typography 
      variant="body1" 
      component={RouterLink} 
      to={url} 
      color="inherit" 
      underline="always" 
      ml={2}
      sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {url}
    </Typography>
  </Grid>
);

export default LinkDetails;
