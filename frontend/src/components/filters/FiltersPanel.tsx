import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FilterState, FilterHandlers } from "../../hooks/useFilters";
import DifficultyFilter from "./DifficultyFilter";
import GradeFilter from "./GradeFilter";
import SubjectFilter from "./SubjectFilter";

interface FiltersPanelProps {
  filters: FilterState;
  handlers: FilterHandlers;
  isMobile: boolean;
  onClose?: () => void;
  cardStart?: number;      // Left X of cards in px
  panelGap?: number;       // Desired gap between panel and cards
  footerHeight?: number;
  setPanelLeft?: (left: number) => void; // Parent syncs margin-left for cards
}

const FILTER_PANEL_WIDTH = 340;
const INITIAL_PANEL_LEFT = 150;

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  handlers,
  isMobile,
  onClose,
  cardStart = 400,   
  panelGap = 24,
  footerHeight = 80,
  setPanelLeft,
}) => {
  const theme = useTheme();
  const { selectedSubjects, selectedDifficulty, selectedGrades } = filters;
  const { handleSubjectsChange, handleDifficultyChange, handleGradesChange, handleResetFilters } = handlers;
  const hasActiveFilters =
    selectedSubjects.length > 0 || selectedDifficulty.length > 0 || selectedGrades.length > 0;

  // Shifting logic
  const [panelLeft, _setPanelLeft] = useState(INITIAL_PANEL_LEFT);
  useEffect(() => {
    function handleResize() {
      // Where would the panel need to be to never overlap cards?
      const maxLeft = Math.max(0, cardStart - panelGap - FILTER_PANEL_WIDTH);
      const nextLeft = Math.min(INITIAL_PANEL_LEFT, maxLeft);
      _setPanelLeft(nextLeft);
      setPanelLeft?.(nextLeft);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [cardStart, panelGap, setPanelLeft]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: 0, sm: "96px" },
        left: { xs: 0, sm: `${panelLeft}px` },
        width: { xs: "100%", sm: FILTER_PANEL_WIDTH },
        maxWidth: { xs: "100%", sm: FILTER_PANEL_WIDTH },
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
        "&::-webkit-scrollbar": { width: "7px" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.action.selected,
          borderRadius: "3px"
        }
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
              "&:hover": { backgroundColor: theme.palette.primary.dark },
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
