
import { AppBar, Toolbar, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        top: 0, // Top of viewport
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        zIndex: 1300, // Above Header
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: theme.palette.text.primary,
            textDecoration: 'none',
          }}
        >
          Daha Platform
        </Typography>
        <Button
          component={Link}
          to="/login"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: '50px', px: 2.5, mr: 2, fontWeight: 500 }}
        >
          Login
        </Button>
        <Button
          component={Link}
          to="/register"
          color="primary"
          variant="contained"
          sx={{ borderRadius: '50px', px: 2.5, fontWeight: 500 }}
        >
          Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
