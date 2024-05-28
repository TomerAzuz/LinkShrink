import React from "react";
import { useNavigate } from "react-router-dom";
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

const ResetCodeSchema = Yup.object().shape({
  resetCode: Yup.string()
    .required("Reset code is required")
});

const VerifyResetCode = () => {
  const navigate = useNavigate();
  const { verifyResetCode, loading } = useAuth();

  const handleVerifyResetCode = async (values, setStatus, resetForm) => {
    try {
      setStatus(null);
      const response = await verifyResetCode(values.resetCode, setStatus);
      if (response) {
        navigate("/reset-password");
      }
      resetForm();
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Verify password reset code
        </Typography>
        <Formik
          initialValues={{ resetCode: "" }}
          validationSchema={ResetCodeSchema}
          onSubmit={async (values, { setStatus, resetForm }) => 
            await handleVerifyResetCode(values, setStatus, resetForm)}
        >
          {({ isSubmitting, status }) => (
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
                    Verify code
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

export default VerifyResetCode;