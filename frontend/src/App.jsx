import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css"
import PrivateRoute from "./routes/PrivateRoute";
import CustomRoute from "./routes/CustomRoute";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "./AuthContext";
import MyLinks from "./pages/MyLinks/MyLinks";
import Analytics from "./pages/Analytics/Analytics";
import ActivateAccount from "./pages/ActivateAccount/ActivateAccount";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import VerifyResetCode from "./pages/VerifyResetCode/VerifyResetCode";
import ResetPassword from "./pages/PasswordReset/ResetPassword";

const App = () => (
  <>
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<CustomRoute component={Signup} />} />
          <Route path="/login" element={<CustomRoute component={Login} />} />
          <Route path="/forgot" element={<CustomRoute component={ForgotPassword} />} />
          <Route path="/verify-code" element={<CustomRoute component={VerifyResetCode} />} />
          <Route path="/reset-password" element={<CustomRoute component={ResetPassword} />} />
          <Route path="/activate" element={<CustomRoute component={ActivateAccount} />} />
          <Route path="/my-links" element={<PrivateRoute component={MyLinks} />} />
          <Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
          <Route path="/" element={<PrivateRoute component={Home} />} />
        </Routes>
      </AuthProvider>
    </Router>
  </>
);

export default App;
