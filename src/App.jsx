import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import TodoList from './pages/TodoList';
import TodoDetailPage from './pages/TodoDetailPage';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const commonBlue = '#1976d2';

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: commonBlue }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ALT SCHOOL AFRICA TODO APP
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/todos/:id" element={<TodoDetailPage />} />
              <Route path="/test-error" element={<ErrorBoundary />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </Box>
        <Box component="footer" sx={{ p: 2, bgcolor: commonBlue, color: 'white', textAlign: 'center' }}>
          <Typography variant="body2">
            AltSchool Africa ©{new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
  );
}

const TestErrorComponent = () => {
  throw new Error("This is a simulated error for the Error Boundary!");
};

export default App;