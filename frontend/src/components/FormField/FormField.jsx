import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormField = ({ label, type, field, form, autoComplete }) => {
  const { name } = field;
  const { touched, errors } = form;
  const errorText = touched[name] && errors[name];

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box>
      <TextField 
        {...field}
        label={label}
        type={showPassword ? "text" : type}
        error={!!errorText}
        helperText={errorText}
        variant='outlined'
        fullWidth
        margin="normal"
        autoComplete={autoComplete}
        InputProps={{
          endAdornment: type === 'password' && (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default FormField;
