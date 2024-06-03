import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useAuth } from "../../AuthContext";
import FormField from "../../components/FormField/FormField";
import Loader from "../../components/Loader/Loader";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .max(64, "Name can contain at most 64 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .max(16, "Password can contain at most 16 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Password confirmation is required")
});

const Signup = () => {
  const { register, loading } = useAuth();

  const handleSignup = async (values) => {
    try {
      await register(values);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Create an account
        </Typography>
        <Formik
          initialValues={{ fullName: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={SignUpSchema}
          onSubmit={async (values) => await handleSignup(values)}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container justifyContent="center">
                <Grid item xs={12}>
                  <Field 
                    name="fullName" 
                    label="Full name" 
                    autoComplete="name" 
                    component={FormField}
                  />
                </Grid>
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
                <Grid item xs={12} container direction="column" alignItems="center" spacing={2}>
                  <Grid item m={2}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={isSubmitting}
                    >
                      Sign up
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography align="center">
                      Already have an account? <Link to="/login">Login</Link>
                    </Typography>
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

export default Signup;
