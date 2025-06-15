import { FormControl, FormLabel, Box, Chip, useTheme, Stack, Typography, Avatar } from '@mui/material';
import { Subject } from '../../types';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ScienceIcon from '@mui/icons-material/Science';

interface SubjectFilterProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
}

const SubjectFilter: React.FC<SubjectFilterProps> = ({ selectedSubjects, onChange }) => {
  const theme = useTheme();
  
  const handleClick = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      onChange(selectedSubjects.filter(s => s !== subject));
    } else {
      onChange([...selectedSubjects, subject]);
    }
  };

  const subjectLabels: Record<string, string> = {
    [Subject.AI]: 'Искусственный интеллект',
    [Subject.ROBOTICS]: 'Робототехника',
    [Subject.PROGRAMMING]: 'Программирование',
    [Subject.CYBERSECURITY]: 'Информационная безопасность',
    [Subject.ENTREPRENEURSHIP]: 'Предпринимательство',
    [Subject.FINANCIAL_LITERACY]: 'Финансовая грамотность',
    [Subject.SCIENCE]: 'Наука',
  };

  const subjectIcons: Record<string, React.ReactNode> = {
    [Subject.AI]: <SmartToyIcon fontSize="small" />,
    [Subject.ROBOTICS]: <PrecisionManufacturingIcon fontSize="small" />,
    [Subject.PROGRAMMING]: <CodeIcon fontSize="small" />,
    [Subject.CYBERSECURITY]: <SecurityIcon fontSize="small" />,
    [Subject.ENTREPRENEURSHIP]: <BusinessIcon fontSize="small" />,
    [Subject.FINANCIAL_LITERACY]: <AccountBalanceIcon fontSize="small" />,
    [Subject.SCIENCE]: <ScienceIcon fontSize="small" />,
  };

  const subjectColors: Record<string, string> = {
    [Subject.AI]: '#3f51b5',
    [Subject.ROBOTICS]: '#9c27b0',
    [Subject.PROGRAMMING]: '#00bfa5',
    [Subject.CYBERSECURITY]: '#f44336',
    [Subject.ENTREPRENEURSHIP]: '#ff9800',
    [Subject.FINANCIAL_LITERACY]: '#2196f3',
    [Subject.SCIENCE]: '#4caf50',
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
            color: theme.palette.text.primary
          }
        }}
      >
        Направления
      </FormLabel>
      <Stack spacing={1.5}>
        {Object.values(Subject).map((subject) => {
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
                }
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
                  color: isSelected 
                    ? '#fff'
                    : theme.palette.text.secondary,
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
                  flex: 1
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
                    ml: 1
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