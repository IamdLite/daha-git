import TelegramIcon from "@mui/icons-material/Telegram";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { requestTelegramCode, verifyTelegramCode } from "../../../api/auth";
import logo from "../../../assets/daha-logo.png";

const TELEGRAM_BOT = "@bot_DAHA_bot";
const TELEGRAM_BOT_LINK = "https://t.me/bot_DAHA_bot";

const botStepInstructions = (
  <Box sx={{ pb: 2 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
      Для авторизации выполните следующие шаги:
    </Typography>
    <Box component="ol" sx={{ pl: 3 }}>
      <li style={{ margin: "0 0 8px 0" }}>
        Перейдите в{" "}
        <Button
          component="a"
          target="_blank"
          rel="noopener noreferrer"
          href={TELEGRAM_BOT_LINK}
          startIcon={<TelegramIcon />}
          variant="contained"
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: "none",
            px: 2,
            background: "#229ED9",
            color: "#fff",
            borderRadius: "8px",
            ml: 0.5,
            mb: "-2px",
            "&:hover": {
              background: "#229ed9cc",
            },
          }}
        >
          {TELEGRAM_BOT}
        </Button>
      </li>
      <li style={{ margin: "0 0 8px 0" }}>
        В боте отправьте команду <b>/setfilters</b> и выберите ваши предпочтения.
      </li>
      <li>
        Вернитесь на сайт и войдите под своим Telegram-логином.
      </li>
    </Box>
  </Box>
);

const Header = () => {
  const theme = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"username" | "code" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [errorMsg, setErrorMsg] = useState(false);

  // refs для управления фокусом
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

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
    if (step === "username" && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
    if (step === "code" && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

 // const botErrorMsg = "Не удалось выполнить авторизацию.";

  const setBotError = () => setErrorMsg(true);

  const handleRequestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(false);
    const normalizedUsername = username.replace(/^@/, "");
    if (!normalizedUsername || normalizedUsername.length < 5) {
      setBotError();
      setIsLoading(false);
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(normalizedUsername)) {
      setBotError();
      setIsLoading(false);
      return;
    }
    try {
      await requestTelegramCode({ username: normalizedUsername });
      setStep("code");
      toast.success(
        <span>
          Код выслан! Проверьте сообщения в боте{" "}
          <Button
            href={TELEGRAM_BOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            variant="outlined"
            startIcon={<TelegramIcon />}
            sx={{ ml: 1, mb: "-2px", fontWeight: 600 }}
          >
            {TELEGRAM_BOT}
          </Button>
        </span>
      );
    } catch {
      setBotError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(false);
    const normalizedUsername = username.replace(/^@/, "");
    if (!normalizedUsername || normalizedUsername.length < 5) {
      setBotError();
      setIsLoading(false);
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(normalizedUsername)) {
      setBotError();
      setIsLoading(false);
      return;
    }
    if (!code || code.length < 4 || code.length > 6 || !/^\d+$/.test(code)) {
      setBotError();
      setIsLoading(false);
      return;
    }
    try {
      const response = await verifyTelegramCode({
        username: normalizedUsername,
        verification_code: code,
      });
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", normalizedUsername);
      setIsAuthenticated(true);
      setUsername(normalizedUsername);
      setStep(null);
      toast.success(`Добро пожаловать, ${normalizedUsername}!`);
    } catch {
      setBotError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRequestCode();
    }
  };

  const handleCodeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyCode();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    setAnchorEl(null);
    setStep(null);
    toast.success("Вы вышли из аккаунта");
  };

  const handleToggleLogin = () => {
    if (step === null) {
      setStep("username");
      setAnchorEl(null);
      setErrorMsg(false);
    } else {
      setStep(null);
      setUsername("");
      setCode("");
      setErrorMsg(false);
    }
  };

  const handleDialogClose = () => {
    setStep(null);
    setUsername("");
    setCode("");
    setErrorMsg(false);
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
          backgroundColor: theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(30,30,30,0.90)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: "60px !important" }}>
            {/* Логотип */}
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
                alt="DAHA Логотип"
                style={{
                  height: "40px",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            {/* Правая часть */}
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontSize: "0.875rem",
                      }}
                    >
                      {username ? username.charAt(0).toUpperCase() : "?"}
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
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleToggleLogin}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: "8px",
                      px: 3,
                      py: 0.8,
                      fontSize: "0.95rem",
                      whiteSpace: "nowrap",
                      minWidth: "fit-content",
                      boxShadow: "none",
                      transition: "background-color 0.25s",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                        boxShadow: "none",
                      },
                    }}
                  >
                    {step == null ? "Вход" : "Скрыть"}
                  </Button>
                  <Dialog
                    open={Boolean(step)}
                    onClose={handleDialogClose}
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                      sx: {
                        p: { xs: 2, sm: 3 },
                        borderRadius: "14px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        backgroundColor: theme.palette.background.paper,
                        width: "100%",
                        boxSizing: "border-box"
                      },
                    }}
                  >
                    <DialogTitle sx={{ textAlign: "center", fontWeight: 700, pb: 1.5 }}>
                      Вход через Telegram
                    </DialogTitle>
                    <DialogContent sx={{ p: 0 }}>
                      {errorMsg ? (
                        <Box
                          sx={{
                            background: "#ffeded",
                            borderRadius: 2,
                            border: "1px solid #eb5656",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography variant="body1" color="error" sx={{ mb: 2, fontWeight: 500 }}>
                            Не удалось войти.
                          </Typography>
                          {botStepInstructions}
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Для входа сначала зарегистрируйтесь через бот в Telegram.
                            </Typography>
                          </Box>
                          {step === "username" && (
                            <Box component="form" onSubmit={handleRequestCode} sx={{ width: "100%", mt: 1 }}>
                              <TextField
                                inputRef={usernameInputRef}
                                fullWidth
                                label="Имя пользователя Telegram"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={handleUsernameKeyDown}
                                placeholder="Введите имя пользователя (например, @username)"
                                variant="outlined"
                                disabled={isLoading}
                                sx={{ mb: 2 }}
                              />
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={handleRequestCode}
                                disabled={isLoading || !username}
                                sx={{
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  py: 1.2,
                                  fontWeight: 600,
                                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                                  mb: 1,
                                }}
                              >
                                {isLoading ? "Отправка..." : "Получить код"}
                              </Button>
                            </Box>
                          )}
                          {step === "code" && (
                            <Box component="form" onSubmit={handleVerifyCode} sx={{ width: "100%", mt: 1 }}>
                              <TextField
                                inputRef={codeInputRef}
                                fullWidth
                                label="Код подтверждения"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                onKeyDown={handleCodeKeyDown}
                                placeholder="Введите 4–6-значный код"
                                variant="outlined"
                                disabled={isLoading}
                                sx={{ mb: 2 }}
                              />
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={handleVerifyCode}
                                disabled={isLoading || !code}
                                sx={{
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  py: 1.2,
                                  fontWeight: 600,
                                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                                  mb: 1,
                                }}
                              >
                                {isLoading ? "Проверка..." : "Войти"}
                              </Button>
                              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                Если возникли проблемы — воспользуйтесь ботом {TELEGRAM_BOT}.
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}
                      {isLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 1.5, mb: 0.5 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </DialogContent>
                  </Dialog>
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
