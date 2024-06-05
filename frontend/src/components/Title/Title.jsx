import React from "react";
import Typography from '@mui/material/Typography';

const Title = ({ text, variant = 'h4', color = '#333', ...props }) => (
  <Typography
    variant={variant}
    color={color}
    fontWeight="bold"
    gutterBottom
    sx={{ userSelect: "none" }}
    {...props}
  >
    {text}
  </Typography>
);

export default Title;