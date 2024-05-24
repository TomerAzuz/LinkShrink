import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ErrorPage = ({ error }) => {
  return (
  <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
    <Typography variant='h4' color='error'>
      {error.response.status} Error
    </Typography>
  </Box>
  );
};

export default ErrorPage;