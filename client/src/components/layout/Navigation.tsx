import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import {
  Person,
  BookOnline,
  Logout,
  Login,
  EventNote,
  HowToReg
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { Notifications } from '../Notifications';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700
            }}
          >
            Event Booking
          </Typography>

          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/events"
              startIcon={<EventNote />}
            >
              Events
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile"
                  startIcon={<Person />}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/bookings"
                  startIcon={<BookOnline />}
                >
                  My Bookings
                </Button>
                <Notifications />
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  startIcon={<Login />}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/register"
                  startIcon={<HowToReg />}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 