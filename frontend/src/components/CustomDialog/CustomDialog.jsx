import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from '@mui/material/styles';

const CustomDialog = ({ isOpen, setIsOpen, onClick, title, text, buttonText }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      disableScrollLock={true}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: theme.palette.background.paper,
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">
          {text}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)} sx={{ color: theme.palette.primary.main }}>
          <Typography variant="button">Cancel</Typography>
        </Button>
        <Button onClick={onClick} sx={{ color: theme.palette.primary.main }}>
          <Typography variant="button">{buttonText}</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
