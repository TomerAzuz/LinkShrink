import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const LinkDetails = ({ url, title }) => (
  <>
    <Tooltip title={title}>
      <Typography 
        variant="body1" 
        component={RouterLink} 
        to={url} 
        color="inherit" 
        underline="always" 
        ml={2}
        sx={{ 
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "noWrap"
        }}
      >
        {title}
      </Typography>
    </Tooltip>
    <Typography 
      variant="body1" 
      component={RouterLink} 
      to={url} 
      color="inherit" 
      underline="always" 
      ml={2}
      sx={{ 
        overflow: "hidden", 
        textOverflow: "ellipsis",
         whiteSpace: "nowrap" 
      }}
    >
      {url}
    </Typography>
    </>
);

export default LinkDetails;
