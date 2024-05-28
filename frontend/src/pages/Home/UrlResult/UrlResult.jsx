import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { qrCodeToBase64 } from '../../../utils/qrCodeToBase64';

const UrlResult = ({ urlMapping, resetUrlInput }) => {
  const [copied, setCopied] = useState(false);
  const shortUrl = urlMapping?.data?.shortUrl;
  const shortCode = shortUrl && shortUrl.substring(shortUrl.lastIndexOf("/") + 1);
  const isQRCode = !!urlMapping?.data?.qrCodeData;

  const imageUrl = isQRCode ? qrCodeToBase64(urlMapping.data.qrCodeData) : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnSocial = (network) => {
    switch(network) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shortUrl)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`);
        break;
      case 'reddit':
        window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shortUrl)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shortUrl)}`);
        break;
      default:
        break;
    }
  };

  return (
    <Box display='flex' flexDirection='column' m={2}>
      {urlMapping && (
        <Box>
          {isQRCode ? (
            <Card>
              <CardMedia
                component="img"
                image={imageUrl}
                alt="QR Code"
              />
            </Card>
          ) : (
            <Typography variant='h6' m={2}>
              <Link href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </Link>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={handleCopyLink}>
                  {copied ? <CheckIcon sx={{ color: "green" }} /> : <ContentCopyIcon />}
                </IconButton>
              </Tooltip>
            </Typography>
          )}
          <Box display="flex" justifyContent="center" flexDirection="column" mt={4} mb={4}>
            <Typography variant="h6" align="center">
              Share it on social networks
            </Typography>
            <Box display="flex" justifyContent="center">
              <IconButton onClick={() => shareOnSocial('facebook')}><FacebookIcon /></IconButton>
              <IconButton onClick={() => shareOnSocial('whatsapp')}><WhatsAppIcon /></IconButton>
              <IconButton onClick={() => shareOnSocial('telegram')}><TelegramIcon /></IconButton>
              <IconButton onClick={() => shareOnSocial('reddit')}><RedditIcon /></IconButton>
              <IconButton onClick={() => shareOnSocial('linkedin')}><LinkedInIcon /></IconButton>
            </Box>
          </Box>
        </Box>
      )}
      <Button onClick={resetUrlInput}>Shorten another URL</Button>
    </Box>
  );
};

export default UrlResult;
