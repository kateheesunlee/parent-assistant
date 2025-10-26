"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material";
import { useChildren } from "@/hooks/useChildren";
import ChildCard from "@/components/ChildCard";
import { PlusIcon } from "lucide-react";

const ChildrenPage = () => {
  const [showAddChild, setShowAddChild] = useState(false);
  const { children, isLoading, error } = useChildren();
  const handleAddChild = () => {
    setShowAddChild(true);
    // scroll to the add child card
    setTimeout(() => {
      const addChildCard = document.getElementById("add-child-card");
      if (addChildCard) {
        addChildCard.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" component="h1">
            Children
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {`Manage your children's information and Gmail labels and filters.`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddChild}
          startIcon={<PlusIcon size={16} />}
        >
          Add child
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Existing children */}
        {children.map((child) => (
          <ChildCard key={child.id} child={child} />
        ))}

        {/* Empty state */}
        {children.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No children added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click the button below to add your first child
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddChild}
              startIcon={<PlusIcon size={16} />}
            >
              Add child
            </Button>
          </Box>
        )}

        {/* Add new child card */}
        {showAddChild && (
          <Box id="add-child-card">
            <ChildCard handleClose={() => setShowAddChild(false)} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ChildrenPage;
