import React from 'react';
import Container from "@mui/material/Container";

import UrlInput from "./UrlInput/UrlInput";
import TextSection from "./TextSection/TextSection";

const Home = () => {
  return (
    <Container
      maxWidth="2xl" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      <TextSection/>
      <UrlInput />
    </Container>
  );
};

export default Home;
