import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ChangeThemes from "../components/ChangesThemes";
import { useAuth } from "../contexts/AuthContext";
import { requestTelegramCode, verifyTelegramCode } from "../api/auth";
import { TextField, Button, Box, Typography } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";

// --------- NEW: util to fetch /users/me ----------
async function fetchMe(access_token: string): Promise<{ role: string }> {
  const resp = await fetch("https://daha.linkpc.net/api/users/me", {
    headers: {
      "accept": "application/json",
      "Authorization": `Bearer ${access_token}`,
    },
  });
  if (!resp.ok) throw new Error("Failed to fetch user info");
  return resp.json();
}
// -----------------------------------------------

const TELEGRAM_BOT = "@bot_DAHA_bot";
const TELEGRAM_BOT_LINK = "https://t.me/bot_DAHA_bot";

const botStepInstructions = (
  <Box sx={{ pb: 1 }}>
    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
      Для получения доступа выполните следующие шаги:
    </Typography>
    <Box component="ol" sx={{ pl: 3 }}>
      <li style={{ margin: "0 0 8px 0" }}>
        Перейдите в&nbsp;
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
            mt: "-2px",
            mb: "-2px",
            "&:hover": { background: "#229ed9cc" }
          }}
        >
          {TELEGRAM_BOT}
        </Button>
      </li>
      <li style={{ margin: "0 0 8px 0" }}>
        Введите в боте команду <b>/setfilters</b> и выберите свои предпочтения.
      </li>
      <li>
        Вернитесь на этот сайт и войдите, используя свой Telegram-логин.
      </li>
    </Box>
  </Box>
);

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"username" | "code">("username");
  const [error, setError] = useState("");
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "username" && usernameInputRef.current) usernameInputRef.current.focus();
    if (step === "code" && codeInputRef.current) codeInputRef.current.focus();
  }, [step]);

  // TG username logic unchanged...
  const validateUsername = (input: string): string => {
    if (!input) return "Введите ваш Telegram-логин.";
    if (!input.startsWith("@")) return "Имя пользователя должно начинаться с символа @.";
    const normalized = input.replace(/^@/, "");
    if (normalized.length < 5) return "Имя пользователя после @ — минимум 5 символов.";
    if (!/^[A-Za-z0-9_]+$/.test(normalized))
      return "Имя может содержать только латинские буквы, цифры и подчёркивания.";
    return "";
  };
  const validateCode = (input: string): string => {
    if (!input) return "Введите код подтверждения из Telegram.";
    if (!/^\d{4,6}$/.test(input)) return "Введите корректный 4–6-значный код.";
    return "";
  };

  const handleRequestCode = async () => {
    setError("");
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    setIsLoading(true);
    try {
      await requestTelegramCode({ username: username.replace(/^@/, "") });
      setStep("code");
      toast.success(
        <span>
          Код отправлен! Проверьте Telegram-бот&nbsp;
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
      setError("Не удалось отправить код. Выполните инструкции ниже.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- IMPORTANT: Only admins are allowed in! ---
  const handleVerifyCode = async () => {
    setError("");
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    const codeError = validateCode(code);
    if (codeError) {
      setError(codeError);
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyTelegramCode({
        username: username.replace(/^@/, ""),
        verification_code: code,
      });

      // Save token for following API calls
      setAuth(response.access_token);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("isAuthenticated", "true");

      // ---------- Check role via /users/me ----------
      let me;
      try {
        me = await fetchMe(response.access_token);
      } catch {
        setError("Не удалось получить данные пользователя. Попробуйте позже.");
        setIsLoading(false);
        return;
      }

      if (me.role !== "admin") {
        setAuth(null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("isAuthenticated");
        setError("У вас нет прав администратора. Доступ к порталу запрещён.");
        setIsLoading(false);
        return;
      }
      // ---------------------------------------------

      setIsLoading(false);
      toast.success("Вход выполнен! Перенаправляем...");
      navigate("/home", { replace: true });
    } catch {
      setError("Ошибка входа. Выполните инструкции ниже.");
      setIsLoading(false);
    }
  };
  // -----------------------------------------------

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

  const handleBack = () => {
    setError("");
    setStep("username");
    setCode("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
      }}
    >
      <div
        style={{
          minWidth: 340,
          maxWidth: 380,
          padding: "2.5rem 2rem 2rem 2rem",
          borderRadius: 18,
          background: "#fff",
          boxShadow: "0 6px 32px 0 rgba(60,72,88,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
          <ChangeThemes />
        </div>
        <Typography variant="h4" style={{ fontSize: 26, fontWeight: 700, color: "#3b3b3b", letterSpacing: 0.5 }}>
          DAHA Admin Portal
        </Typography>
        <Typography variant="h6" style={{ fontSize: 18, fontWeight: 500, color: "#6366f1" }}>
          Привет! 👋 Войдите для доступа.
        </Typography>

        {/* Ошибка или инструкция */}
        {error ? (
          <Box
            sx={{
              width: "100%",
              background: "#ffeded",
              border: "1px solid #eb5656",
              borderRadius: 3,
              mb: 1,
              px: 2.5,
              py: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="body1" color="error" sx={{ mb: 1.5, fontWeight: 600 }}>
              {error}
            </Typography>
            {botStepInstructions}
            <Button
              onClick={handleBack}
              variant="outlined"
              color="primary"
              sx={{ mt: 2, borderRadius: 2, textTransform: "none", alignSelf: "stretch" }}
            >
              Назад
            </Button>
          </Box>
        ) : step === "username" ? (
          <Box
            component="form"
            sx={{ width: "100%", mt: 2 }}
            onSubmit={e => {
              e.preventDefault();
              handleRequestCode();
            }}
          >
            <TextField
              fullWidth
              label="Имя пользователя Telegram"
              value={username}
              inputRef={usernameInputRef}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleUsernameKeyDown}
              placeholder="@username"
              variant="outlined"
              disabled={isLoading}
              sx={{ mb: 2 }}
              error={!!validateUsername(username)}
              helperText={validateUsername(username) || " "}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestCode}
              disabled={isLoading || !!validateUsername(username)}
              sx={{
                backgroundColor: "#6366f1",
                color: "#fff",
                textTransform: "none",
                borderRadius: "8px",
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#4f46e5" },
              }}
            >
              {isLoading ? "Отправка..." : "Получить код"}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              Для входа сначала зарегистрируйтесь через Telegram-бота {TELEGRAM_BOT}.
            </Typography>
            <Button
              component="a"
              href={TELEGRAM_BOT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<TelegramIcon />}
              sx={{
                mt: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Перейти в бота
            </Button>
          </Box>
        ) : (
          // step === "code"
          <Box
            component="form"
            sx={{ width: "100%", mt: 2 }}
            onSubmit={e => {
              e.preventDefault();
              handleVerifyCode();
            }}
          >
            <TextField
              fullWidth
              label="Код подтверждения"
              inputRef={codeInputRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleCodeKeyDown}
              placeholder="Введите 4–6-значный код"
              variant="outlined"
              disabled={isLoading}
              sx={{ mb: 2 }}
              error={!!validateCode(code)}
              helperText={validateCode(code) || " "}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              disabled={
                isLoading ||
                !!validateUsername(username) ||
                !!validateCode(code)
              }
              sx={{
                backgroundColor: "#6366f1",
                color: "#fff",
                textTransform: "none",
                borderRadius: "8px",
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#4f46e5" },
              }}
            >
              {isLoading ? "Проверка..." : "Войти"}
            </Button>
            <Button
              onClick={handleBack}
              fullWidth
              variant="outlined"
              sx={{
                mt: 1.5,
                borderRadius: 2,
                textTransform: "none",
              }}
              disabled={isLoading}
            >
              Назад
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              Если возникли проблемы — воспользуйтесь кнопкой ниже и зарегистрируйтесь через {TELEGRAM_BOT}.
            </Typography>
            <Button
              component="a"
              href={TELEGRAM_BOT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<TelegramIcon />}
              sx={{
                mt: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Перейти в бота
            </Button>
          </Box>
        )}

        {isLoading && !error && (
          <Typography style={{ color: "#6366f1", fontSize: 14, textAlign: "center", marginTop: 8 }}>
            Пожалуйста, подождите...
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Login;
