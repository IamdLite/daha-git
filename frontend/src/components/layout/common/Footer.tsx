
import { Box, Container, Typography, Link, Divider, useTheme, Stack, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import { useEffect, useRef } from 'react';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  // Debug footer height
  useEffect(() => {
    if (footerRef.current) {
      console.log('Footer height:', footerRef.current.offsetHeight);
    }
  }, []);

  return (
    <Box
      component="footer"
      ref={footerRef}
      key="unique-footer"
      data-testid="footer"
      sx={{
        position: 'relative', // Stays at page bottom
        py: 3,
        mt: 'auto',
        backgroundColor: theme.palette.grey[50],
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 1000, // Above page content, below FiltersPanel
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mr: 4,
              }}
            >
              DAHA
            </Typography>
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.85rem' }}>
                О нас
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.85rem' }}>
                Как добавить ресурс
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: '0.85rem' }}>
                Партнерам
              </Link>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" aria-label="github" sx={{ color: theme.palette.text.secondary }}>
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="telegram" sx={{ color: theme.palette.text.secondary }}>
              <TelegramIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="email" sx={{ color: theme.palette.text.secondary }}>
              <EmailIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
        <Divider sx={{ my: 2, opacity: 0.6 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            © {currentYear} DAHA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
