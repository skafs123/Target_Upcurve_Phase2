import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  fontSize: '1.5em'
};

const TopBanner = lazy(() => import('./LandingPageComponents/TopBanner'));
const MainBody = lazy(() => import('./LandingPageComponents/MainBody'));

const LandingPage = ({ userId, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [view, setView] = useState(10); 
  
  const handleUserDataFetch = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:8080/user-info/${userId}`, {
        method: "GET",
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error during fetch. Please try again later.");
    }
  }, [userId]);

  useEffect(() => {
    handleUserDataFetch();  
  }, [userId, handleUserDataFetch]);
  { console.log(userData)}
  
  return (
    <Suspense fallback={<div style={loadingStyle}>Loading...</div>}>
      <TopBanner userData={userData} onLogout={onLogout} view={view} setView={setView} /> 
      <MainBody userData={userData} view={view} onPostSuccess={handleUserDataFetch} />
      {errorMessage && <div>Error: {errorMessage}</div>}
    </Suspense>
  );
}

export default LandingPage;