import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { qrCodeToBase64 } from "../../../../utils/qrCodeToBase64";
import QrCodeCard from "../../../../components/QrCodeCard/QrCodeCard";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import SocialShareButtons from "../../../../components/Buttons/SocialShareButtons";

const ShortenedUrlResult = ({ result, resetUrlInput }) => {  
  const shortUrl = result.data?.shortUrl || "";
  
  const imageUrl = qrCodeToBase64(result?.data?.qrCodeData) || "";

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" align="center" gutterBottom mt={2}>
        URL Shortener Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Your URL has been successfully shortened. 
        You can now copy it, share it on social media, or use the QR code provided.
      </Typography>
      <Box m={4}>
        <QrCodeCard imageUrl={imageUrl} size="medium" />
      </Box>
      <Box>
        <CopyLink url={shortUrl} variant="h6" />
      </Box>
      <SocialShareButtons shortUrl={shortUrl} />
      <Button
        onClick={resetUrlInput}
        variant="contained"
        sx={{
          color: 'white',
          backgroundColor: '#3f51b5',
          padding: '10px 20px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#303f9f',
          }
        }}
      >
        <Typography variant="button">Shorten another URL</Typography>
      </Button>
    </Box>
  );
};

export default ShortenedUrlResult;
