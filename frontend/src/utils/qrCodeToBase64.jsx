export const qrCodeToBase64 = (qrCodeData) => {
  return `data:image/png;base64,${qrCodeData}`;
};