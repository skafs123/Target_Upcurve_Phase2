import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import VerificateCodeForm from './VerificationCodeForm';
import SignInForm from './SignInForm';

function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
    const [showSignInForm, setShowSignInForm] = useState(false);

    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch("http://localhost:8080/userlogin/forgot-password", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });            
            const data = await response.json();
            if (response.ok){
                localStorage.setItem('email', email); 
                setIsEmailSubmitted(true);
            }
            else {                
                setErrorMessage(data.message);
            } 
        } catch (error) {
            console.error('Error checking email. Please try again later');
            
        }
    };

    const handleChangeForm = () => {
        setShowSignInForm(true); 
    };

    if (isEmailSubmitted) {
        navigate("/verification-code");
    }

    if (showSignInForm) {
        navigate("/signin");
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                width: '100%',
                maxWidth: 400,
            }}
        >
            <Typography component="h1" variant="h4" align="left" fontWeight={'bold'} sx={{ mb: 1 }}>
                Forgot password
            </Typography>
            {/* Conditionally render error message or default text */}
            {errorMessage && (
                <Typography variant="body2" align="left" color="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Typography>
            )}
            {!errorMessage && (
                <Typography variant="body2" align="left" color="textSecondary" sx={{ mb: 2 }}>
                    Verify it's you!
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: '100%', mb: 2 }}
                />
                <Typography variant="body2" align="left" color="textSecondary" sx={{ mb: 6 }}>
                    We will send a verification code to the registered email ID.
                </Typography>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{
                        width: '100%',
                        height: '56px',
                        borderRadius: '25px',
                        marginBottom: '16px',
                    }}
                >
                    Next
                </Button>
                <Typography
                    component={Link}
                    variant="body2"
                    style={{ textAlign: 'center', display: 'block', marginTop: '10px', marginBottom: '16px', cursor: 'pointer' }}
                    onClick={handleChangeForm}
                >
                    Back
                </Typography>
            </form>
        </Box>
    );
}

export default ForgotPasswordForm;
