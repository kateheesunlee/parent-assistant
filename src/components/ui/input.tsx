import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

export type InputProps = Omit<TextFieldProps, "variant">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ ...props }, ref) => {
    return <TextField ref={ref} variant="outlined" fullWidth {...props} />;
  }
);
Input.displayName = "Input";

export { Input };
