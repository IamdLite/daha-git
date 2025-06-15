import { CssBaseline, Box, ThemeProvider } from '@mui/material';
import MainPage from './components/layout/MainPage';
import Footer from './components/layout/common/Footer';
import Header from './components/layout/common/Header';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        {/* Header at the top (fixed or static) */}
        <Header />
        
        {/* Main content area that grows to push footer down */}
        <Box 
          component="main"
          sx={{
            flex: 1,  // Takes all available space
            py: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            mt: { xs: '56px', sm: '64px' } // Adjust based on your header height
          }}
        >
          <MainPage />
        </Box>
        
        {/* Footer at the bottom */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;