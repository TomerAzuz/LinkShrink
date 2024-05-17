import React, { useState } from "react";
import { Box, TextField } from "@mui/material";

import SubmitButton from "../../components/SubmitButton";

const URLInput = () => {
  const [url, setUrl] = useState('');

  const handleShrinkSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted: ', url);
  };

  const handleQRCodeSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted QR: ', url);
  };

  const handleChange = (event) => {
    setUrl(event.target.value);
  };

  return (
    <Box sx={{ width: '70%', textAlign: 'center' }}>
      <form>
        <TextField 
          id="url-input" 
          label="Insert URL" 
          variant="outlined"
          fullWidth
          value={url}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <SubmitButton onClick={handleShrinkSubmit} title={'Shrink URL'}/>
        <SubmitButton onClick={handleQRCodeSubmit} title={'Generate QR Code'}/>
      </form>
    </Box>
  );
};

export default URLInput;