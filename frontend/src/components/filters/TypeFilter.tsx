import { FormControl, FormLabel, Box, useTheme, Typography } from '@mui/material';

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

const resourceTypes = ['Курс', 'Программа', 'Вебинар'] as const;

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedType, onChange }) => {
  const theme = useTheme();

  const handleClick = (type: string) => {
    if (selectedType === type) {
      onChange(null);
    } else {
      onChange(type);
    }
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
        }}
      >
        Тип ресурса
      </FormLabel>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {resourceTypes.map((type) => (
          <Box
            key={type}
            onClick={() => handleClick(type)}
            sx={{
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: selectedType === type ? theme.palette.primary.light : theme.palette.grey[100],
              color: selectedType === type ? theme.palette.primary.contrastText : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: selectedType === type ? theme.palette.primary.main : theme.palette.grey[200],
              },
            }}
          >
            <Typography variant="body2">{type}</Typography>
          </Box>
        ))}
      </Box>
    </FormControl>
  );
};

export default TypeFilter;