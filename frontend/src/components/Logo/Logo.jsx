import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from '@mui/material/styles';

const Logo = ({size, isRedirect = false}) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography 
        variant="h1"
        sx={{ 
          fontSize: size.md,
          fontWeight: "bold",
          color: "#fff",
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: 'none',
          padding: '10px',
          '@media (max-width: 768px)': {
            fontSize: size.xs,
          }
        }}
      >
        {isRedirect ? <Link to="/">LinkShrink</Link> : "LinkShrink"}
      </Typography>
    </Box>
  );
};

export default Logo;
