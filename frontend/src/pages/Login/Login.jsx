import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import { useAuth } from '../../AuthContext';
import FormField from '../../components/FormField/FormField';
import AuthButton from '../../components/Buttons/AuthButton';
import Title from '../../components/Title/Title';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const { login, user } = useAuth();

  const handleLogin = async (values, resetForm) => {
    try {
      await login(values);
      const successMessage =
        user && user.fullName ? `Hello ${user.fullName}!` : 'Logged in!';
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unexpected error');
    } finally {
      resetForm();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 7rem)',
      }}
    >
      <Box textAlign="center" width="100%">
        <Title text={'Welcome back'} />
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { resetForm }) =>
            await handleLogin(values, resetForm)
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={1} justifyContent="center">
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
                  <AuthButton
                    type="submit"
                    text="Login"
                    disabled={isSubmitting}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    align="center"
                    component={Link}
                    to="/forgot"
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Forgot password?
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography align="center">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      style={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
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
