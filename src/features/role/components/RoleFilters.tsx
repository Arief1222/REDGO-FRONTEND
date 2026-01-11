import { Box, TextField, Button, Card, Badge } from '@/shared/components/venturo-ui';
import { IconFilterOff, IconSearch, IconFilter } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks';

interface RoleFiltersProps {
  search: string;
  isActive: boolean | undefined;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onReset: () => void;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({
  search,
  isActive,
  onSearchChange,
  onFilterClick,
  onReset,
}) => {
  // Local state for input (immediate update for responsive UI)
  const [inputValue, setInputValue] = useState(search);

  // Debounce the input value
  const debouncedSearch = useDebounce(inputValue, 500);

  // Update input value when search prop changes (e.g., from reset)
  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Count active filters
  const activeFiltersCount = [isActive !== undefined].filter(Boolean).length;

  return (
    <Card>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Search Input */}
        <TextField
          placeholder="Search roles..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 250 }}
          InputProps={{
            startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.5 }} />,
          }}
        />

        {/* Filter Button */}
        <Badge badgeContent={activeFiltersCount} color="primary">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<IconFilter size={18} />}
            onClick={onFilterClick}
          >
            Filter
          </Button>
        </Badge>

        {/* Reset Button */}
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<IconFilterOff size={18} />}
          onClick={onReset}
          disabled={!inputValue && activeFiltersCount === 0}
        >
          Reset
        </Button>
      </Box>
    </Card>
  );
};
