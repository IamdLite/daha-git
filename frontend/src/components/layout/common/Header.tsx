import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast as hotToast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { telegramLogin, TelegramUser } from "../../../api/auth";
import logo from "../../../assets/daha-logo.png";

export const TELEGRAM_BOT_NAME = "pooocheeemy_bot";
export const TELEGRAM_AUTH_URL = "https://daha.linkpc.net/auth/telegram";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showWidget, setShowWidget] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("access_token", token);
      localStorage.setItem("username", "user");
      setIsAuthenticated(true);
      setUsername("user");
      hotToast.success("Login successful!");
      navigate("/");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("access_token");

    if (storedAuth === "true" && storedUsername && storedToken) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (!showWidget || !widgetContainerRef.current) return;

    const container = widgetContainerRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", TELEGRAM_BOT_NAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", TELEGRAM_AUTH_URL);
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    window.onTelegramAuth = async (user: TelegramUser) => {
      setIsLoading(true);
      try {
        const fallbackUsername = user.username || user.first_name || `user_${user.id.toString().slice(-4)}`;
        const { access_token } = await telegramLogin({
          ...user,
          username: fallbackUsername
        });

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("username", fallbackUsername);
        setIsAuthenticated(true);
        setUsername(fallbackUsername);
        setShowWidget(false);
        hotToast.success(`Welcome ${fallbackUsername}!`);
        navigate("/");
      } catch (error) {
        hotToast.error(error instanceof Error ? error.message : "Login failed");
      } finally {
        setIsLoading(false);
      }
    };

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
      delete window.onTelegramAuth;
    };
  }, [showWidget, navigate]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setAnchorEl(null);
    hotToast.success("Logged out successfully");
  };

  const handleToggleWidget = () => {
    setShowWidget((prev) => !prev);
  };

  return (
    <>
      <Toaster position="top-right" />
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          height: 60,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: "60px !important" }}>
            <Box
              component="a"
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                height: "60px",
                gap: 1,
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
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
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: "0.875rem",
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
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
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <MenuItem disabled sx={{ opacity: 1, color: "text.primary" }}>
                      <Typography variant="body2">{username}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleToggleWidget}
                    sx={{
                      boxShadow: "none",
                      backgroundColor: "#000",
                      color: "#fff",
                      textTransform: "none",
                      borderRadius: "8px",
                      px: 3,
                      py: 0.8,
                      fontSize: "0.875rem",
                      whiteSpace: "nowrap",
                      minWidth: "fit-content",
                      "&:hover": {
                        backgroundColor: "#333",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {showWidget ? "Скрыть" : "Вход"}
                  </Button>
                  {showWidget && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 60,
                        right: 16,
                        bgcolor: "background.paper",
                        p: 3,
                        borderRadius: "12px",
                        boxShadow: 3,
                        zIndex: 9999,
                        minWidth: { xs: "90vw", sm: "320px" },
                        maxWidth: "100%",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                        Вход через Telegram
                      </Typography>
                      <Box
                        ref={widgetContainerRef}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: 48,
                          width: "100%",
                        }}
                      />
                      {isLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;