import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <Box>
      <Typography 
        variant="h1"
        sx={{ 
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#fff",
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: 'none',
          padding: '10px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}
      >
        LinkShrink
      </Typography>
    </Box>
  );
};

export default Logo;
