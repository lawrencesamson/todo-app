import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { fetchAllTodos, createTodo, updateTodo, deleteTodo } from '../api/todo';

const ITEMS_PER_PAGE = 10;

const TodoList = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar(); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingTodo, setDeletingTodo] = useState(null);

  const [addTitle, setAddTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCompleted, setEditCompleted] = useState(false);

  const {
    data: allTodos,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchAllTodos,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (allTodos) {
      setPage(0); 
    }
  }, [allTodos, page, rowsPerPage]); 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentTodos = React.useMemo(() => {
    if (allTodos) {
      return allTodos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
    return [];
  }, [allTodos, page, rowsPerPage]);

  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodoFromApi) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsAddModalOpen(false);
      setAddTitle('');
      enqueueSnackbar(`"${newTodoFromApi.title}" has been successfully added.`, { variant: 'success' }); 
    },
    onError: (err) => {
      enqueueSnackbar(err.message || 'Failed to add todo', { variant: 'error' }); 
    },
  });

  const handleAddOpen = () => setIsAddModalOpen(true);
  const handleAddClose = () => {
    setIsAddModalOpen(false);
    setAddTitle('');
  };
  const handleAddSubmit = () => {
    if (addTitle.trim()) {
      addTodoMutation.mutate({ title: addTitle });
    }
  };

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: (updatedTodoFromApi) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', updatedTodoFromApi?.id] });
      setIsEditModalOpen(false);
      setEditingTodo(null);
      enqueueSnackbar(`"${updatedTodoFromApi.title}" has been successfully updated.`, { variant: 'success' }); 
    },
    onError: (err) => {
      enqueueSnackbar(err.message || 'Failed to update todo', { variant: 'error' }); 
    },
  });

  const handleEditOpen = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
    setIsEditModalOpen(true);
  };
  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
    setEditTitle('');
    setEditCompleted(false);
  };
  const handleEditSubmit = () => {
    if (editingTodo) {
      updateTodoMutation.mutate({ id: editingTodo.id, title: editTitle, completed: editCompleted });
    }
  };

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsDeleteConfirmOpen(false);
      setDeletingTodo(null);
      enqueueSnackbar('The todo has been successfully deleted.', { variant: 'success' }); 
    },
    onError: (err) => {
      enqueueSnackbar(err.message || 'Failed to delete todo', { variant: 'error' }); 
    },
  });

  const handleDeleteOpen = (todo) => {
    setDeletingTodo(todo);
    setIsDeleteConfirmOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteConfirmOpen(false);
    setDeletingTodo(null);
  };
  const handleDeleteConfirm = () => {
    if (deletingTodo) {
      deleteTodoMutation.mutate(deletingTodo.id);
    }
  };

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}><CircularProgress /></Box>;
  }

  if (isError) {
    return <Alert severity="error">{error?.message || 'An error occurred.'}</Alert>;
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">Your Todos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddOpen}>
          Add New Todo
        </Button>
      </Box>
      <List>
        {currentTodos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <Box>
                <IconButton component={Link} to={`/todos/${todo.id}`} aria-label="details">
                  <VisibilityIcon />
                </IconButton>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(todo)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteOpen(todo)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
            sx={{
              backgroundColor: todo.completed ? '#e8f5e9' : 'white',
              '&:hover': {
                backgroundColor: todo.completed ? '#d0f0d0' : '#f0f0f0',
              },
              borderBottom: '1px solid #eee',
            }}
          >
            <Checkbox checked={todo.completed} onChange={() => handleEditOpen(todo)} />
            <ListItemText
              primary={todo.title}
              primaryTypographyProps={{ style: { textDecoration: todo.completed ? 'line-through' : 'none' } }}
              secondary={<Chip label={todo.completed ? 'Completed' : 'Pending'} color={todo.completed ? 'success' : 'warning'} size="small" />}
            />
          </ListItem>
        ))}
      </List>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={allTodos?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={isAddModalOpen} onClose={handleAddClose}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo Title"
            type="text"
            fullWidth
            variant="standard"
            value={addTitle}
            onChange={(e) => setAddTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSubmit} disabled={addTodoMutation.isPending}>Add Todo</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditModalOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo Title"
            type="text"
            fullWidth
            variant="standard"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <Checkbox checked={editCompleted} onChange={(e) => setEditCompleted(e.target.checked)} />
          <Typography variant="body2" component="span">Mark as Completed</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} disabled={updateTodoMutation.isPending}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the todo: "<strong>{deletingTodo?.title}</strong>"?</Typography>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>No, Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleteTodoMutation.isPending}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TodoList;