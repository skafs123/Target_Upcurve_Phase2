import React, { useState, useEffect, useRef } from 'react';
import { TextField, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ErrorBoundary from '../ErrorBoundary';
import { useLocation, useNavigate } from 'react-router-dom';

import PostForm from '../Forms/PostForm'
import AwardForm from '../Forms/AwardForm';
import RecognitionForm from '../Forms/RecognitionForm';
import CelebrateForm from '../Forms/CelebrateForm';
import PostCard from '../Cards/PostCard';
import AwardCard from '../Cards/AwardCard'
import RecognitionCard from '../Cards/RecognitionCard';

import Dashboard from '../SideBannerComponents/DashboardComponents/Dashboard';
import RedeemPoints from '../SideBannerComponents/RedeemPointsComponent/RedeemPoints';
import InsightsReporting from '../SideBannerComponents/InsightsReportingComponents/InsightsReporting';
import Help from '../SideBannerComponents/HelpComponents/Help';

const OptionsList = ({ setCurrentView, navigate }) => {
  
  const handleClick = (view) => {
    const routeMap = {
      'My Dashboard': '/landingPage/dashboard',
      'Redeem Points': '/landingPage/redeem-points',
      'Insights & Reporting': '/landingPage/insights-reporting',
      'Help': '/landingPage/help',
    };
    const route = routeMap[view] || '/landingPage';
    navigate(route);
    localStorage.setItem('currentView', JSON.stringify(view));
    setCurrentView(view);
  };

  return (
    <React.Fragment>
      <Grid
        container
        spacing={1/4}
        sx={{
          backgroundColor: "#ccc",
          position: "sticky",
          left: 0,
          width: "auto",
          maxWidth: "250px",
          height: "100",
          overflow: " hidden",
        }}
      >
      {['My Dashboard', 'Redeem Points', 'Insights & Reporting', 'Help'].map((text, index) => (
        <Grid item xs={12} key={index}>
          <Button variant="text" sx={{ 
            backgroundColor: "#fff", 
            textTransform: 'none', 
            color: '#000', 
            width: '100%',
            borderRadius: 0,
            marginTop: index === 0 ? 1/2 : 1/8,
            marginBottom: index === 3 ? 1/2 : 1/8,
          }}
            onClick={() => handleClick(text)}
          >
            {text}
          </Button>
        </Grid>
      ))}
    </Grid>
    </React.Fragment>
  );
};

const PostFormRow = ({ userData, containerRef, onPostSuccess, view }) => {
  const [showRecognitionForm, setShowRecognitionForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showSecondStack, setShowSecondStack] = useState(false);
  const [openAwardDialog, setOpenAwardDialog] = useState(false);
  const [openCelebrateDialog, setOpenCelebrateDialog] = useState(false);
  const [openShoutOutDialog, setOpenShoutOutDialog] = useState(false);
  const theme = useTheme();
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollTo(0,0);
    }
  };

  const toggleExpand = () => {
    setShowSecondStack(!showSecondStack);
  };

  const handleOpenAwardDialog = () => {
    setOpenAwardDialog(true);
  };

  const handleCloseAwardDialog = () => {
    setOpenAwardDialog(false);
  };

  const handleOpenCelebrateDialog = () => {
    setOpenCelebrateDialog(true);
  };

  const handleCloseCelebrateDialog = () => {
    setOpenCelebrateDialog(false);
  };

  const handleOpenShoutOutDialog = () => {
    setOpenShoutOutDialog(true);
  };

  const handleCloseShoutOutDialog = () => {
    setOpenShoutOutDialog(false);
  };

  const handleTextFieldClick = () => {
    setShowRecognitionForm(true);
  };

  const handleCloseDialog = () => {
    setShowRecognitionForm(false);
  };
  
  const handleSubmit = async (payload) => {
    try {
      const response = await fetch('http://localhost:8080/posts/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status} - ${await response.text()}`;
        throw new Error(errorMessage);
      }
      const result = await response.json();
      onPostSuccess();
      console.log('Form submitted successfully:', result);
      await fetchPosts(); 
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
    handleCloseAwardDialog();
    handleCloseCelebrateDialog();
    handleCloseShoutOutDialog();
  };
  
  const fetchPosts = async () =>  {
    try {
      let response;
      if (view === 10) {
        response = await fetch(`http://localhost:8080/posts/byTeam/${userData.teamId}`);
      } else if (view === 20) {
        response = await fetch(`http://localhost:8080/posts/pyramid/${userData.teamId}`);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();  
      const processedData = data.map(post => {
        const basePost = {
          id: post.postId,
          recognizer: {
            id: post.recognizer.id,
            name: post.recognizer.name,
            roleName: post.recognizer.roleName,
            teamId: post.recognizer.teamId,
            profilePic: post.recognizer.profilePic,
          },
          type: post.postType,
          content: post.postString,
          date: new Date(post.postDate).toLocaleString(),
          picture: post.postPicture,
          recognizees: post.recognizees.map(recognizee => ({ 
            id: recognizee.id,
            name: recognizee.name,
            roleName: recognizee.roleName,
            teamId: recognizee.teamId,
            profilePic: recognizee.profilePic,
          })),
        };

        if (post.postType !== "Post") {
          basePost.coreValue = post.coreValue ? {
            id: post.coreValue.coreValueID,
            value: post.coreValue.coreValue, 
          } : null;
          
          basePost.awardValue = post.awardValue ? {
            id: post.awardValue.arID,
            value: post.awardValue.ar,
            points: post.awardValue.points,
          } : null;

          basePost.existingBehaviours = post.existingBehaviours ? post.existingBehaviours.map(behaviour => ({
            id: behaviour.behaviourID,
            name: behaviour.behaviourName,
            userID: behaviour.userID,
          })) : null;
        
          basePost.newBehaviours = post.newBehaviours ? post.newBehaviours.map(behaviour => ({
            name: behaviour.behaviourName,
            userID: behaviour.userID,
          })) : null;
        }  
        return basePost;
      });
      
      processedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPosts(processedData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchPosts();
    }
  }, [userData, view]);
  return (
    <>
      <Grid container sx={{ backgroundColor: '#ccc', width: '100%', justifyContent: 'center', paddingBottom: '20px', paddingLeft: '10px', paddingRight: '12px', display: 'flex', 
          }}>
        <Grid item xs={1} elevation={3} sx={{ flexDirection: 'row', boxShadow: theme.shadows[3], backgroundColor: '#fff', width: '50%', padding: '16px', display: 'flex', alignItems: 'center' }}>
        <Avatar
            alt={userData?.name}
            src={"data:image/jpg;base64," + userData?.profilePic}
            sx={{ width: 75, height: 75 }}
          />
        </Grid>
        <Grid item xs={11} sx={{ backgroundColor: '#fff', width: '50%', padding: '26px' }}>
          <TextField
            variant="outlined"
            placeholder="What do you want to share today?"
            fullWidth
            sx={{ 
              borderRadius: '15px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
              }
            }}
            onClick={handleTextFieldClick}
          />
        </Grid>
        <Grid item xs={12} sx={{ backgroundColor: '#fff', width: '50%', padding: '16px' }}>
        <>
          <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="text"
              sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}
              onClick={handleOpenShoutOutDialog}
            >
              Give a shout out
            </Button>
            <Button
              variant="text"
              sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}
              onClick={handleOpenAwardDialog}
              disabled={userData.level !== 5 && userData.level !== 6}
            >
              Award
            </Button>
            <Button
              variant="text"
              sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}
              onClick={handleOpenCelebrateDialog}
            >
              Celebrate
            </Button>
            <IconButton aria-label="Expand" sx={{ backgroundColor: "transparent", color: "#000" }} onClick={toggleExpand}>
              <AddIcon />
            </IconButton>
          </Stack>
          {showSecondStack && (
            <Stack spacing={2} direction="row" sx={{ marginTop: 2, flexWrap: 'wrap' }}>
              <Button variant="text" sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}>Option 1</Button>
              <Button variant="text" sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}>Option 2</Button>
              <Button variant="text" sx={{ backgroundColor: "#ccc", borderRadius: "8px", textTransform: 'none', color: "#000", flexGrow: 1, flexShrink: 1 }}>Option 3</Button>
            </Stack>
          )}
          <Dialog
            open={openShoutOutDialog}
            onClose={handleCloseShoutOutDialog}
            PaperProps={{
              style: {
                width: '90vw',
                maxWidth: '700px',
                height: '90vh',
                maxHeight: '700px',
                borderRadius: '0'
              }
            }}
          >
            <DialogTitle
              sx={{
                position: 'relative',
                paddingRight: '48px',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
              }}
            >
              Give a shout out
              <IconButton
                edge="end"
                onClick={handleCloseShoutOutDialog}
                sx={{
                  position: 'absolute',
                  right: 15,
                  top: 8,
                  color: 'black'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 64px)',
                width: '100%',
                padding: 2,
                boxSizing: 'border-box'
              }}
            >
              <RecognitionForm type='Recognition' onClose={handleCloseShoutOutDialog} onSubmit={handleSubmit} userData={userData} sx={{ height: '100%', width: '100%' }} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openAwardDialog}
            onClose={handleCloseAwardDialog}
            PaperProps={{
              style: {
                width: '90vw',
                maxWidth: '700px',
                height: '90vh',
                maxHeight: '700px',
                borderRadius: '0'
              }
            }}
          >
            <DialogTitle
              sx={{
                position: 'relative',
                paddingRight: '48px',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
              }}
            >
              Award
              <IconButton
                edge="end"
                onClick={handleCloseAwardDialog}
                sx={{
                  position: 'absolute',
                  right: 15,
                  top: 8,
                  color: 'black'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 64px)',
                width: '100%',
                padding: 2,
                boxSizing: 'border-box'
              }}
            >
              <AwardForm type='Award' onClose={handleCloseAwardDialog} onSubmit={handleSubmit} userData={userData} sx={{ height: '100%', width: '100%' }} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openCelebrateDialog}
            onClose={handleCloseCelebrateDialog}
            PaperProps={{
              style: {
                width: '90vw',
                maxWidth: '700px',
                height: '90vh',
                maxHeight: '700px',
                borderRadius: '0'
              }
            }}
          >
            <DialogTitle
              sx={{
                position: 'relative',
                paddingRight: '48px',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
              }}
            >
              Celebrate
              <IconButton
                edge="end"
                onClick={handleCloseCelebrateDialog}
                sx={{
                  position: 'absolute',
                  right: 15,
                  top: 8,
                  color: 'black'
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 64px)',
                width: '100%',
                padding: 2,
                boxSizing: 'border-box'
              }}
            >
              <CelebrateForm type='Celebrate' onClose={handleCloseCelebrateDialog} onSubmit={handleSubmit} userData={userData} sx={{ height: '100%', width: '100%' }} />
            </DialogContent>
          </Dialog>
        </>
        </Grid>
      </Grid>
      {/* Recognition Form Dialog */}
      {showRecognitionForm && (
        <Dialog
          open={showRecognitionForm}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              width: '80vw',
              maxWidth: '700px',
              height: '70vh',
              maxHeight: '700px',
              borderRadius: '0',
              marginBottom: '16px',
            },
          }}
        >
          <DialogTitle
            sx={{
              position: 'relative',
              paddingRight: '48px',
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            Write a post
            <IconButton
              edge="end"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 15,
                top: 8,
                color: 'black',
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100% - 64px)',
              width: '100%',
              padding: 2,
              boxSizing: 'border-box',
            }}
          >
            <PostForm type="Post" onClose={handleCloseDialog} onSubmit={handleSubmit} userData={userData} />
          </DialogContent>
        </Dialog>
      )}
      {/* Display Posts */}
      <ErrorBoundary>
        <Grid container spacing={2} sx={{ paddingLeft: '10px' }}>
          {currentPosts.length > 0 ? (
            currentPosts.map((post, index) => {
              switch (post.type) {
                case 'Post':
                  return <PostCard 
                    key={index}
                    post={post}
                    index={index}
                    theme={theme}
                    userData={userData}
                  />;
                case 'Recognition':
                  return <RecognitionCard 
                    key={index}
                    post={post}
                    index={index}
                    theme={theme}
                    userData={userData}
                  />;
                case 'Award':
                  return <AwardCard 
                    key={index}
                    post={post}
                    index={index}
                    theme={theme}
                    userData={userData}
                  />
                default:
                  return null;
              }
            })
          ) : (
            <Typography variant="body1" sx={{ padding: '16px' }}>
              No posts available.
            </Typography>
          )}
        </Grid>
      </ErrorBoundary>
      {/* Pagination Controls */}
      <Box sx={{ padding: '10px' }}>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '14px', boxShadow: theme.shadows[3] }}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography variant="body1" sx={{ mx: 2, alignSelf: 'center' }}>
                Page {currentPage} of {Math.ceil(posts.length / postsPerPage)}
              </Typography>
              <Button
                variant="contained"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={indexOfLastPost >= posts.length}
              >
                Next
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

