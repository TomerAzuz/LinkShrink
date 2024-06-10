import React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UrlInput from "./UrlInput/UrlInput";
import Logo from '../../components/Logo/Logo';

const Home = () => (
  <Container
    maxWidth="2xl" 
    sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    }}
  >
    <Box m={2} display="flex" flexDirection="column" alignItems="center">
      <Logo size={{ xs: "3rem", md: "5rem" }} />
      <Typography variant="body1" align="center">
        Insert a URL below to generate your shortened link and QR code.
      </Typography>
    </Box>
    <UrlInput />
  </Container>
);

export default Home;
