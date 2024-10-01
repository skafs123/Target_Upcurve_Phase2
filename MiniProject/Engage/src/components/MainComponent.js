import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import { Navigate } from 'react-router-dom';

import logo from '../images/Logo.png';
import loginBanner from '../images/Log_in_banner.jpg';

import SignInForm from './MainComponentForms/SignInForm';
import ForgotPasswordForm from './MainComponentForms/ForgotPasswordForm';
import ResetPasswordForm from './MainComponentForms/ResetPasswordForm';
import VerificationCodeForm from './MainComponentForms/VerificationCodeForm';
import VerificationSuccessful from './MainComponentForms/VerificationSuccessful';

function MainComponent({ onLogin }) {
    const defaultTheme = createTheme();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" className="App" sx={{ height: '100vh', overflow: 'hidden' }}>
                <CssBaseline />
                {/* Top Banner */}
                <Grid item xs={12} sx={{ backgroundColor: 'lightgrey', borderBottom: '1px', py: '0.3rem', px: '2px', display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={logo}
                        alt="Logo"
                        sx={{
                            width: '3rem',
                            height: '3rem',
                            marginRight: '0.5rem',
                            marginLeft: '2rem',
                        }}
                    />
                    <Typography variant="h5" align="left" fontWeight="bold" sx={{ color: '#000000', lineHeight: '1', mt: '0px' }}>
                        Engage
                    </Typography>
                </Grid>
                {/* Left side */}
                <Grid
                    item
                    xs={12}
                    sm={8}
                    sx={{
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1cm',
                        boxSizing: 'border-box',
                        height: 'calc(100vh - 3rem)',
                    }}
                >
                    <Box
                        sx={{
                            padding: '2rem',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <img
                            src={loginBanner}
                            alt="Banner Logo"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </Box>
                </Grid>
                {/* Right side */}
                <Grid
                    item
                    xs={12}
                    sm={4}
                    component={Paper}
                    elevation={0}
                    square
                    sx={{
                        backgroundColor: 'transparent',
                        display: 'flex',
                        flexDirection: 'column',
                        //alignItems: 'center',
                        justifyContent: 'center',
                        height: 'calc(100vh - 3rem)',
                        paddingLeft:'30px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 400,
                        }}
                    >
                         <Routes>
                            {/* Default Route */}
                            <Route path="/" element={<Navigate to="signin" />} />
                            
                            {/* Child Routes */}
                            <Route path="signin" element={<SignInForm onLogin={onLogin} />} />
                            <Route path="forgot-password" element={<ForgotPasswordForm />} />
                            <Route path="reset-password" element={<ResetPasswordForm />} />
                            <Route path="verification-code" element={<VerificationCodeForm />} />
                            <Route path="verification-successful" element={<VerificationSuccessful />} />
                        </Routes>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default MainComponent;