function ProfileFormRow({ userData }) {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysLeft = lastDayOfMonth.getDate() - today.getDate();
  
  return (
    <React.Fragment>
      <Grid container spacing={1} sx={{ justifyContent: 'center', padding: '15%' }}>
        <Grid item xs={12} container justifyContent="center" alignItems="center">
          <Avatar
            alt={userData?.name}
            src={"data:image/jpg;base64," + userData?.profilePic}
            sx={{ width: 100, height: 100 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', boxShadow: 'none', backgroundColor: '#fff' }}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: -3 }}>
              {userData?.name}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', boxShadow: 'none', backgroundColor: '#fff' }}>
            <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-wrap', marginTop: -1 }}>
              {userData.roleName}
            </Typography>
          </Paper>
        </Grid>
        <Grid container spacing={2} sx={{ paddingTop: '10px' }}>
          <Grid item xs={6}>
            <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'none' }}>
              <Typography variant="body2" style={{ fontSize: '10px', fontWeight: 'bold' }} sx={{ whiteSpace: 'nowrap' }}>
                My Points
              </Typography>
              <Box style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#a7e5b2', 
                justifyContent: 'center',
                padding: '1px', 
                borderRadius: 5, 
                width: '100%', 
                height :'40px',
                gap: '5px',
                boxSizing: 'border-box'

              }}>
                
                <StarsRoundedIcon style={{ 
                  color: '#ffcb24', 
                  backgroundColor: '#ffffff', 
                  position: 'relative', 
                  borderRadius: '50%',
                  zIndex: 2 
                }} />
                <Typography variant="body2" style={{ fontSize: '20px' }}>
                  {userData?.pointsReceived}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'left', boxShadow: 'none' }}>
              <Typography variant="body2" style={{ fontSize: '10px', fontWeight: 'bold' }} sx={{ whiteSpace: 'nowrap' }}>
                Points left to give
              </Typography>
              <Box style={{ 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#ffaca8',
                justifyContent: 'center', 
                padding: '1px', 
                borderRadius: 5, 
                width: '100%',
                height :'40px', 
                gap: '5px',
                boxSizing: 'border-box'
              }}>
                
                <StarsRoundedIcon style={{ 
                  color: '#ffcb24', 
                  backgroundColor: '#ffffff', 
                  position: 'relative', 
                  borderRadius: '50%',
                  zIndex: 2 
                }} />
                <Typography variant="body2" style={{ fontSize: '20px' }}>
                  {userData?.pointsToGive}
                </Typography>
              </Box>
            </Paper>
            <Typography variant="body2"
              style={{ 
                fontSize: '12px',
                fontWeight: 300, 
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
              {daysLeft} days left!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const TopPerformerFormList = ({ userData, view }) => {
  const [pyramidId, setPyramidId] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);

  useEffect(() => {
    if (view === 20 && pyramidId === null) {
      fetchPyramidId();
    } else {
      fetchTopPerformers();
    }
  }, [view, userData, pyramidId]);

  const fetchPyramidId = async () => {
    try {
      const response = await fetch(`http://localhost:8080/team/${userData.teamId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPyramidId(data.pyramidId);
    } catch (error) {
      console.error('Error fetching pyramid ID:', error);
    }
  };

  const fetchTopPerformers = async () => {
    try {
      let response;
      if (view === 10) {
        response = await fetch(`http://localhost:8080/users/top-performers/team/${userData.teamId}`);
      } else if (view === 20) {
        response = await fetch(`http://localhost:8080/users/top-performers/pyramid/${userData.pyramidId}`);
      } else {
        console.warn('Unhandled view type');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const top5 = data.slice(0, 5);
      const fifthPersonPoints = top5[4]?.totalPoints; 
      const sixthPersonPoints = data[5]?.totalPoints; 
      const includeSixthPerson = (fifthPersonPoints !== undefined && sixthPersonPoints !== undefined) && (sixthPersonPoints === fifthPersonPoints);
      let result;
      if (includeSixthPerson) {
          result = data.filter(person => person.totalPoints >= fifthPersonPoints).slice(0, 6);
      } else {
          result = top5;
      }
      setTopPerformers(result); 
    } catch (error) {
      console.error('Error fetching top performers:', error);
    }
  };

  return (
    <React.Fragment>
      <Grid container direction="column" spacing={0}>
        {topPerformers.length > 0 ?(
          topPerformers.map((user, index) => (
            <Grid item md={2} key={user.id}>
              <Paper style={{ display: 'flex', fontSize: '100%', alignItems: 'center', padding: '10px', textAlign: 'center', boxShadow: 'none' }}>
                <Avatar
                  alt={user.name}
                  src={`data:image/jpeg;base64,${user.profilePic}`}
                  style={{ width: '65px', height: '65px', marginRight: '8px' }} 
                />
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" style={{ fontSize: '100%' }}>{user.name}</Typography>
                  <Box style={{ display: 'flex', width: '100%', backgroundColor: '#fff' }}>
                    <StarsRoundedIcon style={{ color: '#ffcb24', fontSize: '20px', paddingTop: '2px', paddingRight: '5px' }} />
                    <Typography variant="body2" style={{ fontSize: '100%' }}>{user.totalPoints} points</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item style={{ width: '100%' }}>
            <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: 'none', width: '100%' }}>
              <Typography variant="h7" style={{ backgroundColor: "#FFCCCC", padding: '5px', borderRadius: '5px', fontSize: '16px', width: '100%', marginLeft: '12px' }}>
                No top performers available at the moment.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

const TrendingFormList = ({ userData, view }) => {
  const [trendingBehaviours, setTrendingBehaviours] = useState([]);
  const [pyramidId, setPyramidId] = useState(null);

  useEffect(() => {
    if (view === 20 && pyramidId === null) {
      fetchPyramidId();
    } else {
      fetchTrendingBehaviours();
    }
  }, [view, userData, pyramidId]);

  const fetchPyramidId = async () => {
    try {
      const response = await fetch(`http://localhost:8080/team/${userData.teamId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPyramidId(data.pyramidId);
    } catch (error) {
      console.error('Error fetching pyramid ID:', error);
    }
  };

  const fetchTrendingBehaviours = async () => {
    try {
      let response;
      if (view === 10) {
        response = await fetch(`http://localhost:8080/trending/behaviours/team/${userData.teamId}`);
      } else if (view === 20) {
        response = await fetch(`http://localhost:8080/trending/behaviours/pyramid/${userData.pyramidId}`);
      } else {
        console.warn('Unhandled view type');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrendingBehaviours(data);
    } catch (error) {
      console.error('Error fetching trending behaviours:', error);
    }
  };  

  return (
    <Grid container direction="column" spacing={2} style={{ width: '100%', paddingBottom: '8px', overflow: 'hidden' ,  paddingLeft:'16px'}}>
       {trendingBehaviours.length > 0 ? (
        trendingBehaviours.map((name, index) => (
        <Grid item md={2} key={index} style={{ width: '100%' }}>
          <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: 'none', width: '100%' }}>
            <Typography variant="h7" style={{ backgroundColor: "#95c0e7", padding: '5px', borderRadius: '5px', fontSize: '16px', width: '100%' }}>
              {name}
            </Typography>
          </Paper>
        </Grid>
      ))
    ):(
      <Grid item style={{ width: '100%' }}>
        <Paper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: 'none', width: '100%' }}>
          <Typography variant="h7" style={{ backgroundColor: "#FFCCCC", padding: '5px', borderRadius: '5px', fontSize: '16px', width: '100%', marginLeft: '12px' }}>
            No trending behaviours available at the moment.
          </Typography>
        </Paper>
      </Grid>
    )}
  </Grid>
  );
}

export default function MainBody({ userData, onPostSuccess, view }) {
  const postContainerRef = useRef(null);
  const [currentView, setCurrentView] = useState(null);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.5em'
  };
  
  useEffect(() => {
    if (userData) {
      setIsUserDataLoaded(true);
    }
  }, [userData]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/landingPage") {
      setCurrentView("Landing Page");
    } else if (path === "/landingPage/dashboard") {
      setCurrentView("My Dashboard");
    } else if (path === "/landingPage/redeem-points") {
      setCurrentView("Redeem Points");
    } else if (path === "/landingPage/insights-reporting") {
      setCurrentView("Insights & Reporting");
    } else if (path === "/landingPage/help") {
      setCurrentView("Help");
    }

    if (currentView !== null) {
      localStorage.setItem('currentView', JSON.stringify(currentView));
    }
  }, [location.pathname, currentView]);

  if (!isUserDataLoaded) {
    return <div style={loadingStyle}> Loading... </div>
  }

  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  return (
    <Grid
      container
      direction="row"
      spacing={1.5}
      sx={{
        height: '100vh',
        justifyContent: "space-between", 
        alignItems: "stretch",
        backgroundColor: '#ccc',
        paddingTop: '5px',
      }}
    >
      <Grid item md={2} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
          <Box sx={{ height: '350px', width: '100%', paddingBottom: '1px' }}>
            <ProfileFormRow userData={userData} />
          </Box>
          <Box sx={{ height: '30%', overflow: 'hidden', width: '100%' }}>
            <OptionsList setCurrentView={setCurrentView} navigate={navigate} />
          </Box>
        </Paper>
      </Grid>
      {currentView === "Landing Page" ? (
        <>
          <Grid item md={8} sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }} ref={postContainerRef}>
            <PostFormRow userData={userData} containerRef={postContainerRef} onPostSuccess={onPostSuccess} view={view} />
          </Grid>
          <Grid item md={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
            <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '16px', }}>
                <Typography variant="h6" sx={{ paddingBottom: '8px', textAlign: 'center' }}>
                  Trending Behaviours
                </Typography>
                <TrendingFormList userData={userData} view={view} />
                <Box sx={{ flexGrow: 0.5 }} />
                <Typography variant="h6" sx={{ paddingTop: '16px', textAlign: 'center' }}>
                  Top Performers
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'center', color: 'text.secondary', paddingBottom: '5px' }}>
                  Month of {currentMonthName} {currentYear}
                </Typography>
                  <TopPerformerFormList userData={userData} view={view} />
              </Box>
            </Paper>
          </Grid>
        </>
      ) : (
        <Grid item md={10} sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, '-ms-overflow-style': 'none', 'scrollbar-width': 'none', flexGrow: 1, backgroundColor: "white", border: "12px solid #ccc", borderLeft: "11px solid #ccc" }}>
          {currentView === 'My Dashboard' && <Dashboard userData={userData} />}
          {currentView === 'Redeem Points' && <RedeemPoints userData={userData} />}
          {currentView === 'Insights & Reporting' && <InsightsReporting userData={userData} />}
          {currentView === 'Help' && <Help userData={userData} />}
        </Grid>
      )}
    </Grid>
  );
}