import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmptyLinks = () => (
  <Box
    display="flex"
    justifyContent="center"
    flexDirection="column"
    alignItems="center"
    m={8}
    p={2}
  >
    <Typography variant="h5" gutterBottom align="center">
      No Links yet
    </Typography>
    <Typography variant="body1" align="center" paragraph>
      Go to <Link to="/">Home</Link> and generate your shortened link and QR
      code
    </Typography>
  </Box>
);

export default EmptyLinks;
