import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const NotificationBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleAccept = () => {
    setShowBanner(false);
    localStorage.setItem('analyticsConsent', 'true');
  };

  useEffect(() => {
    const consent = localStorage.getItem('analyticsConsent');
    if (consent === 'true') {
      setShowBanner(false);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: 'background.paper',
        boxShadow: 3,
        zIndex: 1000,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2" color="text.primary" sx={{ mr: 2 }}>
        We collect data about your interactions with our service to improve user
        experience. By continuing to use this site, you consent to our use of
        cookies and analytics.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAccept}>
        Got it!
      </Button>
    </Box>
  );
};

export default NotificationBanner;
