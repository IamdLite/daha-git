
import { Container, Box, IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Header from './common/Header';
import SearchBar from './common/SearchBar';
import FiltersPanel from '../filters/FiltersPanel';
import MobileFiltersDrawer from '../filters/MobileFiltersDrawer';
import ResourcesSection from '../resources/ResourcesSection';
import Footer from './common/Footer';
import { useFilters } from '../../hooks/useFilters';
import { useMediaQueries } from '../../hooks/useMediaQueries';
import { useState } from 'react';

const MainPage: React.FC = () => {
  const { filters, handlers, filteredResources } = useFilters();
  const { isMobile } = useMediaQueries();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Ensure Footer stays at bottom
      }}
    >
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          paddingTop: '96px', // Header (64px) + 32px padding
          paddingBottom: '116px', // Footer (~80px) + 36px padding
          px: { xs: 1.5, sm: 2, md: 2, lg: 2 },
          flexGrow: 1, // Push Footer down
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 2, md: 2 },
            width: '100%',
          }}
        >
          <SearchBar searchQuery={filters.searchQuery} onSearchChange={handlers.handleSearchChange} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '296px 1fr', lg: '336px 1fr' }, // Panel + 16px
              gap: { md: 2, lg: 2 }, // 16px
              width: '100%',
              mx: 'auto',
            }}
          >
            {!isMobile && (
              <Box sx={{ minWidth: { md: 296, lg: 336 } }}>
                <FiltersPanel filters={filters} handlers={handlers} isMobile={false} />
              </Box>
            )}
            {isMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton
                  color="primary"
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{
                    border: theme => `1px solid ${theme.palette.divider}`,
                    borderRadius: '50px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <FilterAltIcon />
                </IconButton>
              </Box>
            )}
            <Box sx={{ pl: { md: 2, lg: 2 } }}>
              <ResourcesSection
                resources={filteredResources}
                page={filters.page}
                rowsPerPage={filters.rowsPerPage}
                onPageChange={handlers.handlePageChange}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainPage;
