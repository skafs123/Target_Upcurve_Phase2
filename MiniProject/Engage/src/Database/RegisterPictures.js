import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const RegisterPicture = () => {
  const [user, setUser] = useState("");
  const [imageString,setImageString] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const onChangeFile = async (event) => {
    console.log("file to upload : ", event.target.files[0]);
    let file = event.target.files[0];
    if(file)
    {
        const reader = new FileReader();
        reader.onload = e => {
          const dataURL = reader.result;
          const base64 = dataURL.slice(dataURL.indexOf(',')+1);
          setImageString(base64);
        };
        reader.readAsDataURL(file);
    }
    setErrorMessage("");
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    
    let payLoad = { id:user, profilePic :imageString }
    try {
      const response = await fetch("http://localhost:8080/user-info/save-image", {
        method: "PATCH",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad )
        
      });
      console.log("fetch over");
      if (response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      setErrorMessage("Error during login. Please try again later.");
    }
    
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        width: "100%",
        maxWidth: 400,
        margin: "auto",
        mt: 8,
      }}
    >
      <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: 'left'}}>
        Register Profile Picture
      </Typography>
      <form onSubmit={handleSubmit}  style={{ width: "100%" }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="userId"
          label="User Id"
          name="userId"
          autoFocus
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
           
          }}
          
        />
          
          {imageString && (
            <img
            id="profileImage"
            src={"data:image/jpg;base64,"+imageString}
                  alt="user"
                  style={{ maxWidth: '20%', height: 'auto', borderRadius: '50%' }}
            />
          )}
          <input 
          type="file"
          name="image"
          id="file"
          accept=".jpeg,.png,.jpg"
          onChange={onChangeFile}
          />
         {errorMessage && (
          <Typography variant="body2" align="left" color="error" sx={{ mb: 5 }}>
            {errorMessage}
          </Typography>
        )}
       
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
          Submit
        </Button>
      </form>
      
    </Box>
  );
};

export default RegisterPicture;