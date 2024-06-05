import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import GetAppIcon from "@mui/icons-material/GetApp";

const QrCodeCard = ({ imageUrl, size }) => {

  const downloadQrCode = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qrCode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sizes = {
    small: { width: 150, height: 150 },
    medium: { width: 200, height: 200 },
  };

  const qrSize = sizes[size] || sizes.medium;

  return (
    <Box display="flex" 
         justifyContent="center" 
         alignItems="center" 
         flexDirection={size === "medium" ? "column" : "row"}
    >
      <Card sx={{ width: qrSize.width, height: qrSize.height }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt="QR Code"
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Card>
      <Tooltip title="Download QR Code">
        <IconButton onClick={downloadQrCode} sx={{ color: "black", fontSize: 30 }}>
          <GetAppIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default QrCodeCard;
