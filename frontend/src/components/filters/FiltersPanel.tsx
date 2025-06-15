
import { Box, Button, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SubjectFilter from './SubjectFilter';
import DifficultyFilter from './DifficultyFilter';
import GradeFilter from './GradeFilter';
import { FilterState, FilterHandlers } from '../../hooks/useFilters';

interface FiltersPanelProps {
  filters: FilterState;
  handlers: FilterHandlers;
  isMobile: boolean;
  onClose?: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, handlers, isMobile, onClose }) => {
  const theme = useTheme();
  const { selectedSubjects, selectedDifficulty, selectedGrades } = filters;
  const { handleSubjectsChange, handleDifficultyChange, handleGradesChange, handleResetFilters } = handlers;
  const hasActiveFilters = selectedSubjects.length > 0 || selectedDifficulty.length > 0 || selectedGrades.length > 0;

  return (
    <Box
      sx={{
        position: isMobile ? 'static' : 'fixed',
        top: '96px', // Header (64px) + 32px padding
        left: { md: 'calc((280px + 16px) / 2)', lg: 'calc((320px + 16px) / 2)' }, // Centered
        width: { md: 280, lg: 320 },
        height: 'calc(100vh - 96px - 100px - 16px)', // Header, footer (~100px), 16px bottom
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        overflowY: 'auto',
        zIndex: 0, // Above Footer, below Header
        p: { xs: 2, md: 3 },
        pr: 3, // Right content padding
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(58, 123, 213, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <Box sx={{ mb: 3 }}>
        <SubjectFilter selectedSubjects={selectedSubjects} onChange={handleSubjectsChange} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <DifficultyFilter selectedDifficulty={selectedDifficulty} onChange={handleDifficultyChange} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <GradeFilter selectedGrades={selectedGrades} onChange={handleGradesChange} />
      </Box>
      {hasActiveFilters && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: 2,
          }}
        >
          <Button
            onClick={handleResetFilters}
            variant="outlined"
            startIcon={<RestartAltIcon />}
            size="medium"
            sx={{
              borderRadius: '50px',
              px: 2.5,
              py: 0.75,
              fontWeight: 500,
              borderWidth: '1.5px',
              '&:hover': {
                borderWidth: '1.5px',
                backgroundColor: 'rgba(63, 81, 181, 0.04)',
              },
            }}
          >
            Reset Filters
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FiltersPanel;
