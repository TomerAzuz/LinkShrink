import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { qrCodeToBase64 } from '../../../../utils/qrCodeToBase64';
import QrCodeCard from '../../../../components/QrCodeCard/QrCodeCard';
import CopyLink from '../../../../components/CopyLink/CopyLink';
import SocialShareButtons from '../../../../components/Buttons/SocialShareButtons';
import ResultButton from '../../../../components/Buttons/ResultButton';

const ShortenedUrlResult = ({ result, resetUrlInput }) => {
  const theme = useTheme();
  const shortUrl = result.data?.shortUrl || '';
  const imageUrl = qrCodeToBase64(result?.data?.qrCodeData) || '';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        bgcolor: theme.palette.background.paper,
        p: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      <Typography variant="h4" align="center" gutterBottom mt={2}>
        URL Shortener Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Your URL has been successfully shortened. You can now copy it, share it
        on social media, or use the QR code provided.
      </Typography>
      <Box m={4}>
        <QrCodeCard imageUrl={imageUrl} size="medium" />
      </Box>
      <Box>
        <CopyLink url={shortUrl} variant="h6" />
      </Box>
      <SocialShareButtons shortUrl={shortUrl} />
      <ResultButton onClick={resetUrlInput}>Shorten another URL</ResultButton>
    </Box>
  );
};

export default ShortenedUrlResult;
