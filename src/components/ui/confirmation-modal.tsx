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
import { X, AlertTriangle, Info, AlertCircle } from "lucide-react";

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
          icon: <AlertCircle size={24} color="error.main`" />,
          severity: "error" as const,
          confirmColor: "error" as const,
        };
      case "warning":
        return {
          icon: <AlertTriangle size={24} color="warning.main" />,
          severity: "warning" as const,
          confirmColor: "warning" as const,
        };
      case "info":
        return {
          icon: <Info size={24} color="info.main" />,
          severity: "info" as const,
          confirmColor: "primary" as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ padding: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {config.icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={isLoading} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 2 }}>
        <Alert severity={config.severity}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </DialogContent>

      <DialogActions
        sx={{
          padding: 2,
          paddingTop: 0,
        }}
      >
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
