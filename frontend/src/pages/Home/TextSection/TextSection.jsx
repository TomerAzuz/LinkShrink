import React from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';

const TextSection = () => (
  <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
    <Box
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 12,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
        Simplify Your Links, Amplify Your Reach
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Create short, memorable links that drive engagement and increase your online presence.
      </Typography>
      <Button variant="contained" sx={{ bgcolor: 'primary.main', color: 'white' }}>
        Get Started
      </Button>
    </Box>
  </Box>
);

export default TextSection;

