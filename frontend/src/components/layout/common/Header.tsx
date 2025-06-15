
import { AppBar, Toolbar, Typography, Container, Box, Button, Avatar, Menu, MenuItem, useTheme, SvgIcon } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect } from 'react';

// VK Icon as SvgIcon (official VK logo from UXWing)
const VKIcon = (props: any) => (
  <SvgIcon {...props}>
    <path d="M20.01 3.22c.2-.12.36-.3.36-.52 0-.4-.32-.62-.68-.62H4.31c-.36 0-.68.22-.68.62 0 .22.16.4.36.52C2.29 4.4.91 6.7.91 9.38v5.24c0 2.68 1.38 4.98 3.38 6.16-.2.12-.36.3-.36.52 0 .4.32.62.68.62h15.38c.36 0 .68-.22.68-.62 0-.22-.16-.4-.36-.52 2-1.18 3.38-3.48 3.38-6.16V9.38c0-2.68-1.38-4.98-3.38-6.16zm-7.67 15.14c-1.28 0-2.44-.58-3.3-1.58-.58-.68-.96-1.5-1.18-2.36h-2.1c-.3 0-.5-.22-.5-.5s.2-.5.5-.5h1.92c-.04-.5-.04-1.02 0-1.54h-1.92c-.3 0-.5-.22-.5-.5s.2-.5.5-.5h2.04c.24-1.2.74-2.26 1.5-3.12.92-1.04 2.18-1.66 3.54-1.66 1.36 0 2.62.62 3.54 1.66.76.86 1.26 1.92 1.5 3.12h2.04c.3 0 .5.22.5.5s-.2.5-.5.5h-1.92c.04.52.04 1.04 0 1.54h1.92c.3 0 .5.22.5.5s-.2.5-.5.5h-2.1c-.22.86-.6 1.68-1.18 2.36-.86 1-2.02 1.58-3.3 1.58zm0-1.5c.96 0 1.84-.44 2.46-1.18.46-.54.76-1.2.94-1.88h-6.8c.18.68.48 1.34.94 1.88.62.74 1.5 1.18 2.46 1.18zm-2.74-4.54c.02.44.02.88 0 1.32h5.48c-.02-.44-.02-.88 0-1.32h-5.48zm2.74-6.28c-.96 0-1.84.44-2.46 1.18-.46.54-.76 1.2-.94 1.88h6.8c-.18-.68-.48-1.34-.94-1.88-.62-.74-1.5-1.18-2.46-1.18z" />
  </SvgIcon>
);

const Header: React.FC = () => {
  const theme = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulated auth state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Load Telegram Login Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);

    // Telegram auth callback
    (window as any).onTelegramAuth = (user: { id: number; first_name: string; username?: string }) => {
      console.log('Telegram Auth:', user);
      setIsAuthenticated(true); // Simulate login
      // TODO: Send user data to backend
    };

    return () => {
      document.body.removeChild(script);
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleMenuClose();
    // TODO: Implement logout
  };

  const handleVKLogin = () => {
    console.log('VK Login clicked');
    // TODO: Implement VK OAuth
  };

  const handleEmailLogin = () => {
    console.log('Email Login clicked');
    // TODO: Implement Email login
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        top: 0,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 1200, // Above all
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon
              sx={{
                fontSize: { xs: '1.8rem', md: '2.2rem' },
                mr: 2,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DAHA
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<TelegramIcon />}
                  // Replace with env variables
                  data-tg-login="YourBotName" // e.g., @KnowledgeUniverseBot
                  data-size="medium"
                  data-auth-url="https://yourdomain.com/auth/telegram"
                  sx={{ borderRadius: '50px', px: 2 }}
                >
                  Telegram
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<VKIcon />}
                  onClick={handleVKLogin}
                  sx={{ borderRadius: '50px', px: 2 }}
                >
                  VK
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={handleEmailLogin}
                  sx={{ borderRadius: '50px', px: 2 }}
                >
                  Email
                </Button>
              </>
            ) : (
              <>
                <Avatar
                  onClick={handleMenuOpen}
                  sx={{ cursor: 'pointer', bgcolor: theme.palette.primary.main }}
                >
                  U
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
