import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SignInForm from './SignInForm';
import { useNavigate } from "react-router-dom";

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [validationMessage1, setValidationMessage1] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSignInForm, setShowSignInForm] = useState(false); 
    const email = localStorage.getItem('email');

    const navigate = useNavigate();
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate if new password and confirm password match
        if (newPassword !== confirmPassword) {
            setValidationMessage1('Passwords do not match.');
            return;
        }

        // Perform password strength validation
        const passwordValidation = validatePassword(newPassword);
        if (passwordValidation) {
            setValidationMessage(passwordValidation);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/userlogin/change-password', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password: newPassword,
                })
            });

            if (response.ok) {
                setValidationMessage1('');
                setValidationMessage('');
                setNewPassword('');
                setConfirmPassword('');
                alert('Password reset successful!');
                setShowSignInForm(true);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message);
            }
        } catch (error) {
            setErrorMessage('Error resetting password. Please try again later.');
        }
    };

    const handleChangeNewPassword = (event) => {
        const { value } = event.target;
        setNewPassword(value);
        setValidationMessage(validatePassword(value));
    };

    const handleChangeConfirmPassword = (event) => {
        const { value } = event.target;
        setConfirmPassword(value);
        if (newPassword && value !== newPassword) {
            setValidationMessage1('Passwords do not match.');
        } else {
            setValidationMessage1('');
        }
    };

    const handleChangeForm = () => {
        setShowSignInForm(true);
    };

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
            <Typography component="h1" variant="h4" align="left" fontWeight="bold" sx={{ mb: 1 }}>
                Reset Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    required
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    value={newPassword}
                    onChange={handleChangeNewPassword}
                    sx={{ width: '100%', mb: 2 }}
                />
                {validationMessage && (
                    <Typography variant="body2" align="left" color="error">
                        {validationMessage}
                    </Typography>
                )}
                <TextField
                    required
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    sx={{ width: '100%', mb: 2 }}
                />
                {validationMessage1 && (
                    <Typography variant="body2" align="left" color="error">
                        {validationMessage1}
                    </Typography>
                )}
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
                {errorMessage && (
                    <Typography variant="body2" align="left" color="error">
                        {errorMessage}
                    </Typography>
                )}
                <Typography
                    variant="body2"
                    style={{ textAlign: 'center', display: 'block', marginBottom: '16px', cursor: 'pointer' }}
                    onClick={handleChangeForm}
                >
                    Back to Sign In
                </Typography>
            </form>
        </Box>
    );
}

// Password validation function outside the component for better performance
function validatePassword(password) {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*]/;

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
    }
    if (!uppercaseRegex.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!lowercaseRegex.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }
    if (!digitRegex.test(password)) {
        return 'Password must contain at least one digit.';
    }
    if (!specialCharRegex.test(password)) {
        return 'Password must contain at least one special character (!@#$%^&*).';
    }

    return '';
}

export default ResetPasswordForm;
