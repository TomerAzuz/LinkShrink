import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Activate Account
        </Typography>
        <Formik
          initialValues={{ activationCode: "" }}
          validationSchema={ActivateAccountSchema}
          onSubmit={async (values, { setStatus }) => await activateAccount(values.activationCode, setStatus)}
        >
          {({ isSubmitting, status }) => (
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
                <Grid item xs={12}>
                  {status && <Typography color="error">{status}</Typography>}
                </Grid>
                {loading && <Loader />}
                <Grid item xs={12}>
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