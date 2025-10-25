"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import {
  Alert,
  AlertTitle,
  IconButton,
  Slide,
  Box,
  useTheme,
} from "@mui/material";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // Wait for animation
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} color={theme.palette.success.main} />;
      case "error":
        return <AlertCircle size={20} color={theme.palette.error.main} />;
      case "warning":
        return <AlertTriangle size={20} color={theme.palette.warning.main} />;
      case "info":
        return <Info size={20} color={theme.palette.info.main} />;
      default:
        return <Info size={20} color={theme.palette.info.main} />;
    }
  };

  const getSeverity = (): "success" | "error" | "warning" | "info" => {
    return toast.type as "success" | "error" | "warning" | "info";
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <Slide direction="left" in={isVisible} mountOnEnter unmountOnExit>
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Alert
          severity={getSeverity()}
          icon={getIcon()}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <X size={16} />
            </IconButton>
          }
          sx={{
            boxShadow: theme.shadows[3],
            borderRadius: 1,
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          {toast.title && <AlertTitle>{toast.title}</AlertTitle>}
          {toast.message}
        </Alert>
      </Box>
    </Slide>
  );
};

export default ToastComponent;
