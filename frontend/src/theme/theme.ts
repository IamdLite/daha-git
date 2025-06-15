import { createTheme } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';

// Современная и минималистичная цветовая палитра
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Индиго - современный синий оттенок
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00bfa5', // Бирюзовый цвет
      light: '#5df2d6',
      dark: '#008e76',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Очень светлый фон с малозаметным оттенком
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c', // Почти черный для лучшей читаемости
      secondary: '#64748b', // Средне-серый для вторичного текста
    },
    error: {
      main: '#ef4444', // Яркий красный для ошибок
    },
    warning: {
      main: '#f59e0b', // Янтарный для предупреждений
    },
    info: {
      main: '#3b82f6', // Яркий синий для информации
    },
    success: {
      main: '#10b981', // Изумрудный для успешных действий
    },
  },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none', // Убираем капитализацию кнопок для современного вида
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12, // Увеличенное скругление для более современного вида
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `,
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.04)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #536dfe 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #00bfa5 30%, #1de9b6 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #009884 30%, #00bfa5 90%)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3f51b5',
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-h1, &.MuiTypography-h2, &.MuiTypography-h3, &.MuiTypography-h4, &.MuiTypography-h5, &.MuiTypography-h6': {
            marginBottom: '0.5em',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '8px 16px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 'auto',
            padding: '12px 24px',
            letterSpacing: '0.01em',
          },
        },
      },
    },
  },
}, ruRU);

export default theme;