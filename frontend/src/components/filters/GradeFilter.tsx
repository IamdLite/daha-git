import { FormControl, FormLabel, Box, useTheme, Typography } from "@mui/material";
// Define grade values as an array
const GRADE_VALUES = ["7", "8", "9", "10", "11"] as const;
type Grade = typeof GRADE_VALUES[number]; // "7" | "8" | "9" | "10" | "11"

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

  // Define grade labels
  const gradeLabels: Record<Grade, string> = {
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "11": "11",
  };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ width: "100%" }}>
      <FormLabel 
        component="legend" 
        sx={{ 
          fontWeight: 600,
          fontSize: "1rem",
          color: theme.palette.text.primary,
          mb: 1.5,
          "&.Mui-focused": {
            color: theme.palette.text.primary
          }
        }}
      >
        Классы
      </FormLabel>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 0.8,
          flexWrap: "nowrap"
        }}
      >
        {GRADE_VALUES.map((grade) => {
          const isSelected = selectedGrades.includes(grade);
          return (
            <Box
              key={grade}
              onClick={() => handleClick(grade)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isSelected 
                  ? theme.palette.primary.main
                  : theme.palette.grey[50],
                color: isSelected 
                  ? "#fff"
                  : theme.palette.text.primary,
                border: isSelected 
                  ? `1px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
                "&:hover": {
                  backgroundColor: isSelected 
                    ? theme.palette.primary.dark
                    : theme.palette.grey[100],
                  transform: "translateY(-2px)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                },
                width: "34px",
                height: "34px",
                padding: 0,
                flexShrink: 0
              }}
            >
              <Typography 
                sx={{ 
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textAlign: "center",
                  color: isSelected ? "#fff" : "inherit"
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