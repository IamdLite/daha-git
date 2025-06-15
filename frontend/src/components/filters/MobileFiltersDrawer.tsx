
import { Drawer } from '@mui/material';
import FiltersPanel from './FiltersPanel';
import { FilterState, FilterHandlers } from '../../hooks/useFilters';
import { useEffect } from 'react';

interface MobileFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  handlers: FilterHandlers;
}

const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = ({ open, onClose, filters, handlers }) => {
  useEffect(() => {
    if (open) {
      // Close drawer when filters change
      return () => onClose();
    }
  }, [filters, onClose, open]);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '85%', sm: 350 },
          borderRadius: '0 16px 16px 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: '100vw',
        },
      }}
    >
      <FiltersPanel filters={filters} handlers={handlers} isMobile={true} onClose={onClose} />
    </Drawer>
  );
};

export default MobileFiltersDrawer;
