import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const FormField = ({ label, type, field, form, autoComplete }) => {
  const { name } = field;
  const { touched, errors } = form;
  const errorText = touched[name] && errors[name];

  return (
    <Box height={88}>
      <TextField 
        {...field}
        label={label}
        type={type}
        error={!!errorText}
        helperText={errorText}
        variant='outlined'
        fullWidth
        margin="normal"
        autoComplete={autoComplete}
      />
    </Box>
  );
};

export default FormField;
