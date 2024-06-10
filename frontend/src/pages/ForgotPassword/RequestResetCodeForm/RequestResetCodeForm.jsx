import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../../AuthContext";
import FormField from "../../../components/FormField/FormField";
import AuthButton from '../../../components/Buttons/AuthButton';
import Title from "../../../components/Title/Title";

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
        <Title text={"Reset your password"}/>
        <Typography variant="body1" align="center" gutterBottom>
          Enter your email address below, and we'll send you instructions on how to reset your password. 
          If you don't receive an email, please check your spam folder or request a new code.
        </Typography>
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
                      <AuthButton 
                        type="submit" 
                        text="Resend code" 
                        onClick={() => setIsCodeSent(false)}
                        disabled={isSubmitting} 
                        m={1}
                      />
                      <AuthButton 
                        type="submit" 
                        to="/verify"
                        text="Verify code" 
                        disabled={isSubmitting} 
                        m={1}
                      />
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
                  <Grid item xs={12} mt={2} container direction="column" alignItems="center">
                    <AuthButton 
                      type="submit" 
                      text="Reset password" 
                      onClick={() => setIsCodeSent(false)}
                      disabled={isSubmitting} 
                      m={1}
                      />
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