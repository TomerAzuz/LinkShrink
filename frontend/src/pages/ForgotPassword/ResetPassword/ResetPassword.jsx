import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../../AuthContext";
import FormField from "../../../components/FormField/FormField";
import Loader from "../../../components/Loader/Loader";
import AuthButton from '../../../components/Buttons/AuthButton';
import Title from "../../../components/Title/Title";

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

  const handleResetPassword = async (values, { resetForm }) => {
    try {
      const response = await resetPassword(values);
      if (response) {
        navigate("/login");
        toast.success("Password was reset successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error");
    } finally {
      resetForm();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Title text={"Reset password"}/>
        <Formik
          initialValues={{ email: "", password: "", confirmPassword: "" }}
          validationSchema={ResetPasswordSchema}
          onSubmit={async (values, actions) => await handleResetPassword(values, actions)}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2} justifyContent="center">
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
                <Grid item xs={12} container direction="column" alignItems="center">
                  <AuthButton 
                    type="submit" 
                    text="Reset password" 
                    disabled={isSubmitting} 
                    sx={{ width: '100%' }}
                  />
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
