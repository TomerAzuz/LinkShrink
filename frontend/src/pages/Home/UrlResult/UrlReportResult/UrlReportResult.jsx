import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

import ResultButton from "../../../../components/Buttons/ResultButton";

const UrlReportResult = ({ result, resetUrlInput }) => {
  const theme = useTheme();
  const reportStatus = result.status === 201 
    ? "Report submitted successfully ✅" 
    : "Failed to submit report. Please try again.";
  
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
        Report URL Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        {reportStatus}
      </Typography>
      <ResultButton onClick={resetUrlInput}>
        Report another URL
      </ResultButton>
    </Box>
  );
};

export default UrlReportResult;
