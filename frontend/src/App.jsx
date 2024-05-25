import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css'
import PrivateRoute from './routes/PrivateRoute';
import CustomRoute from './routes/CustomRoute';
import Home from './pages/Home/Home';
import RedirectPage from './pages/RedirectPage/RedirectPage';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import AuthProvider from './AuthContext';
import MyLinks from './pages/MyLinks/MyLinks';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';

const App = () => (
  <>
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<CustomRoute component={Signup} />} />
          <Route path='/login' element={<CustomRoute component={Login} />} />
          <Route path='/:shortCode' element={<RedirectPage/> }/>
          <Route path='/my-links' element={<PrivateRoute component={MyLinks} />} />
          <Route path='/analytics' element={<PrivateRoute component={AnalyticsPage} />} />
          <Route path='/' element={<PrivateRoute component={Home} />} />
        </Routes>
      </AuthProvider>
    </Router>
  </>
);

export default App;
