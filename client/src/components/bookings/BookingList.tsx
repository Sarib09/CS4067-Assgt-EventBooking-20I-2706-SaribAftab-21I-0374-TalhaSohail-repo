import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Button
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format, isValid, parseISO } from 'date-fns';
import { bookingService, Booking } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'error';
    case 'refunded':
      return 'warning';
    default:
      return 'default';
  }
};

const formatEventDate = (dateStr?: string) => {
  if (!dateStr) return 'Date not available';
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
};

const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery<Booking[]>(
    'bookings',
    bookingService.getUserBookings
  );

  const cancelBookingMutation = useMutation(
    (bookingId: string) => bookingService.updateBookingStatus(bookingId, 'cancelled'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings');
      },
    }
  );

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

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
        Error loading bookings. Please try again later.
      </Alert>
    );
  }

  if (!bookings?.length) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You haven't made any bookings yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/events')}
            sx={{ mt: 2 }}
          >
            Browse Events
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => (
          <Grid item xs={12} key={booking.id}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    component="img"
                    src={booking.event?.image || '/default-event.jpg'}
                    alt={booking.event?.title || 'Event'}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {booking.event?.title || 'Event Unavailable'}
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status) as 'success' | 'error' | 'warning' | 'default'}
                      size="small"
                    />
                  </Box>

                  <Typography color="text.secondary" gutterBottom>
                    {formatEventDate(booking.event?.date)} {booking.event?.time ? `at ${booking.event.time}` : ''}
                  </Typography>

                  <Typography gutterBottom>
                    {booking.tickets} {booking.tickets === 1 ? 'ticket' : 'tickets'}
                  </Typography>

                  <Typography color="primary" variant="h6" gutterBottom>
                    Total: ${booking.amount}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {booking.event?._id ? (
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/events/${booking.event._id}`)}
                      >
                        View Event
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        disabled
                        title="Event details unavailable"
                      >
                        Event Unavailable
                      </Button>
                    )}
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancelBookingMutation.isLoading}
                      >
                        {cancelBookingMutation.isLoading ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookingList; 