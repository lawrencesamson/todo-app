import React from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button, CircularProgress, Alert, Chip } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import { fetchTodoById } from '../api/todo';

const TodoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: todo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(id),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 60,
    onError: (err) => {
      if (err.message === 'Todo not found') {
        navigate('/404');
      }
    },
  });

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress /></Box>;
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.message || 'An error occurred while fetching todo details.'}
      </Alert>
    );
  }

  if (!todo) {
      return (
          <Alert severity="warning">
              Todo Not Found
          </Alert>
      );
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, mb: 2 }}>
        <Typography variant="h6">Todo Details</Typography>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} variant="outlined">
          Back to List
        </Button>
      </Box>
      <CardContent>
        <Typography variant="h5" gutterBottom>{todo.title}</Typography>
        <Typography variant="body1" gutterBottom>ID: {todo.id}</Typography>
        <Typography variant="body1" gutterBottom>User ID: {todo.userId}</Typography>
        <Chip label={todo.completed ? 'Completed' : 'Pending'} color={todo.completed ? 'success' : 'warning'} />
      </CardContent>
    </Card>
  );
};

export default TodoDetailPage;