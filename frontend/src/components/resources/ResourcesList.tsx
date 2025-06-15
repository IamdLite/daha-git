import { Box, Typography } from '@mui/material';
import ResourceCard from './ResourceCard';
import { Resource } from '../../types';

interface ResourcesListProps {
  resources: Resource[];
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 1.5, sm: 2, md: 3 },
        px: { xs: 0.5, sm: 1 }
      }}>
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            fontWeight: 600
          }}
        >
          Найдено возможностей: {resources.length}
        </Typography>
      </Box>
      
      {resources.length > 0 ? (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: { xs: 2, sm: 3, md: 4 },
          width: '100%', 
          mx: 'auto' 
        }}>
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          py: { xs: 4, md: 6 }, 
          px: 2, 
          border: '1px dashed #ddd', 
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            По вашему запросу не найдено возможностей. Попробуйте изменить параметры фильтрации.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResourcesList;