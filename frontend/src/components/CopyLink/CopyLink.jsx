import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const CopyLink = ({ url, variant }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Typography 
      variant={variant} 
      color="inherit" 
      underline="always"
      sx={{ 
        textOverflow: "ellipsis",
        whiteSpace: "noWrap"
      }}
    >
      <Link href={url} target="_blank" rel="noopener noreferrer">
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
