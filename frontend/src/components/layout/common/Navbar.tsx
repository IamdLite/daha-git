import { AppBar, Toolbar, Typography, Button, useTheme } from "@mui/material";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { registerUser } from "../../../api/users";

// Add the following TypeScript declaration to fix the ImportMeta.env error
// interface ImportMetaEnv {
//   readonly VITE_TELEGRAM_BOT_TOKEN: string;
//   readonly VITE_TELEGRAM_BOT_TOKEN_NAME: string;
//   // add other env variables here if needed
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }

const Navbar: React.FC = () => {
  const theme = useTheme();

  useEffect(() => {
    // Define Telegram auth callback
    (window as any).onTelegramAuth = async (user: {
      id: number;
      first_name: string;
      username?: string;
      auth_date: number;
      hash: string;
    }) => {
      try {
        // Validate Telegram data
        const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
        if (!botToken) {
          throw new Error("Telegram bot token is not configured");
        }

        // Create data-check-string for HMAC-SHA-256 validation
        const dataCheckString = Object.keys(user)
          .filter((key) => key !== "hash")
          .sort()
          .map((key) => `${key}=${user[key as keyof typeof user]}`)
          .join("\n");

        // Compute HMAC-SHA-256
        const encoder = new TextEncoder();
        const keyData = await crypto.subtle.digest("SHA-256", encoder.encode(botToken));
        const key = await crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const signature = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(dataCheckString)
        );
        const computedHash = Array.from(new Uint8Array(signature))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        if (computedHash !== user.hash) {
          throw new Error("Invalid Telegram data hash");
        }

        // Check auth_date (within 24 hours)
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - user.auth_date) > 86400) {
          throw new Error("Telegram auth data is outdated");
        }

        // Register user
        await registerUser({
          id: user.id,
          username: user.username || `user_${user.id}`,
          first_name: user.first_name,
        });

        toast.success("Successfully registered via Telegram!");
      } catch (error: any) {
        console.error("Telegram auth error:", error);
        toast.error(error.message || "Failed to register via Telegram");
      }
    };

    // Load Telegram Login Widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", process.env.REACT_APP_TELEGRAM_BOT_TOKEN_NAME as string);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        top: 0,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        zIndex: 1300,
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
            textDecoration: "none",
          }}
        >
          Daha Platform
        </Typography>
        <Button
          component={Link}
          to="/login"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: "50px", px: 2.5, mr: 2, fontWeight: 500 }}
        >
          Login
        </Button>
        <div id="telegram-login"></div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;