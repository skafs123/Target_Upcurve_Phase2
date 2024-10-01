import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ResetPasswordForm from './ResetPasswordForm';  
import GreenTick from '../../images/GreenTick.png';
import { useNavigate } from "react-router-dom";


function VerificationSuccessful() {
    const [showResetPassword, setShowResetPassword] = useState(false);
    
    const navigate = useNavigate();
    
    const handleChangeForm = () => {
        setShowResetPassword(true);
    };

    if (showResetPassword) {
        navigate("/reset-password");
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 400,
            }}
        >
            {/* Logo */}
            <img
                src={GreenTick}
                alt="Green Tick"
                style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: '16px',
                }}
            />
            <Typography variant="h5" gutterBottom style={{ marginBottom: '16px' }}>
                Email verification successful!
            </Typography>
            <Button
                type="button"
                variant="contained"
                color="primary"
                style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '25px',
                    marginBottom: '16px',
                }}
                onClick={handleChangeForm}
            >
                Reset Password
            </Button>
        </Box>
    );
}

export default VerificationSuccessful;
