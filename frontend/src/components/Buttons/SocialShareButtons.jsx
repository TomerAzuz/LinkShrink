import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const SocialShareButtons = ({ shortUrl }) => {
  const shareOnSocial = (network) => {
    switch (network) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`
        );
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shortUrl)}`);
        break;
      case 'telegram':
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`
        );
        break;
      case 'reddit':
        window.open(
          `https://www.reddit.com/submit?url=${encodeURIComponent(shortUrl)}`
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shortUrl)}`
        );
        break;
      default:
        break;
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      mt={4}
      mb={4}
    >
      <Box display="flex" justifyContent="center">
        <Tooltip title="Share on Facebook">
          <IconButton
            onClick={() => shareOnSocial('facebook')}
            sx={{ color: '#3b5998', fontSize: 40 }}
          >
            <FacebookIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on WhatsApp">
          <IconButton
            onClick={() => shareOnSocial('whatsapp')}
            sx={{ color: '#25D366', fontSize: 40 }}
          >
            <WhatsAppIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on Telegram">
          <IconButton
            onClick={() => shareOnSocial('telegram')}
            sx={{ color: '#0088cc', fontSize: 40 }}
          >
            <TelegramIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on Reddit">
          <IconButton
            onClick={() => shareOnSocial('reddit')}
            sx={{ color: '#FF5700', fontSize: 40 }}
          >
            <RedditIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share on LinkedIn">
          <IconButton
            onClick={() => shareOnSocial('linkedin')}
            sx={{ color: '#0e76a8', fontSize: 40 }}
          >
            <LinkedInIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SocialShareButtons;
