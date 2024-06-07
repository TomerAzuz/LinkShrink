import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const ResultButton = ({ onClick, children }) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        padding: '10px 20px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
        margin: 4,
      }}
    >
      <Typography variant="button">{children}</Typography>
    </Button>
  );
};

export default ResultButton;
