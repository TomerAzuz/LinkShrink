import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import RequestResetCodeForm from "./RequestResetCodeForm/RequestResetCodeForm";
import VerifyResetCode from "./VerifyResetCode/VerifyResetCode";
import ResetPassword from "./ResetPassword/ResetPassword";

const steps = ['Request password reset code', 'Verify reset code', 'Reset password'];

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState(0);

  const renderStepContent = (step) => {
    switch (step) {
      case 0: 
        return <RequestResetCodeForm step={activeStep} setStep={setActiveStep}/>;
      case 1: 
        return <VerifyResetCode step={activeStep} setStep={setActiveStep}/>;
      case 2:
        return <ResetPassword />;
      default:
        return <Navigate to="/landing" />;
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={8}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps  = {};
            const labelProps = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {renderStepContent(activeStep)}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
