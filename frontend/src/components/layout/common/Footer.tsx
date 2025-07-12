import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, Container, Typography, Link, Divider, useTheme, Stack, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import logo from "../../../assets/daha-logo.png";

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (footerRef.current) {
      console.log("Footer height:", footerRef.current.offsetHeight);
    }
  }, []);

  return (
    <Box
      component="footer"
      ref={footerRef}
      key="unique-footer"
      data-testid="footer"
      sx={{
        position: "relative",
        py: 3,
        mt: "auto",
        backgroundColor: theme.palette.grey[50],
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 1000,
      }}
    >
      <Container maxWidth="lg">
        {/* Logo and Links Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {/* Clickable Logo */}
          <Link href="/" sx={{ textDecoration: "none", cursor: "pointer" }}>
            <img
              src={logo}
              alt="DAHA Logo"
              style={{
                height: "40px",
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </Link>

          {/* Navigation Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, md: 0 },
            }}
          >
            <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: "0.85rem" }}>
                О нас
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: "0.85rem" }}>
                Как добавить ресурс
              </Link>
              <Link href="#" color="text.secondary" underline="hover" sx={{ fontSize: "0.85rem" }}>
                Партнерам
              </Link>
            </Stack>
          </Box>

          {/* Social Icons */}
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

        {/* Copyright */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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