import { FormControl, FormLabel, Box, useTheme, Stack, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';

interface DifficultyFilterProps {
  selectedDifficulty: string[];
  onChange: (difficulty: string[]) => void;
}

const difficultyLevels = ['Начальный', 'Средний', 'Продвинутый'] as const; // Must match API level

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ selectedDifficulty, onChange }) => {
  const theme = useTheme();

  const handleClick = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      onChange(selectedDifficulty.filter((d) => d !== difficulty));
    } else {
      onChange([...selectedDifficulty, difficulty]);
    }
  };

  const difficultyLabels: Record<string, string> = {
    Начальный: 'Начальный',
    Средний: 'Средний',
    Продвинутый: 'Продвинутый',
  };

  const difficultyIcons: Record<string, React.ReactNode> = {
    Начальный: <SchoolIcon fontSize="small" />,
    Средний: <TrendingUpIcon fontSize="small" />,
    Продвинутый: <PsychologyIcon fontSize="small" />,
  };

  const difficultyColors: Record<string, string> = {
    Начальный: '#4caf50',
    Средний: '#ff9800',
    Продвинутый: '#f44336',
  };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
      <FormLabel
        component="legend"
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          color: theme.palette.text.primary,
          mb: 1.5,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
        }}
      >
        Уровень сложности
      </FormLabel>
      <Stack spacing={1.5}>
        {difficultyLevels.map((difficulty) => {
          const isSelected = selectedDifficulty.includes(difficulty);
          return (
            <Box
              key={difficulty}
              onClick={() => handleClick(difficulty)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isSelected
                  ? `${difficultyColors[difficulty]}10`
                  : theme.palette.grey[50],
                border: isSelected
                  ? `1px solid ${difficultyColors[difficulty]}30`
                  : `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: isSelected
                    ? `${difficultyColors[difficulty]}20`
                    : theme.palette.grey[100],
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected
                    ? difficultyColors[difficulty]
                    : 'rgba(0, 0, 0, 0.08)',
                  color: isSelected ? '#fff' : theme.palette.text.secondary,
                }}
              >
                {difficultyIcons[difficulty]}
              </Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isSelected
                    ? difficultyColors[difficulty]
                    : theme.palette.text.primary,
                  flex: 1,
                }}
              >
                {difficultyLabels[difficulty]}
              </Typography>
              {isSelected && (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: difficultyColors[difficulty],
                    ml: 1,
                  }}
                />
              )}
            </Box>
          );
        })}
      </Stack>
    </FormControl>
  );
};

export default DifficultyFilter;