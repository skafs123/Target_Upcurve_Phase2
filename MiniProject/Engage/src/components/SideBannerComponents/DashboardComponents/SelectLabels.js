import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

const SelectLabels = ({ timePeriod, setTimePeriod }) => {
  const handleChange = (event) => {
    setTimePeriod(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={timePeriod}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{
            borderRadius: "50px",
            height: "30px",
            background: "#f0ecec",
          }}
        >
          <MenuItem value="20">This month</MenuItem>
          <MenuItem value="10">This year</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectLabels;