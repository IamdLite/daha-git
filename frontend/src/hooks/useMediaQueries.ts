import { useMediaQuery, Theme } from '@mui/material';

export const useMediaQueries = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  return { isMobile };
};