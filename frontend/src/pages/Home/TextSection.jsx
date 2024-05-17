import { Box, Typography } from "@mui/material";

const TextSection = () => (
  <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
    <Typography 
      variant="h1"
      sx={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        color: "#fff",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      LinkShrink
    </Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      Enter a URL below to shrink a URL or generate a QR code.
    </Typography>
  </Box>
);

export default TextSection;

