import React, { useState } from "react";
import { toast } from 'react-hot-toast';
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import RedditIcon from "@mui/icons-material/Reddit";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { qrCodeToBase64 } from "../../../../utils/qrCodeToBase64";
import QrCodeCard from "../../../../components/QrCodeCard/QrCodeCard";
import CopyLink from "../../../../components/CopyLink/CopyLink";
import SocialShareButtons from "../../../../components/SocialShareButtons/SocialShareButtons";

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
      <QrCodeCard imageUrl={imageUrl}/>
      <CopyLink url={shortUrl} />
      <SocialShareButtons shortUrl={shortUrl} />
      <Button onClick={resetUrlInput}>Shorten another URL</Button>
    </Box>
  );
};

export default ShortenedUrlResult;