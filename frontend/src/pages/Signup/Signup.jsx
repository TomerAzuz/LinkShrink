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
import { AUTH_SIGNUP } from '../../constants/urlConstants';

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .max(64, 'Name can contain at most 64 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must contain at least 8 characters')
    .required('Password is required')
});

const Signup = () => {
  const { login, loading } = useAuth();

  const handleSignup = async (values, setStatus) => {
    try {
      setStatus(null);
      await login(values, AUTH_SIGNUP);
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box mt={8}>
        <Typography variant='h4' align='center' gutterBottom>
          Sign Up
        </Typography>
        <Formik
          initialValues={{ fullName: '', email: '', password: '' }}
          validationSchema={SignUpSchema}
          onSubmit={async (values, { setStatus }) => await handleSignup(values, setStatus)}
        >
          {({ isSubmitting, status }) => (
            <Form>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Field 
                    name="fullName" 
                    label="Full Name" 
                    autoComplete="name" 
                    component={FormField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field 
                    name="email" 
                    label="Email" 
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
                  {status && <Typography color="error">{status}</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={isSubmitting}
                  >
                    Sign Up
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

export default Signup;
