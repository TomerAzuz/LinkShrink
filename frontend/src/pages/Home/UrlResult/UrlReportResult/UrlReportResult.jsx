import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const UrlReportResult = ({ result, resetUrlInput }) => {
  const reportStatus = result.status === 201 
    ? "Report submitted successfully" 
    : "Failed to submit report. Please try again.";
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" align="center" gutterBottom mt={2}>
        Report Malicious URL Result
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        {reportStatus}
      </Typography>
      <Button onClick={resetUrlInput}><Typography variant="button">Report another URL</Typography></Button>
    </Box>
  );
};

export default UrlReportResult;