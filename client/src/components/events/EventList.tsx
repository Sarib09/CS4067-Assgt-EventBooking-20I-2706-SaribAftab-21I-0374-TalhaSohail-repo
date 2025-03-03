import React, { useState } from 'react';
import {
  Grid,
  Container,
  Typography,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

import { eventService, Event, CreateEventData } from '../../services/eventService';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const categories = [
  'All',
  'Conference',
  'Workshop',
  'Seminar',
  'Concert',
  'Exhibition',
  'Other'
];

const EventList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openCreate, setOpenCreate] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEventData>();

  const { data: events, isLoading, error } = useQuery<Event[]>(
    'events',
    eventService.getAllEvents
  );

  const createEventMutation = useMutation(
    (data: CreateEventData) => eventService.createEvent(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events');
        toast.success('Event created successfully!');
        setOpenCreate(false);
        reset();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create event');
      }
    }
  );

  const onSubmit = (data: CreateEventData) => {
    createEventMutation.mutate(data);
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading events. Please try again later.
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Events</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          Create Event
        </Button>
      </Box>

      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Upcoming Events
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Search events"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {filteredEvents?.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>

        {filteredEvents?.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            No events found matching your criteria.
          </Typography>
        )}
      </Container>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Event</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register('title', { required: 'Title is required' })}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('description', { required: 'Description is required' })}
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('date', { required: 'Date is required' })}
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('time', { required: 'Time is required' })}
                  label="Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.time}
                  helperText={errors.time?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('location', { required: 'Location is required' })}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('category', { required: 'Category is required' })}
                  select
                  label="Category"
                  fullWidth
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  label="Price"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('totalTickets', { 
                    required: 'Total tickets is required',
                    min: { value: 1, message: 'Must have at least 1 ticket' }
                  })}
                  label="Total Tickets"
                  type="number"
                  fullWidth
                  error={!!errors.totalTickets}
                  helperText={errors.totalTickets?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('organizer', { required: 'Organizer is required' })}
                  label="Organizer"
                  fullWidth
                  error={!!errors.organizer}
                  helperText={errors.organizer?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('image')}
                  label="Image URL (optional)"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={createEventMutation.isLoading}
            >
              {createEventMutation.isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EventList; 