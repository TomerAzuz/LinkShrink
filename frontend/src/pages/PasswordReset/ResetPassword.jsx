import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../AuthContext";
import FormField from "../../components/FormField/FormField";
import Loader from "../../components/Loader/Loader";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .max(16, "Password can contain at most 16 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Password confirmation is required"),
});

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (values, { setStatus, resetForm }) => {
    try {
      setStatus(null);
      const response = await resetPassword(values, setStatus);
      if (response) {
        navigate("/login");
      }
      resetForm();
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Reset password
        </Typography>
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={async (values, actions) => await handleResetPassword(values, actions)}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <Grid container justifyContent="center">
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
                  <Field 
                    name="password" 
                    label="Password" 
                    type="password" 
                    autoComplete="current-password" 
                    component={FormField} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field 
                    name="confirmPassword" 
                    label="Confirm password" 
                    type="password" 
                    autoComplete="new-password" 
                    component={FormField} 
                  />
                </Grid>
                <Grid item xs={12}>
                  {status && <Typography color="error">Error: Password reset failed</Typography>}
                </Grid>
                <Grid item xs={12} container direction="column" alignItems="center" spacing={2}>
                  <Grid item>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={isSubmitting}
                    >
                      Reset password
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {loading && <Loader />}
                </Grid>
              </Grid>            
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ResetPassword;
