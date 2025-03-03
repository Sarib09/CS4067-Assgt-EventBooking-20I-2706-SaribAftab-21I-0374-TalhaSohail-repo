import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Notifications as NotificationsIcon, AccountCircle } from '@mui/icons-material';
import { authService } from '../../services/authService';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Event Booking
        </Typography>

        <Button color="inherit" onClick={() => navigate('/events')}>
          Events
        </Button>

        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate('/bookings')}>
              My Bookings
            </Button>
            <IconButton
              color="inherit"
              onClick={() => navigate('/notifications')}
              sx={{ marginLeft: 1 }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ marginLeft: 1 }}
            >
              <AccountCircle />
            </IconButton>
            <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 1 }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header; 