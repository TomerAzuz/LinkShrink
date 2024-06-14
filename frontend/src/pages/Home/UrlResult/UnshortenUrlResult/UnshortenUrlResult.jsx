import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CopyLink from '../../../../components/CopyLink/CopyLink';
import ResultButton from '../../../../components/Buttons/ResultButton';

const UnshortenUrlResult = ({ result, resetUrlInput }) => {
  const theme = useTheme();
  const originalUrl = result.data?.url || '';

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
        Original URL Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        The original URL is:
      </Typography>
      <CopyLink url={originalUrl} variant="h6" />
      <ResultButton onClick={resetUrlInput}>Unshorten another URL</ResultButton>
    </Box>
  );
};

export default UnshortenUrlResult;
