import React from 'react';
import { Container } from "@mui/material";

import Navbar from '../../components/Navbar/Navbar';
import TextSection from './TextSection/TextSection';
import UrlInput from "./UrlInput/UrlInput";

const Home = () => (
  <>
    <Navbar />
    <Container 
      maxWidth="xl" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <TextSection />
      <UrlInput />
    </Container>
  </>
);


export default Home;
