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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
});

const Login = () => {
  const { login, user, loading } = useAuth();

  const handleLogin = async (values, resetForm) => {
    try {
      await login(values);
      const successMessage = user && user.fullName ? `Hello ${user.fullName}!` : "Logged in";
      toast.success(successMessage);
    } catch (error) {
      console.log(error);
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
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Welcome back
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { resetForm }) => 
            await handleLogin(values, resetForm)}
        >
          {({ isSubmitting }) => (
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
                <Grid item xs={12} 
                  container 
                  direction="column" 
                  alignItems="center" 
                  spacing={2}
                >
                <Grid item>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Typography align="center" component={Link} to="/forgot">
                    Forgot password?
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="center">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Form>
          )}
        </Formik>        
        <Grid item xs={12}>
          {loading && <Loader />}
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
