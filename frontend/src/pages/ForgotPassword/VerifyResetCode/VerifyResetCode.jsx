import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import FormField from "../../../components/FormField/FormField";
import Loader from "../../../components/Loader/Loader";
import { useAuth } from "../../../AuthContext";

const ResetCodeSchema = Yup.object().shape({
  resetCode: Yup.string()
    .required("Reset code is required")
});

const VerifyResetCode = ({ step, setStep }) => {
  const navigate = useNavigate();
  const { verifyResetCode, loading } = useAuth();

  const handleVerifyResetCode = async (values, resetForm) => {
    try {
      const response = await verifyResetCode(values.resetCode);
      if (response) {
        setStep(step + 1);
        toast.success("Reset code verified");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error");
    } finally {
      resetForm();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Verify password reset code
        </Typography>
        <Formik
          initialValues={{ resetCode: "" }}
          validationSchema={ResetCodeSchema}
          onSubmit={async (values, { resetForm }) => 
            await handleVerifyResetCode(values, resetForm)}
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
                {loading && <Loader />}
                <Grid item xs={12} container direction="column" alignItems="center">
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