import React from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import QRCode from '../QRCode/QRCode';
import RequestService from '../../../services/RequestService';
import { validateUrl } from '../../../utils/UrlValidator';

const UrlResult = ({ urlMapping, resetUrlInput }) => {

  const shortCode = urlMapping.data?.shortUrl && urlMapping.data.shortUrl.substring(urlMapping.data.shortUrl.lastIndexOf("/") + 1);

  const isQRCode = () => {
    return !!urlMapping.data?.qrCodeData;
  };

  const openInNewTab = (longUrl) => {
    let fullUrl = longUrl.trim(); // Remove leading/trailing spaces

    // Validate the URL
    try {
      fullUrl = validateUrl(fullUrl);
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return;
    }

    const newWindow = window.open(fullUrl, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      // Prevent the opened window from accessing the opener window
      newWindow.opener = null;
    }
  };

  const handleRedirect = async () => {
    try {
      const response = await RequestService.get(`/${shortCode}`);
      if (response.status === 200) {
        openInNewTab(response.data.longUrl);
      } else {
        console.error('Short URL not found');
      }
    } catch (error) {
      console.error('Error fetching redirect URL:', error);
    }
  };
  
  return (
    <>
      {isQRCode() ? (
        <Box>
          <QRCode qrCodeImage={urlMapping.data.qrCodeData} />
        </Box>
      ) : (
        <Typography variant='h6' sx={{ margin: 2, cursor: 'pointer' }}>
          <Link onClick={handleRedirect}>
            {urlMapping.data.shortUrl}
          </Link>
        </Typography>
        )
      }
      <Button onClick={resetUrlInput}>Shorten another URL</Button>
    </>
  );
};

export default UrlResult;
