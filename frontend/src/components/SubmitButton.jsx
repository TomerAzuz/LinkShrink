import { Button } from "@mui/material";

const SubmitButton = ({ onClick, title }) => (
  <Button 
    type="submit" 
    variant="contained" 
    onClick={onClick} 
    sx={{ margin: 1 }}
  >
    {title}
  </Button>
);

export default SubmitButton;