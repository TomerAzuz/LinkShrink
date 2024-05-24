import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { useAuth } from '../../AuthContext';
import FormField from '../../components/FormField/FormField';
import Loader from '../../components/Loader/Loader';
import { AUTH_LOGIN } from '../../constants/urlConstants';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required')
});

const Login = () => {
  const { login, loading } = useAuth();

  const handleLogin = async (values, setStatus) => {
    try {
      setStatus(null);
      await login(values, AUTH_LOGIN);
    } catch (error) {
      setStatus(error.message);
    }
  };
  
  return (
    <Container maxWidth='sm'>
      <Box mt={8}>
        <Typography variant='h4' align='center' gutterBottom>
          Log In
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setStatus }) => await handleLogin(values, setStatus)}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field 
                    name="email" 
                    label="Email" 
                    type="email" 
                    autocomplete="email" 
                    component={FormField} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field 
                    name="password" 
                    label="Password"  
                    type="password" 
                    autocomplete="current-password" 
                    component={FormField} 
                  />
                </Grid>
                <Grid item xs={12}>
                  {status && <Typography color="error">Error: Authetication failed</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isSubmitting}
                  >
                    Login
                  </Button>
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

export default Login;