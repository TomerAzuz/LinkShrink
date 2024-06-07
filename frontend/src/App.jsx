import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import "./App.css"
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "./AuthContext";
import MyLinks from "./pages/MyLinks/MyLinks";
import Analytics from "./pages/Analytics/Analytics";
import ActivateAccount from "./pages/ActivateAccount/ActivateAccount";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound/NotFound";

const App = () => (
  <Router>
    <AuthProvider>
      <>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/activate" element={<ActivateAccount />} />
          <Route path="/mylinks" element={<PrivateRoute component={MyLinks} />} />
          <Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
          <Route path="/" element={<PrivateRoute component={Home} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </AuthProvider>
  </Router>
);

export default App;
