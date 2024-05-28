import React from "react";
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
import Loader from "../../components/Loader/Loader";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .max(16, "Password can contain at most 16 characters")
    .required("Password is required")
});

const Login = () => {
  const { login, loading } = useAuth();

  const handleLogin = async (values, setStatus) => {
    try {
      setStatus(null);
      await login(values, setStatus);
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Welcome back
        </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setStatus }) => await handleLogin(values, setStatus)}
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
                    {status && <Typography color="error">Error: Authentication failed</Typography>}
                  </Grid>
                  <Grid item xs={12} container direction="column" alignItems="center" spacing={2}>
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
                  </Grid>
                  <Grid item xs={12}>
                    {loading && <Loader />}
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
