import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';

const RecognitionMetrics = ({ userId, timePeriod }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);     
  const fetchMetrics = async () => {
    setLoading(true);  
    setError(null);    

    try {
      const timePath = timePeriod === "20" ? "month" : "year";

      const shoutOutsReceivedResponse = await fetch(`http://localhost:8080/dashboard/shoutouts/received/${timePath}/${userId}`);
      const awardsReceivedResponse = await fetch(`http://localhost:8080/dashboard/awards/received/${timePath}/${userId}`);
      const shoutOutsGivenResponse = await fetch(`http://localhost:8080/dashboard/shoutouts/given/${timePath}/${userId}`);

      const shoutOutsReceived = await shoutOutsReceivedResponse.json();
      const awardsReceived = await awardsReceivedResponse.json();
      const shoutOutsGiven = await shoutOutsGivenResponse.json();

      setMetrics([
        { label: "SHOUT OUTS", received: shoutOutsReceived.count, pointsReceived: shoutOutsReceived.points },
        { label: "AWARDS", received: awardsReceived.count, pointsReceived: awardsReceived.points },
        { label: "SHOUT OUTS", given: shoutOutsGiven.count, pointsGiven: shoutOutsGiven.points },
      ]);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching metrics data:", error);
    } finally {
      setLoading(false);  
    }
  };

  useEffect(() => {
    if (userId && timePeriod) {
      fetchMetrics();   
    }
  }, [userId, timePeriod]);

  return (
    <Grid container spacing={-63} justifyContent="center" borderRadius="100px">
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error">{error}</Typography>
      ) : (
        metrics.map((metric, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                width: "200px",
                backgroundColor: "#2E5AAC",
                color: "white",
                borderTopLeftRadius: index === 0 ? "25px" : "0px",
                borderBottomLeftRadius: index === 0 ? "25px" : "0px",
                borderTopRightRadius: index === 2 ? "25px" : "0px",
                borderBottomRightRadius: index === 2 ? "25px" : "0px",
                margin: "5px",
              }}
            >
              <Box textAlign="center" color="white">
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>
                  {metric.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold", color: "white" }}>
                  {metric.received != null ? metric.received : metric.given}
                </Typography>
                <Typography variant="body1">{metric.received != null ? "Received" : "Given"}</Typography>
                <Divider
                  sx={{
                    backgroundColor: "white",
                    marginY: 1,
                    borderWidth: 1,
                  }}
                />
                {metric.pointsReceived != null && (
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "white" }}>
                    Points received: {metric.pointsReceived}
                  </Typography>
                )}

                {metric.pointsGiven != null && (
                  <Typography variant="body2" sx={{ fontWeight: "bold", color: "white" }}>
                    Points given: {metric.pointsGiven}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default RecognitionMetrics;