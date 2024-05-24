import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Logo = () => (
  <Box>
    <Typography 
      variant="h1"
      sx={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        color: "#fff",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        userSelect: 'none',
        padding: '10px'
      }}
    >
      LinkShrink
    </Typography>
  </Box>
);

export default Logo;