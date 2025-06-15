import React from 'react';
import { Typography, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" gutterBottom>Whoops! Something went wrong.</Typography>
          <Typography color="textSecondary" paragraph>
            It looks like there was an unexpected error. Please try refreshing the page.
          </Typography>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 2, bgcolor: '#fef0f0', border: '1px solid #ffccc7', borderRadius: '4px', p: 2, overflow: 'auto', fontSize: '0.8em' }}>
              <Typography variant="subtitle2" color="error" gutterBottom>Error Details (Development Only):</Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#cf1322' }}>
                {this.state.error.toString()}
                {this.state.errorInfo && <Typography component="div" sx={{ mt: 1 }}><strong>Component Stack:</strong><pre style={{ color: '#cf1322' }}>{this.state.errorInfo.componentStack}</pre></Typography>}
              </pre>
            </Box>
          )}
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;