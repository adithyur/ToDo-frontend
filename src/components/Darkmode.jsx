import React from 'react';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Darkmode({ darkMode, toggleDarkMode }) {
  const theme = useTheme();

  const colorMode = {
    toggleColorMode: toggleDarkMode,
  };

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        bottom: 16,
        right: 16,
      }}
    >
      <ThemeProvider theme={customTheme}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{bgcolor: darkMode ? '#eeeeee' : 'white'}}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </ThemeProvider>
    </Box>
  );
}

export default Darkmode;
