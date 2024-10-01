import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {styled} from '@mui/material/styles'

export default function BasicSelect({ view, setView }) {
  const handleChange = (event) => {
    setView(event.target.value);
  };

  const getArrowPosition = () => {
    return view === 10 ? '-50px' : '-30px'; 
  };

  const NoBorderSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiInputBase-input': {
      color: 'black',
    },
    '& .MuiSvgIcon-root': {
      color: 'black',
       transform: `translateX(${getArrowPosition()})`,
    },
  }));

  return (
    <Box sx={{ paddingLeft: '10px', minWidth: 160, maxWidth: 180, width: '100%' }}>
      <FormControl fullWidth variant="outlined">
        <NoBorderSelect
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={view}
          onChange={handleChange}
        >
          <MenuItem value={10}>Team View</MenuItem>
          <MenuItem value={20}>Pyramid View</MenuItem>
        </NoBorderSelect>
      </FormControl>
    </Box>
  );
}