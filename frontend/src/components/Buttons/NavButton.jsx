import React from 'react';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const NavButton = ({ to, children, onClick }) => (
  <Button sx={{ color: "black" }} component={Link} to={to} onClick={onClick}>
    {children}
  </Button>
);

export default NavButton;