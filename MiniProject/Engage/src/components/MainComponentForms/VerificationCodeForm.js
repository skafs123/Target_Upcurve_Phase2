import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; 
import VerificationSuccessful from './VerificationSuccessful';
import { useNavigate } from "react-router-dom";

function VerificationCodeForm() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const email = localStorage.getItem('email'); 

    const navigate = useNavigate();

    function maskEmail(email) {
        const startLetter = email.charAt(0);
        const maskedEmail = `${startLetter}*****@gmail.com`;
        return maskedEmail;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/userlogin/validate-otp", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();

            if (response.ok) {
                setIsOtpVerified(true);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to verify OTP. Please try again later.');
        }
    };

    if (isOtpVerified) {
        navigate("/verification-successful");
        
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
                Enter the 6-digit code
            </Typography>
            <Typography variant="body2" align="left" color="textSecondary" sx={{ mb: 2 }}>
                Check {maskEmail(email)} for a verification code
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    id="otp"
                    name="otp"
                    type="number"
                    label="OTP"
                    variant="outlined"
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ width: '100%', mb: 2 }}
                />
                <Link to="#" variant="body2" style={{ textAlign: 'left', display: 'block', margin: 'auto', marginBottom: '16px' }}>
                    Resend code
                </Link>
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
                    Submit
                </Button>
                {error && (
                    <Typography variant="body2" align="left" color="error">
                        {error}
                    </Typography>
                )}
            </form>
        </Box>
    );
}

export default VerificationCodeForm;
