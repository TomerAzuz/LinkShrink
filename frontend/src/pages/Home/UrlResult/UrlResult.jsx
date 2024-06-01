import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import RedditIcon from "@mui/icons-material/Reddit";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { qrCodeToBase64 } from "../../../utils/qrCodeToBase64";

const UrlResult = ({ result, resetUrlInput }) => {
  const [copied, setCopied] = useState(false);
  
  const shortUrl = result.data?.shortUrl || "";
  const shortCode = shortUrl?.substring(shortUrl.lastIndexOf("/") + 1) || "";
  const imageUrl = qrCodeToBase64(result?.data?.qrCodeData) || "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnSocial = (network) => {
    switch (network) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`);
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shortUrl)}`);
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shortUrl)}`);
        break;
      case "reddit":
        window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shortUrl)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(shortUrl)}`);
        break;
      default:
        break;
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" align="center" gutterBottom mt={2}>
        URL Shortener Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Your URL has been successfully shortened. 
        You can now copy it, share it on social media, or use the QR code provided.
      </Typography>
      <Card sx={{ width: '100%', maxWidth: 200 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="QR Code"
          sx={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </Card>
      <Typography variant="h6" m={2}>
        <Link href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
          {shortUrl}
        </Link>
        <Tooltip title="Copy to clipboard">
          <IconButton onClick={handleCopyLink}>
            {copied ? <CheckIcon sx={{ color: "green" }} /> : <ContentCopyIcon />}
          </IconButton>
        </Tooltip>
      </Typography>
      <Box display="flex" justifyContent="center" flexDirection="column" mt={4} mb={4}>
        <Box display="flex" justifyContent="center">
          <Tooltip title="Share on Facebook">
            <IconButton onClick={() => shareOnSocial("facebook")} sx={{ color: "#3b5998", fontSize: 40 }}>
              <FacebookIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on WhatsApp">
            <IconButton onClick={() => shareOnSocial("whatsapp")} sx={{ color: "#25D366", fontSize: 40 }}>
              <WhatsAppIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Telegram">
            <IconButton onClick={() => shareOnSocial("telegram")} sx={{ color: "#0088cc", fontSize: 40 }}>
              <TelegramIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Reddit">
            <IconButton onClick={() => shareOnSocial("reddit")} sx={{ color: "#FF5700", fontSize: 40 }}>
              <RedditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on LinkedIn">
            <IconButton onClick={() => shareOnSocial("linkedin")} sx={{ color: "#0e76a8", fontSize: 40 }}>
              <LinkedInIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Button onClick={resetUrlInput}>Shorten another URL</Button>
    </Box>
  );
};

export default UrlResult;
