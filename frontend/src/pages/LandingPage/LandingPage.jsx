import React from 'react';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Logo from "../../components/Logo/Logo";
import AuthButton from '../../components/Buttons/AuthButton';
import FeaturesSection from './FeaturesSection';
import NotificationBanner from '../../components/NotificationBanner/NotificationBanner';

const LandingPage = () => (
  <Container maxWidth="2xl" 
    sx={{ 
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
      <Typography variant="subtitle1" align="center">
        LinkShrink makes it easy to shorten, generate QR codes, share, and track your links.
      </Typography>
      <FeaturesSection />
      <Box mt={2}>
        <Typography variant="h5" 
          sx={{ 
            m: 2,
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
    <NotificationBanner />
  </Container>
);

export default LandingPage;
