import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../../AuthContext";
import FormField from "../../../components/FormField/FormField";

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string()
  .email("Invalid email")
  .required("Email is required")
});

const RequestResetCodeForm = ({ step, setStep }) => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { requestResetCode } = useAuth();

  const handleForgotPassword = async (values, resetForm) => {
    try {
      const response = await requestResetCode(values.email);
      if (response) {
        setStep(step + 1);
        setIsCodeSent(true);
        toast.success("Reset code sent successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error");
    } finally {
      resetForm();
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
        <Typography variant="body1" align="center" paragraph>
          Enter your email address below, and we'll send you instructions on how to reset your password. 
          If you don't receive an email, please check your spam folder or request a new code.
        </Typography>
        {isCodeSent && (
          <Typography fontWeight="bold" variant="body1" align="center" color="success" paragraph>
              A reset code has been sent to your email!
          </Typography>
        )}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={PasswordResetSchema}
          onSubmit={async (values, { resetForm }) => 
            await handleForgotPassword(values, resetForm)}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container mt={2}>
              {isCodeSent ? (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Button 
                        variant="contained" 
                        sx={{ margin: 1 }}
                        onClick={() => setIsCodeSent(false)}
                      >
                        Resend code
                      </Button>
                      <Button 
                        variant="contained" 
                        sx={{ margin: 1 }}
                        component={Link} 
                        to="/verify"
                      >
                        Verify code
                      </Button>
                    </Box>
                  </Grid>
                ) : (
                <>
                  <Grid item xs={12}>
                    <Field 
                      name="email" 
                      label="Email address" 
                      type="email" 
                      autoComplete="email" 
                      component={FormField} 
                    />
                  </Grid>
                  <Grid item xs={12} 
                    mt={2} 
                    container 
                    direction="column" 
                    alignItems="center"
                  >
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

export default RequestResetCodeForm;