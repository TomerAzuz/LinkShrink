import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from '@mui/material/styles';

const Logo = () => {
  const theme = useTheme();
  
  return (
    <Box minWidth="150px">
      <Typography 
        variant="h1"
        sx={{ 
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#fff",
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: 'none',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        <Link to="/">LinkShrink</Link>
      </Typography>
    </Box>
  );
};

export default Logo;
