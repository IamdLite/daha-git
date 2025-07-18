import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { FilterState, FilterHandlers } from "../../hooks/useFilters";
import DifficultyFilter from "./DifficultyFilter";
import GradeFilter from "./GradeFilter";
import SubjectFilter from "./SubjectFilter";

interface FiltersPanelProps {
  filters: FilterState;
  handlers: FilterHandlers;
  isMobile: boolean;
  onClose?: () => void;
  contentWidth?: number;
  cardStart?: number;      // Left X of cards in px
  panelGap?: number;       // Desired gap between panel and cards
  footerHeight?: number;
}

const FILTER_PANEL_WIDTH = 340;

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  handlers,
  isMobile,
  onClose,
  contentWidth = 1200,
  cardStart = 270,       // Example: cards start at 270px from left
  panelGap = 24,         // Gap between panel and cards
  footerHeight = 80,
}) => {
  const theme = useTheme();
  const { selectedSubjects, selectedDifficulty, selectedGrades } = filters;
  const { handleSubjectsChange, handleDifficultyChange, handleGradesChange, handleResetFilters } = handlers;
  const hasActiveFilters =
    selectedSubjects.length > 0 || selectedDifficulty.length > 0 || selectedGrades.length > 0;

  // Calculate left for desktop:
  // (panel sits flush with left edge, but keeps its right edge gap from cards)
  const panelLeft = 150;  // Left margin from viewport (customize as needed)
  const maxRight = cardStart - panelGap; // Make sure panel's right edge < card's left edge

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 0, sm: "96px" },
        left: { xs: 0, sm: panelLeft },
        width: { xs: "100%", sm: FILTER_PANEL_WIDTH },
        maxWidth: { xs: "100%", sm: FILTER_PANEL_WIDTH },
        right: { xs: 0, sm: "auto" },
        minHeight: { xs: `calc(100vh - ${footerHeight}px)`, sm: `calc(100vh - 96px - ${footerHeight}px)` },
        maxHeight: { xs: `calc(100vh - ${footerHeight}px)`, sm: `calc(100vh - 96px - ${footerHeight}px)` },
        background: theme.palette.mode === "light"
          ? theme.palette.grey[50]
          : theme.palette.background.default,
        borderRadius: { xs: 0, sm: "0 14px 14px 0" },
        border: { xs: 0, sm: `1.5px solid ${theme.palette.divider}` },
        boxShadow: { xs: theme.shadows[8], sm: theme.shadows[16] },
        zIndex: theme.zIndex.drawer + 2,
        p: { xs: 2.5, sm: 3 },
        mb: { xs: 0, sm: 3 },
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        transition: "all .3s cubic-bezier(.4,0,.2,1)",
        pb: { xs: `calc(${footerHeight}px + 16px)`, sm: 4 },
        outline: `2px solid ${theme.palette.primary.light}`,
        outlineOffset: "-2px",
        "&:focus": { outline: `2px solid ${theme.palette.primary.main}` },
        "&::-webkit-scrollbar": {
          width: "7px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.action.selected,
          borderRadius: "3px"
        },
        // Prevent panel from overlapping card area
        maxRight: { sm: maxRight },
      }}
      tabIndex={-1}
      aria-label="Фильтры"
    >
      {isMobile && (
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          position: "sticky",
          top: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 3,
          pt: 1,
          pb: 2,
          borderBottom: `1.5px solid ${theme.palette.divider}`,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Фильтры
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                backgroundColor: theme.palette.action.hover,
              }
            }}
            aria-label="Закрыть фильтры"
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
      <Box sx={{ flexGrow: 1 }} />
      {hasActiveFilters && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: 2.5,
            pb: 2,
            position: isMobile ? "sticky" : "static",
            bottom: isMobile ? 0 : "unset",
            backgroundColor: theme.palette.background.paper,
            zIndex: 3,
          }}
        >
          <Button
            onClick={handleResetFilters}
            variant="contained"
            color="primary"
            startIcon={<RestartAltIcon />}
            size="medium"
            fullWidth={isMobile}
            sx={{
              borderRadius: "28px",
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: 1,
              maxWidth: "200px",
              textTransform: "none",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Сбросить фильтры
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FiltersPanel;
