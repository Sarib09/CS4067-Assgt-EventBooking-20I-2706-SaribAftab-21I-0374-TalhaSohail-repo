import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import { eventService } from '../../services/eventService';
import { bookingService } from '../../services/bookingService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openBooking, setOpenBooking] = useState(false);
  const [tickets, setTickets] = useState(1);

  const { data: event, isLoading, error } = useQuery(
    ['event', id],
    () => eventService.getEvent(id || ''),
    {
      enabled: !!id,
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to load event details');
        navigate('/events');
      }
    }
  );

  const bookingMutation = useMutation(
    (data: { eventId: string; tickets: number }) =>
      bookingService.createBooking(data),
    {
      onSuccess: () => {
        toast.success('Booking successful!');
        setOpenBooking(false);
        navigate('/bookings');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create booking');
      }
    }
  );

  useEffect(() => {
    if (!id) {
      navigate('/events');
    }
  }, [id, navigate]);

  if (!id) return null;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load event details" onRetry={() => navigate('/events')} />;
  if (!event) return <ErrorMessage message="Event not found" onRetry={() => navigate('/events')} />;

  const handleBooking = () => {
    if (!event._id) {
      toast.error('Invalid event ID');
      return;
    }
    
    bookingMutation.mutate({
      eventId: event._id,
      tickets: tickets
    });
  };

  return (
    <Box>
      <Card>
        {event.image && (
          <Box
            component="img"
            src={event.image}
            alt={event.title}
            sx={{ width: '100%', height: 300, objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {event.title}
              </Typography>
              <Chip 
                label={event.category} 
                color="primary" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`$${event.price}`} 
                color="secondary" 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Date:</strong> {format(new Date(event.date), 'PPP')}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Time:</strong> {event.time}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Location:</strong> {event.location}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1">
                <strong>Available Tickets:</strong> {event.availableTickets}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Organizer:</strong> {event.organizer}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setOpenBooking(true)}
                disabled={event.availableTickets === 0}
              >
                {event.availableTickets === 0 ? 'Sold Out' : 'Book Tickets'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={openBooking} onClose={() => setOpenBooking(false)}>
        <DialogTitle>Book Tickets</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Number of Tickets"
              type="number"
              value={tickets}
              onChange={(e) => setTickets(Math.max(1, Math.min(parseInt(e.target.value) || 1, event.availableTickets)))}
              fullWidth
              InputProps={{
                inputProps: {
                  min: 1,
                  max: event.availableTickets
                }
              }}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Total Price: ${(event.price * tickets).toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button 
            onClick={handleBooking}
            variant="contained"
            color="primary"
            disabled={bookingMutation.isLoading}
          >
            {bookingMutation.isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetails; 