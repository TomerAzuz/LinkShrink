import React from "react";
import Grid from "@mui/material/Grid";

const FaviconDisplay = ({ url }) => {
  const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;

  return (
    <Grid item xs={2} sm={1} md={1}>
      <img src={favicon} width={50} height={50} alt="favicon" />
    </Grid>
  );
};

export default FaviconDisplay;
