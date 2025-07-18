import { Card, CardContent, Typography, Button, Box, Chip, Stack, useTheme } from "@mui/material";
import React from "react";
import { Resource, Subject, DifficultyLevel } from "../../types";

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const theme = useTheme();
  
  // Format date to Russian format (e.g., "15 мая 2023")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    
    const monthsGenitive = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    
    const month = monthsGenitive[date.getMonth()];
    return `${day} ${month} ${year}`;
  };
  
  // Subject configuration
  const subjectConfig: Record<Subject, { label: string; color: string }> = {
    "Искусственный интеллект": { label: "Искусственный интеллект", color: "#3f51b5" },
    "Робототехника": { label: "Робототехника", color: "#9c27b0" },
    "Программирование": { label: "Программирование", color: "#00bfa5" },
    "Информационная безопасность": { label: "Информационная безопасность", color: "#f44336" },
    "Предпринимательство": { label: "Предпринимательство", color: "#ff9800" },
    "Финансовая грамотность": { label: "Финансовая грамотность", color: "#2196f3" },
    "Наука": { label: "Наука", color: "#4caf50" },
    "Математика": { label: "Математика", color: "#4caf50" },
    "Физика": { label: "Физика", color: "#ff9800" },
    "Химия": { label: "Химия", color: "#9c27b0" },
  };

  const difficultyLabels: Record<DifficultyLevel, string> = {
    "Начальный": "Уровень: начальный",
    "Средний": "Уровень: средний",
    "Продвинутый": "Уровень: продвинутый",
  };

  // Extract and normalize grades from resource
  const getGradeLabels = (): string[] => {
    if (resource.grades && Array.isArray(resource.grades)) {
      return resource.grades
        .map(grade => grade?.level?.toString())
        .filter((grade): grade is string => 
          grade !== undefined && 
          ["7", "8", "9", "10", "11"].includes(grade)
        );
    }
    
    if (resource.gradesEnum && Array.isArray(resource.gradesEnum)) {
      return resource.gradesEnum
        .filter((grade): grade is string => 
          grade !== undefined && 
          ["7", "8", "9", "10", "11"].includes(grade)
        );
    }
    
    return [];
  };

  const gradeLabelsToShow = getGradeLabels();
  const organizer = resource.provider || "Неизвестный организатор";
  const subject = resource.category?.name as Subject;
  const difficultyLevel = resource.level as DifficultyLevel;
  const startDate = resource.startDate || resource.created_at || "2025-06-01";
  const endDate = resource.endDate || resource.updated_at || "2025-12-31";

  return (
    <Card sx={{ 
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease",
      borderRadius: { xs: "6px", sm: "8px" },
      overflow: "visible",
      backgroundColor: "white",
      boxShadow: "none",
      border: "1px solid #e0e0e0",
      "&:hover": {
        borderColor: theme.palette.primary.main,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
      },
      position: "relative",
      mb: { xs: 2, sm: 3 },
      width: "100%"
    }}>
      <CardContent sx={{ 
        pt: { xs: 2, sm: 2.5, md: 3 },
        pb: { xs: 1.5, sm: 2 },
        flexGrow: 1, 
        px: { xs: 2, sm: 2.5, md: 3 },
        display: "flex", 
        flexDirection: "column",
        gap: { xs: 1, sm: 1.25, md: 1.5 }
      }}>
        {/* Title */}
        <Typography 
          component="div" 
          variant="h5" 
          sx={{ 
            fontSize: { xs: "1.15rem", sm: "1.3rem", md: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
            color: "#4361ee",
            mb: { xs: 0.5, sm: 0.75 }
          }}
        >
          {resource.title}
        </Typography>
        
        {/* Organizer */}
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
            mb: { xs: 0.75, sm: 1 },
            color: "#616161"
          }}
        >
          {organizer}
        </Typography>

        {/* Dates */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            mb: { xs: 1.25, sm: 1.75 },
            color: "#000",
            letterSpacing: "-0.01em"
          }}
        >
          {formatDate(startDate)} — {formatDate(endDate)}
        </Typography>

        {/* Grades and Difficulty Chips */}
        <Stack 
          direction="row" 
          spacing={{ xs: 0.5, sm: 0.75 }} 
          flexWrap="wrap" 
          useFlexGap 
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          {gradeLabelsToShow.map((grade) => (
            <Chip
              key={grade}
              label={`${grade} класс`}
              size="small"
              sx={{
                borderRadius: { xs: "4px", sm: "6px" },
                backgroundColor: "#f5f5f5",
                color: "#333",
                px: { xs: 0.5, sm: 1 },
                height: "auto",
                mb: 0.5,
                fontWeight: 500,
                fontSize: { xs: "0.75rem", sm: "0.8rem" }
              }}
            />
          ))}
          <Chip
            label={difficultyLabels[difficultyLevel]}
            size="small"
            sx={{
              borderRadius: { xs: "4px", sm: "6px" },
              backgroundColor: "#f0f7ff",
              color: "#0066cc",
              px: { xs: 0.5, sm: 1 },
              height: "auto",
              mb: 0.5,
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.8rem" }
            }}
          />
        </Stack>

        {/* Description */}
        <Box sx={{ mb: { xs: 1.75, sm: 2.25, md: 2.5 } }}>
          <Typography
            variant="body1"
            sx={{
              lineHeight: { xs: 1.45, sm: 1.5 },
              color: "#333333",
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" }
            }}
          >
            {resource.description}
          </Typography>
        </Box>

        {/* Subject Chip */}
        <Box sx={{ mb: { xs: 1.25, sm: 1.75 } }}>
          <Chip 
            label={subjectConfig[subject].label} 
            size="small" 
            sx={{ 
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              backgroundColor: `${subjectConfig[subject].color}10`,
              color: subjectConfig[subject].color,
              height: { xs: "26px", sm: "28px" },
              borderRadius: { xs: "4px", sm: "6px" },
              px: { xs: 0.5, sm: 0.75 },
              "&:hover": {
                backgroundColor: `${subjectConfig[subject].color}20`,
              }
            }}
          />
        </Box>
      </CardContent>
      
      {/* Link Button */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "flex-start", 
        px: { xs: 2, sm: 2.5, md: 3 }, 
        pb: { xs: 2, sm: 2.5, md: 3 },
        mt: "auto" 
      }}>
        <Button 
          variant="contained" 
          href={resource.url} 
          target="_blank" 
          rel="noopener"
          sx={{ 
            borderRadius: "4px",
            px: { xs: 2.5, sm: 3, md: 3.5 },
            py: { xs: 0.5, sm: 0.75 },
            fontWeight: 600,
            letterSpacing: "0.01em",
            fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.9rem" },
            boxShadow: "none",
            backgroundColor: "#000",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#333",
              boxShadow: "none"
            }
          }}
        >
          Ссылка на курс
        </Button>
      </Box>
    </Card>
  );
};

export default ResourceCard;