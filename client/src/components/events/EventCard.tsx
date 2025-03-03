import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  useTheme
} from '@mui/material';
import { Event } from '../../services/eventService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LocationOn, Event as EventIcon } from '@mui/icons-material';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={event.image || '/default-event.jpg'}
        alt={event.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {event.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
          <Typography variant="body2" color="text.secondary">
            {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ mr: 1, color: theme.palette.text.secondary }} />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip
            label={event.category}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="h6" color="primary">
            ${event.price}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {event.availableTickets} tickets left
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard; 