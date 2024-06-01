import React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Logo from "../../components/Logo/Logo";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Container maxWidth="lg" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: 'background.default', 
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
        <Box mt={4}>
          <Button component={Link} to="/signup" sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            padding: '1rem 2rem',
            borderRadius: '5px',
            fontWeight: 'bold',
            margin:'20px',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}>
            Sign up
          </Button>
          <Button component={Link} to="/login" sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            padding: '1rem 2rem',
            borderRadius: '5px',
            margin:"20px",
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}>
              Log in
          </Button>
        </Box>
      </Box>      
    </Container>
  );
};

export default LandingPage;