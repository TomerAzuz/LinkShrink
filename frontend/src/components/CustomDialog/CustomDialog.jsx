import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const CustomDialog = ({ isOpen, setIsOpen, onClick, title, text }) => (
  <Dialog
    open={isOpen}
    onClose={() => setIsOpen(false)}
    disableScrollLock={true}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography variant="subtitle1">
        {text}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button onClick={onClick}>Delete</Button>
    </DialogActions>
  </Dialog>
);

export default CustomDialog;