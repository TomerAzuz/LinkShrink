import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import FormField from "../../components/FormField/FormField";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../AuthContext";

const ActivateAccountSchema = Yup.object().shape({
  activationCode: Yup.string()
    .required("Activation code is required")
});

const ActivateAccount = () => {
  const { activateAccount, loading } = useAuth();

  const handleActivate = async (activationCode, resetForm) => {
    try {
      await activateAccount(activationCode);
      toast.success("Account activated");
    } catch (error) {
      console.log(error);
      toast.error("Account activation failed");
    } finally {
      resetForm();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Activate Account
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Please enter the activation code sent to your email to activate your account. 
          If you haven't received the code, check your spam folder or request a new code.
        </Typography>
        <Formik
          initialValues={{ activationCode: "" }}
          validationSchema={ActivateAccountSchema}
          onSubmit={async (values, { resetForm }) => 
            await handleActivate(values.activationCode, resetForm)}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <Field
                    name="activationCode"
                    label="Activation Code"
                    type="text"
                    autoComplete="off"
                    component={FormField}
                  />
                </Grid>
                {loading && <Loader />}
                <Grid item xs={12} container direction="column" alignItems="center">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Activate
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ActivateAccount;