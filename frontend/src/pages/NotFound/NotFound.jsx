import React from 'react';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const NotFound = () => (
  <Container
    maxWidth="sm"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh', 
    }}
  >
    <Typography variant="h3" component="h1" gutterBottom>
      404 - Not Found
    </Typography>
    <Typography variant="body1" gutterBottom>
      The page you're looking for doesn't exist.
    </Typography>
  </Container>
);

export default NotFound;
