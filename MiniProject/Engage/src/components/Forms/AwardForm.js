import React, { useState , useRef, useCallback, useEffect } from 'react';
import {
  TextField,
  Chip,
  Box,
  Typography,
  Button,
  IconButton,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel, 
  Autocomplete,
  Link,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GifIcon from '@mui/icons-material/Gif';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiPicker from 'emoji-picker-react';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ImageIcon from '@mui/icons-material/Image';

const AwardForm = ({ type, onClose, onSubmit, userData }) => {
  const [selectedCoreValueID, setSelectedCoreValueID] = useState([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [isEditingBehavior, setIsEditingBehavior] = useState(false);
  const [awardValue, setAwardValue] = useState([]);
  const [recognizeName, setRecognizeName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [people, setPeople] = useState([]);
  const inputRef = useRef(null);
  const [newBehavior, setNewBehavior] = useState('');
  const [coreValues, setCoreValues] = useState([]);
  const [behaviors, setBehaviors] = useState([]);  
  const [awardType, setAwardType] = useState('');
  
  useEffect(() => {
    fetch(`http://localhost:8080/users/partial/${userData.teamId}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
        .filter((item) => item.id !== userData.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          role: item.roleName,
          team: item.teamId,
          profilePic: item.profilePic,
        }));
        setPeople(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleCoreValueChange = (id) => {
    setSelectedCoreValueID([id]); 
  };

  const handleOptionSelected = (event, value) => {
    if (value && !suggestions.some((option) => option.id === value.id)) {
      setSuggestions([...suggestions, value]);
    }
  };

  const handleAwardTypeChange = (event) => {
    setAwardType(event.target.value);
  };
  
  const filteredOptions = people.filter(
    (option) => !suggestions.some((suggestion) => suggestion.id === option.id)
  );

  const handleBehaviorChange = (id) => {
    setSelectedBehaviors((prevValues) => {
      const newValues = (prevValues || []).includes(id)
        ? (prevValues || []).filter((v) => v !== id)
        : [...(prevValues || []), id];
      return newValues;
    });
  };
  
  const handleAddNewBehavior = () => {
    const behaviorID = `#${newBehavior}`;
    if (newBehavior && !behaviors.some((b) => b.name === newBehavior)) {
      const newBehaviorObj = { id: behaviorID, name: newBehavior };
      setBehaviors([...behaviors, newBehaviorObj]);
      setSelectedBehaviors([...selectedBehaviors, behaviorID]);
      setNewBehavior('');
    }
    setIsEditingBehavior(false);
  };

  const handleOpenEdit = () => {
    setIsEditingBehavior(true);
  };

  const handleBlur = () => {
    handleAddNewBehavior();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddNewBehavior();
    }
  };

  const handleNewBehaviorChange = (event) => {
    setNewBehavior(event.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.filter(s => s.id !== suggestion.id)
    );
  };
  
  const handleRemoveSuggestion = (index) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.filter((_, i) => i !== index)
    );
  };
  
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file); 
    }
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [text, setText] = useState('');

  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setOpenEmojiPicker(false); 
  };

  const handleSubmit = async () => {
    let imageBase64 = null;
  
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageBase64 = reader.result;
        const payload = {
          recognizer: { id: userData.id },
          postType: type,
          postString: text,
          coreValue: { coreValueID: selectedCoreValueID[0] },
          awardValue: {arID: awardType},
          postPicture: imageBase64,
          recognizees: suggestions.map(suggestion => ({ id: suggestion.id })),
          existingBehaviours: selectedBehaviors
            .filter(behaviorID => !isNaN(Number(behaviorID)) && Number(behaviorID) == behaviorID)
            .map(behaviorID => ({ behaviourID: Number(behaviorID) })),
          newBehaviours: selectedBehaviors
            .filter(behaviorID => typeof behaviorID === 'string')
            .map(behaviorID => {
              const behavior = behaviors.find(b => b.id === behaviorID);
              return {
                behaviourName: behavior.name,
                userID: userData.id
              };
            })
        };
        onSubmit(payload);
        onClose();
      };
      reader.readAsDataURL(image);
    } else {
      const payload = {
        recognizer: { id: userData.id },
        postType: type,
        postString: text,
        coreValue: { coreValueID: selectedCoreValueID[0] },
        awardValue: {arID: awardType},
        postPicture: null,
        recognizees: suggestions.map(suggestion => ({ id: suggestion.id })),
        existingBehaviours: selectedBehaviors
          .filter(behaviorID => !isNaN(Number(behaviorID)) && Number(behaviorID) == behaviorID)
          .map(behaviorID => ({ behaviourID: Number(behaviorID) })),
        newBehaviours: selectedBehaviors
          .filter(behaviorID => typeof behaviorID === 'string')
          .map(behaviorID => {
            const behavior = behaviors.find(b => b.id === behaviorID);
            return {
              behaviourName: behavior.name,
              userID: userData.id
            };
          })
      };
      onSubmit(payload);
      onClose();
    }
  };

  useEffect(() => {
    const fetchCoreValues = async () => {
      fetch('http://localhost:8080/corevalues')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
        .filter((item) => item.id !== userData.id)
        .map((item) => ({
          id: item.coreValueID,
          name: item.coreValue,
        }));
        setCoreValues(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchAwards = async () => {
      fetch('http://localhost:8080/awardsrecognitions')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
        .map((item) => ({
          id: item.arID,
          name: item.ar,
          points: item.points,
        }));
        setAwardValue(formattedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchBehaviorValues = async () => {
      fetch(`http://localhost:8080/behaviours/${userData.id}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data
        .map((item) => ({
          id: item.behaviourID,
          name: item.behaviourName,
        }));
        setBehaviors(formattedData); 
      })
      .catch((error) => console.error('Error fetching data:', error));
    };

    fetchAwards();  
    fetchCoreValues();
    fetchBehaviorValues();
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const ProfilePicture = ({ profilePic, name }) => {
    const imageSrc = profilePic ? `data:image/jpg;base64,${profilePic}` : null;
    const initials = name ? name.split(' ').slice(0, 2).map(n => n[0]).join(''): '';

    return (
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          marginRight: 2,
          backgroundColor: imageSrc ? 'transparent' : getRandomColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
        }}
      >
        {imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={name}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
          />
        ) : (
          <Typography variant="body1">
            {initials}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ position: 'relative', padding: 2, width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <form>
      <Autocomplete
        freeSolo
        options={filteredOptions} 
        getOptionLabel={(option) => `${option.name} | ${option.role}`}
        onChange={handleOptionSelected}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;  
          return (
            <Box {...otherProps} key={key} sx={{ display: 'flex', alignItems: 'center' }}>
              <ProfilePicture profilePic={option.profilePic} name={option.name} />
              <Typography variant="body1">
                {option.name} | {option.role}
              </Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            margin="normal"
            value={recognizeName}
            onChange={(e) => setRecognizeName(e.target.value)}
            inputRef={inputRef}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.select(); 
              }
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: 'text.primary',
                    backgroundColor: 'transparent',
                    marginRight: 1
                  }}
                >
                  <PersonIcon sx={{ fontSize: 24, color: 'text.primary' }} />
                </Box>
              ),
            }}
            label="Who do you want to recognize?"
            InputLabelProps={{ shrink: true }}
          />
        )}
      />  
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          marginBottom: 2,
          flexWrap: 'wrap'
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'grey.200',
              borderRadius: 4, 
              padding: '0.5rem 1rem',
              margin: 0,
              minWidth: 'fit-content',
              maxWidth: 'fit-content',
              overflow: 'hidden',
              marginRight: 2,
              cursor: 'pointer'
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {suggestion.name}
            </Typography>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleRemoveSuggestion(index)}
              sx={{
                padding: 0,
                fontSize: 'small',
                width: 16, 
                height: 16 
              }}
            >
              <CloseIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        ))}
      </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginY: 2 }}>
          <Typography sx={{ whiteSpace: 'nowrap', fontSize: '1rem' }}>Award Type:</Typography>
            <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
            <InputLabel
              shrink
              sx={{
                fontSize: '1rem', 
                position: 'absolute',
                backgroundColor: 'white', 
                paddingX: '4px', 
              }} 
            >
              Choose your award
            </InputLabel>
            {/* {awardValue.length} */}
            <Select
              value={awardType}
              onChange={handleAwardTypeChange}       
              inputProps={{ 'aria-label': 'Choose your award' }}
              sx={{
                '& .MuiSelect-select': {
                  paddingY: '8px', 
                  fontSize: '0.875rem', 
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px', 
                },
              }}
            >  
            {awardValue && awardValue.length > 0 && awardValue.map((award) => (
              <MenuItem key={award.id} value={award.id}>
                <Box display="flex" flexDirection="column" width="100%">
                  <Typography variant="body1" sx={{ paddingLeft: '16px' }}>{award.name}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ paddingLeft: '16px' }}>{award.points} points</Typography>
                </Box>    
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <Link href="#" underline="hover" sx={{ fontSize: '0.75rem' }}> 
            Award criteria
          </Link>
        </Box>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 1 }}>
          Choose the core value(s) exhibited
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {coreValues.map((coreValue) => (
            <Chip
              key={coreValue.id}
              label={coreValue.name}
              color={selectedCoreValueID.includes(coreValue.id) ? 'primary' : 'default'}
              onClick={() => handleCoreValueChange(coreValue.id)}
              clickable
              sx={{ 
                fontSize: 'small',              
                px: 3,                          
                py: 3,                        
                margin: '4px', 
                borderRadius: '25px',                 
              }}
            />
          ))}
        </Box>
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: 1 }}>
          Mention the behaviors exemplified
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {behaviors.map((behavior) => (
            <Chip
              key={behavior.id}
              label={behavior.name}
              sx={{
                borderRadius: '12px', 
                backgroundColor: selectedBehaviors.includes(behavior.id) ? '#888484' : 'default',
                color: selectedBehaviors.includes(behavior.id) ? 'white' : 'text.primary',
                border: '1.5px solid', 
                '&:hover': {
                  backgroundColor: selectedBehaviors.includes(behavior.id) ? 'grey.600' : 'default',  
                  color: selectedBehaviors.includes(behavior.id) ? 'white' : 'text.primary',
                },
              }}
              onClick={() => handleBehaviorChange(behavior.id)}
              clickable
            />
          ))}
          {isEditingBehavior ? (
            <TextField
              autoFocus
              variant="filled"
              size="small"
              value={newBehavior}
              onChange={handleNewBehaviorChange}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              sx={{
                height: '30px',
                borderRadius: '12px',
                backgroundColor: 'grey.200',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', 
                  '& fieldset': {
                    borderColor: 'text.primary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'text.primary',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'text.primary',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  padding: '2px 4px', 
                }
              }}
              InputProps={{
                startAdornment: (
                  <Typography
                    sx={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 'small',
                      color: 'text.primary',
                    }}
                  >
                    #
                  </Typography>
                ),
              }}
              placeholder="Enter new behavior"
            />
          ) : (
            <Button
              onClick={handleOpenEdit}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: '12px',
                fontSize: 'small',
                padding: '4px 8px',
                textTransform: 'none',
              }}
            >
              + Add New
            </Button>
          )}
        </Box>
        <Typography 
          variant="subtitle1"
          sx={{ marginTop: 2, marginBottom: -1 }}
        >
          Write a note
        </Typography>
        <TextField
          variant="outlined"
          multiline
          fullWidth
          margin="normal"
          minRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {image && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={URL.createObjectURL(image)} 
              alt="Selected"
              style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
            />
          <IconButton
            onClick={handleImageRemove}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: 'white',
              backgroundColor: 'red',
            }}
          >
            <CancelIcon fontSize='small'/>
          </IconButton>
        </div>
      )}
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          {openEmojiPicker && (
            <Box position="absolute" zIndex="modal" top="100%" left="0" width="60%" sx={{ backgroundColor: 'background.paper', borderRadius: 1, boxShadow: 3, padding: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton aria-label="close" color="inherit" onClick={() => setOpenEmojiPicker(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton aria-label="add-emoji" color="inherit" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
              <EmojiEmotionsIcon sx={{ color: 'grey' }}/>
            </IconButton>
            <IconButton aria-label="attach-file" color="inherit" onClick={handleIconClick}>
        <ImageIcon sx={{ color: 'grey' }}/>
      </IconButton>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          <IconButton aria-label="add-gif" color="inherit">
            
            <GifBoxIcon sx={{ color: 'grey' }} />
          </IconButton>
          </Box>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
          >
            Post
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AwardForm;