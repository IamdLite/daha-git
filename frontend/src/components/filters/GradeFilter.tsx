import { FormControl, FormLabel, Box, Grid as MuiGrid, useTheme, Typography } from '@mui/material';
import { Grade } from '../../types';

// Создаем корректные компоненты Grid для MUI v5
const Grid = MuiGrid;
const Item = (props: any) => <MuiGrid item {...props} />;

interface GradeFilterProps {
  selectedGrades: string[];
  onChange: (grades: string[]) => void;
}

const GradeFilter: React.FC<GradeFilterProps> = ({ selectedGrades, onChange }) => {
  const theme = useTheme();
  
  const handleClick = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter(g => g !== grade));
    } else {
      onChange([...selectedGrades, grade]);
    }
  };

  // Изменяем надписи, убирая слово "класс"
  const gradeLabels: Record<string, string> = {
    [Grade.GRADE_7]: '7',
    [Grade.GRADE_8]: '8',
    [Grade.GRADE_9]: '9',
    [Grade.GRADE_10]: '10',
    [Grade.GRADE_11]: '11',
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
        Классы
      </FormLabel>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 0.8, // Уменьшаем отступ между элементами
          flexWrap: 'nowrap' // Запрещаем перенос на новую строку
        }}
      >
        {Object.values(Grade).map((grade) => {
          const isSelected = selectedGrades.includes(grade);
          return (
            <Box
              key={grade}
              onClick={() => handleClick(grade)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isSelected 
                  ? theme.palette.primary.main
                  : theme.palette.grey[50],
                color: isSelected 
                  ? '#fff'
                  : theme.palette.text.primary,
                border: isSelected 
                  ? `1px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: isSelected 
                    ? theme.palette.primary.dark
                    : theme.palette.grey[100],
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                },
                width: '34px',
                height: '34px',
                padding: 0,
                flexShrink: 0
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  color: isSelected ? '#fff' : 'inherit'
                }}
              >
                {gradeLabels[grade]}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </FormControl>
  );
};

export default GradeFilter;