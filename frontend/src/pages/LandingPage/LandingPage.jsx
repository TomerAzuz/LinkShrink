import React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Logo from "../../components/Logo/Logo";
import AuthButton from '../../components/Buttons/AuthButton';

const LandingPage = () => (
  <Container maxWidth="2xl" 
    sx={{ 
      height: 'calc(100vh - 7rem)',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem'
    }}
  >
    <Box 
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Logo size={{ xs: "4rem", md: "6rem" }}/>
      <Box mt={2}>
        <Typography variant="h4" 
          sx={{ 
            m: 4,
            fontWeight: 'bold', 
            color: 'text.primary', 
            textDecorationColor: 'primary.main',
            userSelect: 'none',
          }}
        > 
          Get Started
        </Typography> 
        <AuthButton to="/signup" text="Sign up" />
        <AuthButton to="/login" text="Log in" />
      </Box>
    </Box>      
  </Container>
);


export default LandingPage;
