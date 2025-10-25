import React from "react";
import { FormLabel, FormLabelProps } from "@mui/material";

export type LabelProps = FormLabelProps;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ ...props }, ref) => <FormLabel ref={ref} {...props} />
);
Label.displayName = "Label";

export { Label };
