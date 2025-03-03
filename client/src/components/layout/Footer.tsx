import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[200]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Event Booking
          </Link>{' '}
          {currentYear}
          {'. All rights reserved.'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          <Link color="inherit" href="/about" sx={{ mx: 1 }}>
            About
          </Link>
          |
          <Link color="inherit" href="/contact" sx={{ mx: 1 }}>
            Contact
          </Link>
          |
          <Link color="inherit" href="/privacy" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link color="inherit" href="/terms" sx={{ mx: 1 }}>
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 