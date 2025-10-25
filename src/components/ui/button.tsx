import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

export interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", ...props }, ref) => {
    const muiVariant =
      variant === "default"
        ? "contained"
        : variant === "destructive"
        ? "contained"
        : variant === "outline"
        ? "outlined"
        : variant === "secondary"
        ? "contained"
        : variant === "ghost"
        ? "text"
        : "text";

    const muiSize =
      size === "default"
        ? "medium"
        : size === "sm"
        ? "small"
        : size === "lg"
        ? "large"
        : "medium";

    const sx = {
      ...(variant === "destructive" && {
        backgroundColor: "error.main",
        "&:hover": {
          backgroundColor: "error.dark",
        },
      }),
      ...(variant === "secondary" && {
        backgroundColor: "grey.200",
        color: "text.primary",
        "&:hover": {
          backgroundColor: "grey.300",
        },
      }),
      ...(variant === "ghost" && {
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }),
      ...(variant === "link" && {
        textDecoration: "underline",
        textTransform: "none",
        padding: 0,
        minWidth: "auto",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }),
      ...(size === "icon" && {
        minWidth: "auto",
        width: 40,
        height: 40,
        padding: 0,
      }),
    };

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        size={muiSize}
        sx={sx}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
