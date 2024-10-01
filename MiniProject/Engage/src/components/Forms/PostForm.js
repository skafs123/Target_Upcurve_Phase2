import React, { useState, useRef } from 'react';
import {
  TextField,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GifIcon from '@mui/icons-material/Gif';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiPicker from 'emoji-picker-react';
import CloseIcon from '@mui/icons-material/Close';
import GifBoxIcon from '@mui/icons-material/GifBox';
import ImageIcon from '@mui/icons-material/Image';

const PostForm = ({ type, onClose, onSubmit, userData}) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null); 
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
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
          postPicture: imageBase64,
          recognizees: [],
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
        postPicture: null,
        recognizees: [],
      };
      onSubmit(payload); 
      onClose();
    }
  };

  return (
    <Box sx={{ position: 'relative', padding: 2, width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
      <form>
        <TextField
           autoFocus
           variant="outlined"
           margin="dense"
           id="note"
           placeholder="What do you want to post?"
           fullWidth
           multiline
          value={text}
          rows={14}
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
            <Box position="absolute" zIndex="modal" top="100%" left="0" width="65%" sx={{ backgroundColor: 'background.paper', borderRadius: 1, boxShadow: 3, padding: 1 }}>
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

export default PostForm;
