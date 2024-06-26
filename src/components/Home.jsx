import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { Container, Box, TextField, Button, Tooltip, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';

import ButtonGroup from '@mui/material/ButtonGroup';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

import Darkmode from './Darkmode';
import BasicModalDialog from './Addtask';
import StickyHeadTable from './StickyHeadTable';

initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MESSUREMENTID
});

function Home() {
  const [todo, setTodo] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeButton, setActiveButton] = useState('today');
  const [user, setUser] = useState(null);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);


  const auth = getAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
      } else {
        console.log('User is not authenticated.');
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signin = (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('authid', user.uid);
        console.log("login successfully")
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const userid = localStorage.getItem('authid');

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log('User signed out successfully.');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(todo);
    // setTodo('');
  };

  const handleTaskChange = (e) => {
    setTodo(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode state
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box style={{margin:'-8px'}} sx={{ bgcolor: darkMode ? '#121212' : '#eeeeee', minHeight: '100vh', py: 4 }}>
        <Container>
          <Box mt={-2} sx={{ backgroundImage: `url(${process.env.PUBLIC_URL}/AdobeStock_532236382_Preview.jpeg)`,backgroundSize:'cover', height:'100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Typography style={{ fontFamily: 'Arial, sans-serif',fontSize:'32px',textAlign:'center', fontWeight: 'bold', color:'#eeeeee' }}>ToDo App</Typography>
            {/* <Avatar>H</Avatar> */}
            <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <AccountCircle sx={{color:'white'}}/>
          </IconButton>
        </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            bgcolor: darkMode ? 'black' : '#eeeeee',
            color: darkMode ? '#eeeeee' : '#121212',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: darkMode ? 'black' : '#eeeeee',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user ? (
          <MenuItem onClick={logout}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{color: darkMode ? '#eeeeee' : '#121212'}} onClick={logout}/>
            </ListItemIcon>
            Logout
          </MenuItem>
        ) : (
          <MenuItem onClick={signin}>
            <ListItemIcon>
              <LoginIcon fontSize="small" sx={{color: darkMode ? '#eeeeee' : '#121212'}}/>
            </ListItemIcon>
            Login
          </MenuItem>
        )}
      </Menu>
          </Box>
          <Box mt={4} sx={{display:'flex', justifyContent: 'center'}}>
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button
                sx={{
                  // paddingX: 4,
                  // paddingY: 1,
                  //bgcolor:'#0d47a1'
                  borderRight: 'none',
                  backgroundColor: activeButton === 'today' ? 'primary.main' : '#96d1d9',
                  color: activeButton === 'today' ? 'primary.contrastText' : '#000',
                }}
                onClick={() => handleButtonClick('today')}
              >
                Today
              </Button>
              <Button
                sx={{
                  // paddingX: 4,
                  marginX: 0.1,
                  borderRight: 'transparent',
                  backgroundColor: activeButton === 'pending' ? 'primary.main' : '#96d1d9',
                  color: activeButton === 'pending' ? 'primary.contrastText' : '#000',
                }}
                onClick={() => handleButtonClick('pending')}
              >
                Pending
              </Button>
              <Button
                sx={{
                  // paddingX: 4,
                  backgroundColor: activeButton === 'completed' ? 'primary.main' : '#96d1d9',
                  color: activeButton === 'completed' ? 'primary.contrastText' : '#000',
                }}
                onClick={() => handleButtonClick('completed')}
              >
                Completed
              </Button>
            </ButtonGroup>
          </Box>
          <Box mt={4} sx={{display:'flex', justifyContent:'space-between'}}>
            <Typography sx={{fontWeight:'bold', fontSize: { xs: '24px', md: '30px' }, display:'flex', justifyContent:'center', color: darkMode ? '#fff' : '#28282B'}}> Tasks </Typography>
            <BasicModalDialog/>
          </Box>
          <Box mt={3}>
            <StickyHeadTable activeButton={activeButton} darkMode={darkMode}/>
          </Box>
          <Darkmode darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Container>
      </Box>
    </LocalizationProvider>
  );
}

export default Home;