import React from 'react';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const NavButton = ({ to, children, onClick }) => (
  <Button 
    sx={{ color: "black" }} 
    component={Link} 
    to={to} 
    onClick={onClick}
  >
    <Typography variant="button">{children}</Typography>
  </Button>
);

export default NavButton;