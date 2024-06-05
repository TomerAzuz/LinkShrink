import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CopyLink from '../../../../components/CopyLink/CopyLink';

const UnshortenUrlResult = ({ result, resetUrlInput }) => {
  const originalUrl = result.data?.url || "";

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" align="center" gutterBottom mt={2}>
        URL Unshortener Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        The original URL is:
      </Typography>
      <CopyLink url={originalUrl} variant="h6" />
      <Button onClick={resetUrlInput}>
        <Typography variant="button">Unshorten another URL</Typography>
      </Button>
    </Box>
  );
};

export default UnshortenUrlResult;