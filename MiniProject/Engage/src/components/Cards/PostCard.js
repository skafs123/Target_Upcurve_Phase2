import React, { useState, useEffect, useRef } from 'react';
import { Grid, Paper, Avatar, Typography, Divider, Button } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import Modal from 'react-modal';
import moment from 'moment';

const MAX_LINES = 3;

const PostCard = ({ post, index, theme }) => {
  const [expandedPostIndex, setExpandedPostIndex] = useState(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textRefs = useRef([]);
  
  useEffect(() => {
    const checkTextOverflow = () => {
      const newOverflowStatus = {};
      textRefs.current.forEach((ref, index) => {
        if (ref) {
          const isOverflowing = ref.scrollHeight > ref.clientHeight;
          newOverflowStatus[index] = isOverflowing;
        }
      });
      setIsTextOverflowing(newOverflowStatus);
    };
  
    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);
    
    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [post]);

  const handleTogglePostExpand = (idx) => {
  setExpandedPostIndex(expandedPostIndex === idx ? null : idx);
  };

  // const formatDate = (dateString) => {
  //   const date = moment(dateString, 'M/D/YYYY, h:mm:ss A').toDate();    
  //   const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  //   return formattedDate;
  // };

  const formatDate = (dateString) => {
    const date = moment(dateString, 'DD/MM/YYYY, HH:mm:ss').toDate();
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const [day, month, year] = formattedDate.split(' ');
    return `${day} ${month} ${year}`;
  };


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  Modal.setAppElement('#root');

  return (
    <Grid container sx={{ paddingLeft: '16px', paddingRight: '12px', py: '8px' }}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff',
          padding: '16px',
          boxShadow: theme.shadows[3],
          borderRadius: 0,
        }}>
          <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
          <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item>
                <Avatar
                  alt={post.recognizer.name}
                  src={"data:image/jpg;base64," + post.recognizer.profilePic}
                  sx={{ width: 90, height: 90 }}
                />
              </Grid>
              <Grid item sx={{ marginLeft: '16px' }}>
                <Typography variant="body1" sx={{ fontSize: '120%', fontWeight: '600' }}>
                {post.recognizer && post.recognizer.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '100%', whiteSpace: 'nowrap' }}>
                {post.recognizer && post.recognizer.roleName}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '-60px' }}>
              <Typography variant="body1" sx={{ fontSize: '100%', color: '#000' }}>
                {formatDate(post.date)}  
              </Typography>
            </Grid>
          </Grid>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: '110%',
                textAlign: 'justify',
                marginTop: '10px',
                marginBottom: '16px',
                px: '6px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: expandedPostIndex === index ? 'none' : MAX_LINES,
                textOverflow: 'ellipsis',
                whiteSpace: 'pre-wrap',
                py: '5px'
              }}
              ref={(el) => (textRefs.current[index] = el)}
            >
              {post.content}
            </Typography>
            {isTextOverflowing[index] && (
              <Typography
                onClick={() => handleTogglePostExpand(index)}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                  cursor: 'pointer',
                  display: 'inline',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'clip',
                  marginTop: '8px', 
                }}
              >
                {expandedPostIndex === index ? ' Read less' : '... Read more'}
              </Typography>
            )}
          </div>
          {post.picture && (
            <div
              style={{
                width: '400px',
                height: '400px',
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px',
                padding: '5px',
                border: 'solid #ccc',
                boxSizing: 'content-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0' // Optional: background color to fill empty space
              }}
              onClick={openModal}
            >
              <img
                src={post.picture}
                alt="Post"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            </div>
          )}
            <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',
                padding: '0',
                border: 'none',
                background: 'transparent',
              },
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
              }
            }}
          >
            <img
              src={post.picture}
              alt="Post"
              style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}
              onClick={closeModal}
            />
          </Modal>
          {post.gif && (
            <img
              src={URL.createObjectURL(post.gif)}
              alt="Post GIF"
              style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
            />
          )}
          <Grid container spacing={2} justifyContent="left" >
            <Grid item>
              <Button startIcon={<ThumbUpAltOutlinedIcon />} sx={{ textTransform: 'none', color: '#000' }}>Like</Button>
            </Grid>
            <Grid item>
              <Button startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ textTransform: 'none', color: '#000' }}>Comment</Button>
            </Grid>
            <Grid item>
              <Button startIcon={<RepeatOutlinedIcon />} sx={{ textTransform: 'none', color: '#000' }}>Share</Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PostCard;