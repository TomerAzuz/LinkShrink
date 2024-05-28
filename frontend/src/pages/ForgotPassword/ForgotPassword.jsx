import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../AuthContext";
import FormField from "../../components/FormField/FormField";


const PasswordResetSchema = Yup.object().shape({
  email: Yup.string()
  .email("Invalid email")
  .required("Email is required")
});

const ForgotPassword = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { requestResetCode } = useAuth();

  const handleForgotPassword = async (values, setStatus, resetForm) => {
    try {
      setStatus(null);
      const response = await requestResetCode(values.email, setStatus);
      if (response) {
        setIsCodeSent(true);
        resetForm();
      }
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Container maxWidth="sm" 
      sx={{ 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box textAlign="center" width="100%" mt={12}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Reset your password
        </Typography>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={PasswordResetSchema}
          onSubmit={async (values, { setStatus, resetForm }) => 
            await handleForgotPassword(values, setStatus, resetForm)}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <Grid container mt={2}>
              {isCodeSent ? (
                  <Grid item xs={12}>
                    <Box display="flex"  justifyContent="center" alignItems="center">
                      <Typography variant="body1" fontWeight="bold" gutterBottom>Code sent successfully</Typography>
                      <Button 
                        variant="contained" 
                        sx={{ margin: 4 }} 
                        onClick={() => setIsCodeSent(false)}
                      >
                        Resend code
                      </Button>
                      <Button 
                        variant="contained" 
                        sx={{ margin: 4 }} 
                        component={Link} 
                        to="/verify-code"
                      >
                        Verify code
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                  <>
                  <Typography variant="body1" align="center" mb={4}>
                    Enter your email address and we will send you instructions to reset your password.
                  </Typography>
                    <Grid item xs={12}>
                      <Field 
                        name="email" 
                        label="Email address" 
                        type="email" 
                        autoComplete="email" 
                        component={FormField} 
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {status && <Typography color="error">{status}</Typography>}
                    </Grid>
                      <Grid item xs={12} mt={2} container direction="column" alignItems="center">
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting}
                      >
                        Reset Password
                      </Button>
                    </Grid>           
                  </>)}
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ForgotPassword;