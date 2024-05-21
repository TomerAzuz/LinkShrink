import React from 'react';
import { Container } from "@mui/material";

import TextSection from './TextSection/TextSection';
import UrlInput from "./UrlInput/UrlInput";

const Home = () => {
  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <TextSection />
      <UrlInput />
    </Container>
  );
};

export default Home;
