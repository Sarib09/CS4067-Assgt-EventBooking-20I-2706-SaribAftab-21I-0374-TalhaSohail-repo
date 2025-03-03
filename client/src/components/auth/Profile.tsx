import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useQuery } from 'react-query';
import { authService } from '../../services/authService';
import { Person, Email, Phone, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { data: user, isLoading, error } = useQuery('currentUser', authService.getCurrentUser);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Error loading profile. Please try again later.
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="warning" sx={{ mt: 4 }}>
        Please log in to view your profile.
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mr: 3
            }}
          >
            {user.firstName[0]}{user.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Chip
              label="Active Member"
              color="success"
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {user.phone && (
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {user.phone}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {format(new Date(), 'MMMM yyyy')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Last login: {format(new Date(), 'MMMM d, yyyy')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 