import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import QrCodeIcon from "@mui/icons-material/QrCode";
import QrCodeCard from "../../QrCodeCard/QrCodeCard";
import { qrCodeToBase64 } from "../../../utils/qrCodeToBase64";

const QrCodeDisplay = ({ qrCodeData, viewQrCode, toggleQrCode }) => {
  const base64QrCode = qrCodeToBase64(qrCodeData);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box>
        {viewQrCode && (
          <Box display="flex" justifyContent="center" position="relative">
            <Tooltip title="View QR Code">
              <QrCodeCard imageUrl={base64QrCode} />
            </Tooltip>
          </Box>
        )}
        <Tooltip title={viewQrCode ? 'Hide QR Code' : 'View QR Code'}>
          <IconButton onClick={toggleQrCode}>
            <QrCodeIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Grid>
  );
};

export default QrCodeDisplay;
