import React from 'react';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import { qrCodeToBase64 } from '../../../utils/qrCodeToBase64';

const UrlResult = ({ urlMapping, resetUrlInput }) => {

  const shortCode = urlMapping.data?.shortUrl && urlMapping.data.shortUrl.substring(urlMapping.data.shortUrl.lastIndexOf("/") + 1);
  const isQRCode = !!urlMapping.data?.qrCodeData;

  const imageUrl = isQRCode ? qrCodeToBase64(urlMapping.data.qrCodeData) : '';

  return (
    <Box display='flex' flexDirection='column' margin='12px'>
      {isQRCode ? (
        <Card>
          <CardMedia 
            component="img"
            image={imageUrl}
            alt="QR Code"
          />
        </Card>        
      ) : (
        <Typography variant='h6' sx={{ margin: 2, cursor: 'pointer' }}>
          <Link href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
            {urlMapping.data.shortUrl}
          </Link>
        </Typography>
        )
      }
      <Button onClick={resetUrlInput}>Shorten another URL</Button>
    </Box>
  );
};

export default UrlResult;
