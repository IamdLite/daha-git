import {
  FormControl,
  FormLabel,
  Box,
  useTheme,
  Stack,
  Typography,
  Avatar,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import CalculateIcon from '@mui/icons-material/Calculate';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BoltIcon from '@mui/icons-material/Bolt';
import ScienceIcon from '@mui/icons-material/Science';
import BuildIcon from '@mui/icons-material/Build';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExperimentIcon from '@mui/icons-material/Science';
import { Subject } from '../../types';

interface SubjectFilterProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
}

const subjects: Subject[] = [
  'Программирование',
  'Математика',
  'Искусственный интеллект',
  'Физика',
  'Химия',
  'Робототехника',
  'Информационная безопасность',
  'Предпринимательство',
  'Финансовая грамотность',
  'Наука',
]; // All Subject values, adjust if API subset needed

const SubjectFilter: React.FC<SubjectFilterProps> = ({ selectedSubjects, onChange }) => {
  const theme = useTheme();

  const handleClick = (subject: Subject) => {
    if (selectedSubjects.includes(subject)) {
      onChange(selectedSubjects.filter((s) => s !== subject));
    } else {
      onChange([...selectedSubjects, subject]);
    }
  };

  const subjectLabels: Record<Subject, string> = {
    Программирование: 'Программирование',
    Математика: 'Математика',
    'Искусственный интеллект': 'Искусственный интеллект',
    Физика: 'Физика',
    Химия: 'Химия',
    Робототехника: 'Робототехника',
    'Информационная безопасность': 'Информационная безопасность',
    Предпринимательство: 'Предпринимательство',
    'Финансовая грамотность': 'Финансовая грамотность',
    Наука: 'Наука',
  };

  const subjectIcons: Record<Subject, React.ReactNode> = {
    Программирование: <CodeIcon fontSize="small" />,
    Математика: <CalculateIcon fontSize="small" />,
    'Искусственный интеллект': <PsychologyIcon fontSize="small" />,
    Физика: <BoltIcon fontSize="small" />,
    Химия: <ScienceIcon fontSize="small" />,
    Робототехника: <BuildIcon fontSize="small" />,
    'Информационная безопасность': <SecurityIcon fontSize="small" />,
    Предпринимательство: <BusinessIcon fontSize="small" />,
    'Финансовая грамотность': <AccountBalanceIcon fontSize="small" />,
    Наука: <ExperimentIcon fontSize="small" />,
  };

  const subjectColors: Record<Subject, string> = {
    Программирование: '#1976d2',
    Математика: '#4caf50',
    'Искусственный интеллект': '#f44336',
    Физика: '#ff9800',
    Химия: '#9c27b0',
    Робототехника: '#9c27b0',
    'Информационная безопасность': '#f44336',
    Предпринимательство: '#ff9800',
    'Финансовая грамотность': '#2196f3',
    Наука: '#4caf50',
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
        Предмет
      </FormLabel>
      <Stack spacing={1.5}>
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject);
          return (
            <Box
              key={subject}
              onClick={() => handleClick(subject)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isSelected
                  ? `${subjectColors[subject]}10`
                  : theme.palette.grey[50],
                border: isSelected
                  ? `1px solid ${subjectColors[subject]}30`
                  : `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: isSelected
                    ? `${subjectColors[subject]}20`
                    : theme.palette.grey[100],
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  mr: 1.5,
                  backgroundColor: isSelected
                    ? subjectColors[subject]
                    : 'rgba(0, 0, 0, 0.08)',
                  color: isSelected ? '#fff' : theme.palette.text.secondary,
                }}
              >
                {subjectIcons[subject]}
              </Avatar>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isSelected
                    ? subjectColors[subject]
                    : theme.palette.text.primary,
                  flex: 1,
                }}
              >
                {subjectLabels[subject]}
              </Typography>
              {isSelected && (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: subjectColors[subject],
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

export default SubjectFilter;