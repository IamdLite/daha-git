import { Box, Pagination } from "@mui/material";
import React from "react";
import { Resource } from "../../types";
import ResourcesList from "./ResourcesList";

interface ResourcesSectionProps {
  resources: Resource[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  totalOpportunities: number;
  isLoading?: boolean; // Added isLoading prop
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({ resources, page, rowsPerPage, onPageChange, totalOpportunities, isLoading }) => {
  const paginatedResources = resources.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(totalOpportunities / rowsPerPage);

  return (
    <Box
      sx={{
        gridColumn: { xs: "1", md: "2" },
        minHeight: { xs: "50vh", sm: "60vh" },
        width: "100%",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ResourcesList
        resources={paginatedResources}
        totalOpportunities={totalOpportunities}
        isLoading={isLoading}
      />
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          color="primary"
          sx={{ mt: 2, alignSelf: "center" }}
        />
      )}
    </Box>
  );
};

export default ResourcesSection;