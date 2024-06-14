import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useAuth } from '../../../AuthContext';
import FormField from '../../../components/FormField/FormField';
import AuthButton from '../../../components/Buttons/AuthButton';
import Title from '../../../components/Title/Title';

const ResetCodeSchema = Yup.object().shape({
  resetCode: Yup.string().required('Reset code is required'),
});

const VerifyResetCode = ({ step, setStep }) => {
  const { verifyResetCode } = useAuth();

  const handleVerifyResetCode = async (values, resetForm) => {
    try {
      const response = await verifyResetCode(values.resetCode);
      if (response) {
        setStep(step + 1);
        toast.success('Reset code verified');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unexpected error');
    } finally {
      resetForm();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Title text={'Verify password reset code'} />
        <Typography variant="body1" align="center" gutterBottom>
          Please enter the reset code you received in your email below to verify
          your identity and proceed with resetting your password.
        </Typography>
        <Formik
          initialValues={{ resetCode: '' }}
          validationSchema={ResetCodeSchema}
          onSubmit={async (values, { resetForm }) =>
            await handleVerifyResetCode(values, resetForm)
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Field
                    name="resetCode"
                    label="Password reset code"
                    type="text"
                    autoComplete="off"
                    component={FormField}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  direction="column"
                  alignItems="center"
                >
                  <AuthButton
                    type="submit"
                    text="Verify code"
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

export default VerifyResetCode;
