import React from 'react';
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

const NavButton = ({ to, children, onClick }) => {
  const theme = useTheme();

  return (
    <Button 
      sx={{ 
        color: theme.palette.text.primary, 
        borderColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
        }
      }} 
      component={Link} 
      to={to} 
      onClick={onClick}
    >
      <Typography variant="button" fontSize="1rem">{children}</Typography>
    </Button>
  );
};

export default NavButton;
