import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import MainComponent from './components/MainComponent';
import SignInForm from './components/MainComponentForms/SignInForm';
import ForgotPasswordForm from './components/MainComponentForms/ForgotPasswordForm';
import ResetPasswordForm from './components/MainComponentForms/ResetPasswordForm';
import VerificationCodeForm from './components/MainComponentForms/VerificationCodeForm';
import VerificationSuccessful from './components/MainComponentForms/VerificationSuccessful';

import LandingPage from './components/LandingPage';
import Dashboard from './components/SideBannerComponents/DashboardComponents/Dashboard';
import RedeemPoints from './components/SideBannerComponents/RedeemPointsComponent/RedeemPoints';
import InsightsReporting from './components/SideBannerComponents/InsightsReportingComponents/InsightsReporting';
import Help from './components/SideBannerComponents/HelpComponents/Help'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [userData, setUserData] = useState(() => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  });

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(data));
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
  };

  return (
    <Router>
      <Routes>
        {/* Route for MainComponent if not logged in */}
        <Route path="/" element={<MainComponent onLogin={handleLogin} />}>
          <Route index element={<Navigate to="/signin" />} />
          <Route path="signin" element={<SignInForm onLogin={handleLogin} />} />
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="reset-password" element={<ResetPasswordForm />} />
          <Route path="verification-code" element={<VerificationCodeForm />} />
          <Route path="verification-successful" element={<VerificationSuccessful />} />
        </Route>
        
        {/* Private route for LandingPage accessible only when logged in */}
        <Route 
          path="/landingPage" 
          element={isLoggedIn ? <LandingPage userId={userData?.id} onLogout={handleLogout} /> : <Navigate to="/" />} 
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="redeem-points" element={<RedeemPoints />} />
          <Route path="insights-reporting" element={<InsightsReporting />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
