import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import GetAppIcon from "@mui/icons-material/GetApp";

const QrCodeCard = ({ imageUrl }) => {

  const downloadQrCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeImageUrl;
    link.download = "qrCode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Card sx={{ width: "100%", maxWidth: 250 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="QR Code"
          sx={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </Card>
      <Tooltip title="Download QR Code">
        <IconButton onClick={downloadQrCode} sx={{ color: "black", fontSize: 25 }}>
          <GetAppIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default QrCodeCard;