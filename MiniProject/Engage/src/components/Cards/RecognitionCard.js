import React, { useState, useEffect, useRef } from 'react';
import { Grid, Paper, Avatar, Typography, Box, Button } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import Stack from '@mui/material/Stack';
import Modal from 'react-modal';
import moment from 'moment';
import { styled } from '@mui/material/styles';

import RibbonImage from '../../images/Ribbon.png'
import shoutOut from '../../images/ShoutOut.png'

const MAX_LINES = 3;

const RecognitionCard = ({ post, index, theme  }) => {
  const [expandedPostIndex, setExpandedPostIndex] = useState(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textRefs = useRef([]);
  
  const Ribbon = styled('img')(({ theme }) => ({
    width: 80,
    height: 'auto',
    position: 'absolute',
    top: -20,
    left: -35,
    zIndex: 1,
  }));
  
  const Wrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
  }));

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

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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

  const isSingleRecognizee = post.recognizees && post.recognizees.length === 1;

  return isSingleRecognizee ? (
    <Grid container sx={{ paddingLeft: '16px', paddingRight: '12px', py: '8px' }}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff',
          padding: '20px',
          boxShadow: theme.shadows[3],
          borderRadius: 0,
        }}>
          <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', marginTop: '8px', marginBottom: '4px' }}>
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#333',
                      borderRadius: '20px',
                      padding: '3% 8%',
                      color: '#fff', 
                      whiteSpace: 'nowrap',
                      minWidth: '100%',
                      width: 'auto', 
                      maxWidth: '100%',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={shoutOut} 
                      alt="Shout Out"
                      style={{
                        width: '40px', 
                        height: '40px',
                        marginRight: '8px',
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '100%',
                        textTransform: 'uppercase', 
                      }}
                    >
                      Shout Out
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sx={{ marginTop: '-60px'}}>
                  <Typography variant="body1" sx={{ fontSize: '100%', color: '#000' }}>
                    {formatDate(post.date)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item>
                <Wrapper>
                  <Ribbon src={RibbonImage} alt='Ribbon' />
                  <Avatar
                    alt={post.recognizees[0].name}
                    src={"data:image/jpg;base64," + post.recognizees[0].profilePic}
                    sx={{ width: 80, height: 80 }}
                  />
                </Wrapper>
              </Grid>
              <Grid item sx={{ marginLeft: '16px' }}>
                <Typography variant="body1" sx={{ fontSize: '120%', fontWeight: '600' }}>
                {post.recognizees && post.recognizees[0] && post.recognizees[0].name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '100%', whiteSpace: 'nowrap' }}>
                {post.recognizees && post.recognizees[0] && post.recognizees[0].roleName}
                </Typography>
              </Grid>
            </Grid>
            <Grid 
              item 
              xs={12} 
              sx={{ 
                display: 'flex', 
                alignItems: 'right', 
                justifyContent: 'flex-end', 
                marginTop: '-100px', 
                marginBottom: '15px' 
              }}
            >
              {post.coreValue?.id && (
                <Typography 
                  variant="body1" 
                  style={{
                    fontSize: "120%",
                    backgroundColor: "#1269c9",
                    borderRadius: "200px",
                    padding: "2% 5%",
                    color: "#fff"
                  }}
                >
                  Recognized under '{post.coreValue.value}'
                </Typography>
              )}
            </Grid>
          </Grid>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: '110%',
                textAlign: 'justify',
                marginBottom: '16px',
                px: '6px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: expandedPostIndex === index ? 'none' : MAX_LINES,
                whiteSpace: 'pre-wrap',
                position: 'relative',
                py: '5px'
              }}
              ref={el => textRefs.current[index] = el}
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
                  marginTop: '8px', 
                  marginBottom: '3px',
                }}
              >
                {expandedPostIndex === index ? ' Read less' : 'Read more'}
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
                backgroundColor: '#f0f0f0' 
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
          <Grid item xs={8} sx={{ justifyContent: 'flex-start' }}>
            {/* Check if either existingBehaviours or newBehaviours exists before rendering the entire block */}
            {(post.existingBehaviours?.length > 0 || post.newBehaviours?.length > 0) && (
              <>
                <Typography variant="body1" sx={{ backgroundColor: "#fff", color: "#000", mt: 2, fontSize: '110%' }}>
                  Behaviours exemplified
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  {/* Render each existingBehaviour if it exists */}
                  {post.existingBehaviours?.map((behaviour, index) => (
                    <Typography
                      key={`existing-${index}`}
                      variant="body1"
                      style={{
                        backgroundColor: "#95c0e7",
                        borderRadius: "15px",
                        minWidth: 'auto',
                        padding: '12px 12px',
                        color: "#000",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {capitalizeWords(behaviour.name)}
                    </Typography>
                  ))}
                  
                  {/* Render each newBehaviour if it exists */}
                  {post.newBehaviours?.map((behaviour, index) => (
                    <Typography
                      key={`new-${index}`}
                      variant="body1"
                      style={{
                        backgroundColor: "#95c0e7",
                        borderRadius: "15px",
                        minWidth: 'auto',
                        padding: '12px 12px',
                        color: "#000",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {capitalizeWords(behaviour.name)}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
          </Grid>
          <Grid container mt={-12}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Grid item sx={{ textAlign: 'center',marginTop: '5px', }}>
                <Typography variant="body1" style={{ fontSize: "100%", paddingBottom: '2px', fontStyle: 'italic' }}>
                  Recognised By
                </Typography>
                <Avatar
                  alt={post.recognizer.name}
                  src={"data:image/jpg;base64," + post.recognizer.profilePic}
                  sx={{ width: 80, height: 80, margin: '0 auto' }}
                />
                <Grid item sx={{ marginTop: '8px' }}>
                  <Typography variant="body1" sx={{ fontSize: '120%', fontStyle: 'italic' }}>
                    {post.recognizer && post.recognizer.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '90%', whiteSpace: 'nowrap', fontStyle: 'italic' }} >
                    {post.recognizer && post.recognizer.roleName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="left" mt={-8} mb={1} >
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
  ) : (
    <Grid container sx={{ paddingLeft: '16px', paddingRight: '12px', py: '8px' }}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          backgroundColor: '#fff',
          padding: '20px',
          boxShadow: theme.shadows[3],
          borderRadius: 0, 
        }}>
          <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', marginTop: '8px', marginBottom: '4px' }}>
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#333',
                      borderRadius: '20px',
                      padding: '3% 8%',
                      color: '#fff', 
                      whiteSpace: 'nowrap',
                      minWidth: '100%',
                      width: 'auto', 
                      maxWidth: '100%',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={shoutOut} 
                      alt="Shout Out"
                      style={{
                        width: '40px', 
                        height: '40px',
                        marginRight: '8px',
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '100%',
                        textTransform: 'uppercase', 
                      }}
                    >
                      Shout Out
                    </Typography>
                  </Box>
                </Grid>
                <Grid item sx={{ marginTop: '-60px' }}>
                  <Typography variant="body1" sx={{ fontSize: '100%', color: '#000' }}>
                    {formatDate(post.date)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '50px' }}>
              {post.recognizees && post.recognizees.map((recognizee, idx) => (
                <Grid item key={idx} sx={{ flex: '1 0 200px', maxWidth: '200px', textAlign: 'center', minWidth: '150px' }}>
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <Wrapper>
                        <Ribbon src={RibbonImage} alt='Ribbon' />
                        <Avatar
                          alt={recognizee.name}
                          src={"data:image/jpg;base64," + recognizee.profilePic}
                          sx={{ width: 90, height: 90, margin: '0 auto' }}
                        />
                      </Wrapper>
                      <Typography variant="body1" sx={{ fontSize: '120%', marginTop: '8px', fontWeight: '600' }}>
                        {recognizee.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '100%', whiteSpace: 'nowrap' }}>
                        {recognizee.roleName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
            {post.coreValue?.id && (
                <Typography 
                  variant="body1" 
                  style={{
                    fontSize: "120%",
                    backgroundColor: "#1269c9",
                    borderRadius: "200px",
                    padding: "1.5% 5%",
                    color: "#fff"
                  }}
                >
                  Recognized under '{post.coreValue.value}'
                </Typography>
              )}
            </Grid>
          </Grid>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: '110%',
                textAlign: 'justify',
                marginBottom: '16px',
                px: '6px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: expandedPostIndex === index ? 'none' : MAX_LINES,
                whiteSpace: 'pre-wrap',
                py: '5px'
              }}
              ref={el => textRefs.current[index] = el}
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
                  marginBottom: '3px',
                }}
              >
                {expandedPostIndex === index ? ' Read less' : 'Read more'}
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
                border: '2px solid black',
                boxSizing: 'content-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0' 
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
          <Grid item xs={8} sx={{ justifyContent: 'flex-start' }}>
            {/* Check if either existingBehaviours or newBehaviours exists before rendering the entire block */}
            {(post.existingBehaviours?.length > 0 || post.newBehaviours?.length > 0) && (
              <>
                <Typography variant="body1" sx={{ backgroundColor: "#fff", color: "#000", mt: 2, fontSize: '110%' }}>
                  Behaviours exemplified
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  {/* Render each existingBehaviour if it exists */}
                  {post.existingBehaviours?.map((behaviour, index) => (
                    <Typography
                      key={`existing-${index}`}
                      variant="body1"
                      style={{
                        backgroundColor: "#95c0e7",
                        borderRadius: "15px",
                        minWidth: 'auto',
                        padding: '12px 12px',
                        color: "#000",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {capitalizeWords(behaviour.name)}
                    </Typography>
                  ))}
                  
                  {/* Render each newBehaviour if it exists */}
                  {post.newBehaviours?.map((behaviour, index) => (
                    <Typography
                      key={`new-${index}`}
                      variant="body1"
                      style={{
                        backgroundColor: "#95c0e7",
                        borderRadius: "15px",
                        minWidth: 'auto',
                        padding: '12px 12px',
                        color: "#000",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {capitalizeWords(behaviour.name)}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
          </Grid>
          <Grid container mt={-12}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid item sx={{ textAlign: 'center',marginTop: '5px', }}>
                <Typography variant="body1" style={{ fontSize: "100%", paddingBottom: '2px', fontStyle: 'italic' }}>
                  Recognised By
                </Typography>
                <Avatar
                  alt={post.recognizer.name}
                  src={"data:image/jpg;base64," + post.recognizer.profilePic}
                  sx={{ width: 80, height: 80, margin: '0 auto' }}
                />
                <Grid item sx={{ marginTop: '8px' }}>
                  <Typography variant="body1" sx={{ fontSize: '120%', fontStyle: 'italic' }}>
                    {post.recognizer && post.recognizer.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '90%', whiteSpace: 'nowrap', fontStyle: 'italic' }} >
                    {post.recognizer && post.recognizer.roleName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="left" mt={-8} mb={1} >
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

export default RecognitionCard;
