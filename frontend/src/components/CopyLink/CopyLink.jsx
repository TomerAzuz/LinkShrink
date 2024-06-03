import React, { useState } from 'react';
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const CopyLink = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const shortCode = url?.substring(url.lastIndexOf("/") + 1) || "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Typography variant="h6" m={2}>
      <Link href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
        {url}
      </Link>
      <Tooltip title="Copy to clipboard">
        <IconButton onClick={handleCopyLink}>
          {copied ? <CheckIcon sx={{ color: "green" }} /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>
    </Typography>
  );
};

export default CopyLink;
