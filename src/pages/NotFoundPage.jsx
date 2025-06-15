import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>404 - Not Found</Typography>
      <Typography color="textSecondary" paragraph>
        Oops! The page you're looking for seems to have taken a detour.
      </Typography>
      <Button component={Link} to="/" variant="contained" color="primary">
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;