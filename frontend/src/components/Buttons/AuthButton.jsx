import React from 'react';
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import { Typography } from '@mui/material';

const AuthButton = ({ to, text, ...props }) => (
  <Button
    component={to ? Link : 'button'}
    to={to}
    {...props}
    sx={(theme) => ({
      bgcolor: theme.palette.primary.main,
      color: 'white',
      padding: theme.spacing(1.25, 2.5),
      borderRadius: 2,
      fontWeight: 'bold',
      fontSize: '1rem',
      margin: 1,
      width: 'auto',
      minWidth: '150px',
      '&:hover': {
        bgcolor: theme.palette.primary.dark,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', 
      },
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
      '&.Mui-disabled': {
        bgcolor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        boxShadow: 'none',
        cursor: 'not-allowed',
      },
    })}
  >
    <Typography variant="button">{text}</Typography>
  </Button>
);

export default AuthButton;
