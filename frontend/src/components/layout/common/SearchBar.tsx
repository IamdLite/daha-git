
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCallback } from 'react';
import { debounce } from 'lodash';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const debouncedSearchChange = useCallback(
    debounce((value: string) => onSearchChange(value), 300),
    [onSearchChange]
  );

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search courses..."
      value={searchQuery}
      onChange={(e) => debouncedSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        sx: {
          borderRadius: '50px',
          backgroundColor: 'background.paper',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
        },
      }}
      sx={{ maxWidth: { xs: '100%', md: 600 }, mx: 'auto', mb: 2 }}
    />
  );
};

export default SearchBar;
