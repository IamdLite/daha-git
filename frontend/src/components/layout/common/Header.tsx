import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import { useState, useEffect } from 'react';

const Header = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate authentication
  useEffect(() => {
    if (openCodeModal && code.join('').length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setOpenCodeModal(false);
        setIsLoading(false);
      }, 1500);
    }
  }, [code, openCodeModal]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAnchorEl(null);
    setCode(['', '', '', '', '', '']);
  };

  const handleOpen = () => {
    setOpen(true);
    setUsername('');
    setError('');
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!username.trim()) {
      setError('Введите ваш username');
      return;
    }

    if (!username.startsWith('@')) {
      setError('username должен начинаться с "@"');
      return;
    }

    console.log('Submitted username:', username);
    handleClose();
    setOpenCodeModal(true);
  };

  const handleCodeSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const fullCode = code.join('');
    console.log('Submitted code:', fullCode);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }
  };

  return (
    <>
      {/* Compact AppBar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          height: 60,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: '60px !important' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ScienceIcon
                sx={{
                  fontSize: '1.8rem',
                  mr: 1,
                  color: theme.palette.primary.main
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  marginTop: '10px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                DAHA
              </Typography>
            </Box>

            {/* Auth Section */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '0.875rem'
                    }}>
                      {username.charAt(1).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        '& .MuiMenuItem-root': {
                          fontSize: '0.875rem',
                          py: 1
                        }
                      }
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 1, color: 'text.primary' }}>
                      <Typography variant="body2">{username}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleOpen}
                  sx={{
                    boxShadow: 'none',
                    backgroundColor: '#000',
                    color: '#fff',
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    py: 0.8,
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: '#333',
                      boxShadow: 'none'
                    }
                  }}
                >
                  Вход
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Username Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxWidth: '400px',
            p: 3,
            width: '100%'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ p: 0, mb: 2, fontSize: '1.5rem', textAlign: 'center' }}>
            Вход
          </DialogTitle>
          <DialogContent sx={{ p: 0, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Ваш телеграмм username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.03)'
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  px: 2
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 0 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              Отправить
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Verification Code Dialog */}
      <Dialog
        open={openCodeModal}
        onClose={() => setOpenCodeModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxWidth: '450px',
            p: 3,
            width: '100%'
          }
        }}
      >
        <form onSubmit={handleCodeSubmit}>
          <DialogTitle sx={{ p: 0, mb: 1, fontSize: '1.5rem', textAlign: 'center' }}>
            Введите код
          </DialogTitle>
          <Typography sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
            Мы отправили 6-значный код в Telegram на аккаунт {username}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 4,
            gap: 1
          }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                id={`code-input-${index}`}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.2rem' }
                }}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.03)'
                  }
                }}
              />
            ))}
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: '8px'
              }}
            >
              Подтвердить
            </Button>
          )}
        </form>
      </Dialog>
    </>
  );
};

export default Header;