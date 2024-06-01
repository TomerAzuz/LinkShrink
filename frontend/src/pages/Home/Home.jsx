import React from 'react';
import Container from "@mui/material/Container";

import UrlInput from "./UrlInput/UrlInput";
import Logo from '../../components/Logo/Logo';

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
      <Logo size={{ xs: "4rem", md: "6rem" }}/>
      <UrlInput />
    </Container>
  );
};

export default Home;
