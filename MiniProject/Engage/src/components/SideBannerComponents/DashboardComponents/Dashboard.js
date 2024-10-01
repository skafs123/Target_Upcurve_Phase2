import React, { useState, useEffect } from "react";
import { Typography, Box, Chip, Stack, CircularProgress } from "@mui/material";
import EnhancedTable from "./EnhancedTable";
import SelectLabels from "./SelectLabels";
import RecognitionMetrics from "./RecognitionMetrics";
import ColorToggleButton from "./ColorToggleButton";


export default function Dashboard({ userData }) {
  const [trendingBehaviours, setTrendingBehaviours] = useState([]);
  const [timePeriod, setTimePeriod] = useState("20");
  const [selectedButton, setSelectedButton] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrendingBehaviours();
  }, [userData.id, timePeriod]);

  const fetchTrendingBehaviours = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/trending/behaviours/user/${userData.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrendingBehaviours(data);
    } catch (error) {
      setError('Error fetching trending behaviours');
      console.error('Error fetching trending behaviours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (newTime) => {
    setTimePeriod(newTime);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedButton(newSelection);
  };

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        fontFamily: "sans-serif",
        color: "Gray",
        p: 2,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ margin: 0 }}>
          Timeline
        </Typography>
        <SelectLabels timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recognition Metrics
        </Typography>
        <RecognitionMetrics userId={userData.id} timePeriod={timePeriod} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top 3 behaviours
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Stack direction="row" spacing={1}>
            {trendingBehaviours.length > 0 ? (
              trendingBehaviours.slice(0, 3).map((behaviour, index) => (
                <Chip key={index} label={`#${index + 1} ${behaviour}`} sx={{ px: 4, py: 2.5, fontSize: '1rem' }} />
              ))
            ) : (
              <Chip label="No trending behaviours" sx={{ px: 6 }} />
            )}
          </Stack>
        )}
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          View all recognitions
        </Typography>
        <ColorToggleButton onSelectionChange={handleSelectionChange} />
      </Box>
      <Box sx={{ mb: 2 }}>
        <EnhancedTable userId={userData.id} timePeriod={timePeriod} selectedButton={selectedButton} />
      </Box>
    </Box>
  );
}
