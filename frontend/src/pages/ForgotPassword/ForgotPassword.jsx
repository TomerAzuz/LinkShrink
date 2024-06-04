import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import RequestResetCodeForm from "./RequestResetCodeForm/RequestResetCodeForm";
import VerifyResetCode from "./VerifyResetCode/VerifyResetCode";
import ResetPassword from "./ResetPassword/ResetPassword";

const ForgotPassword = () => {
  const [step, setStep] = useState(0);

  switch (step) {
    case 0: 
      return <RequestResetCodeForm step={step} setStep={setStep}/>;
    case 1: 
      return <VerifyResetCode step={step} setStep={setStep} />
    case 2:
      return <ResetPassword />;
    default:
      return <Navigate to="/landing" />
  }
};

export default ForgotPassword;