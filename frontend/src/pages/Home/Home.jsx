import React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

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
    <Box m={2}>
      <Logo size={{ xs: "4rem", md: "6rem" }} />
    </Box>
    <UrlInput />
  </Container>
);

export default Home;
