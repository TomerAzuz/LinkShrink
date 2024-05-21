import React from 'react';

const QRCode = ({ qrCodeImage }) => {
  const imageUrl = `data:image/png;base64,${qrCodeImage}`;
  return <img src={imageUrl} alt="QR Code" />;
};

export default QRCode;
