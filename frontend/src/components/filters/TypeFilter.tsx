import { FormControl, FormLabel, Box, useTheme, Typography } from '@mui/material';
import { ResourceType } from '../../types';

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedType, onChange }) => {
  const theme = useTheme();
  
  const handleClick = (value: string | null) => {
    onChange(value === 'all' ? null : value);
  };

  const options = [
    { value: 'all', label: 'Все' },
    { value: ResourceType.COURSE, label: 'Курсы' },
  ];

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
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
        Мероприятия
      </FormLabel>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            width: '100%'
          }}
        >
          {options.map((option) => {
            const isSelected = 
              (option.value === 'all' && selectedType === null) || 
              selectedType === option.value;
            
            return (
              <Box
                key={option.value}
                onClick={() => handleClick(option.value === 'all' ? null : option.value)}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 1,
                  // Отступы для кнопок фильтра
                  px: 1,
                  borderRadius: '8px',
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
                  height: '36px'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {option.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </FormControl>
  );
};

export default TypeFilter;