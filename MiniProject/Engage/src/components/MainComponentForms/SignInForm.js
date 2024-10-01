import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import ForgotPasswordForm from "./ForgotPasswordForm";

const SignInForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!email) return "Email is required";
    if (!emailPattern.test(email)) return "Invalid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";  
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation || passwordValidation) {
      setEmailError(emailValidation);
      setPasswordError(passwordValidation);
      setErrorMessage("Please fix the errors above");
    } else {
      try {
        const response = await fetch("http://localhost:8080/userlogin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setErrorMessage("");
          onLogin(data); 
          navigate("/landingPage");
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message);
        }
      } catch (error) {
        setErrorMessage("Error during login. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChangeForm = () => {
    setShowForgotPasswordForm(true);
  };

  if (showForgotPasswordForm) {
    navigate("/forgot-password");
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        mt: 0,
      }}
    >
      <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'left'}}>
        Sign in
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(validateEmail(e.target.value));
          }}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <Button onClick={togglePasswordVisibility} sx={{ textTransform: 'lowercase' }} >
                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                  {showPassword ? "Hide" : "Show"}
                  </Typography>
              </Button>
            ),
          }}
        />
        {errorMessage && (
          <Typography variant="body2" align="left" color="error" sx={{ mb: 5 }}>
            {errorMessage}
          </Typography>
        )}
        <Grid container>
          <Grid item xs>
            <Typography
              component={Link}
              variant="body2"
              style={{ textAlign: 'left', display: 'block', marginTop: '10px', marginBottom: '16px', cursor: 'pointer' }}
              onClick={handleChangeForm}
            >
              Forgot Password
            </Typography>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            height: 56,
            borderRadius: "25px",
            mt: 2,
            mb: 2,
          }}
        >
          Sign In
        </Button>
      </form>
    </Box>
  );
};

export default SignInForm;
