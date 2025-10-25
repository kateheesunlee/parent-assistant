import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Close, Warning, Info, Error } from "@mui/icons-material";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationModalProps) {
  const getVariantConfig = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <Error color="error" />,
          severity: "error" as const,
          confirmColor: "error" as const,
        };
      case "warning":
        return {
          icon: <Warning color="warning" />,
          severity: "warning" as const,
          confirmColor: "warning" as const,
        };
      case "info":
        return {
          icon: <Info color="info" />,
          severity: "info" as const,
          confirmColor: "primary" as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {config.icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isLoading} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity={config.severity} sx={{ mb: 2 }}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          color={config.confirmColor}
          variant="contained"
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
