import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

const TextSection = () => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
      <Box
        sx={{
          borderRadius: 12,
          color: theme.palette.common.white,
          textAlign: 'center',
          padding: '2rem',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography 
          variant="h2" 
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: theme.palette.common.white,
          }}
        >
          Simplify Your Links, Amplify Your Reach
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.common.white, mb: 3 }}>
          Create short, memorable links that drive engagement and increase your online presence.
        </Typography>
        <Button 
          variant="contained"
          sx={{ color: theme.palette.primary.main, backgroundColor: theme.palette.common.white, borderRadius: '25px', padding: '10px 20px', boxShadow: 'none', fontWeight: 'bold' }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default TextSection;
